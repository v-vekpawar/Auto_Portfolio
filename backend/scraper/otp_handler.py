"""
OTP Handler for LinkedIn 2FA Verification
Handles both manual OTP input and automatic OTP generation from 2FA secrets
"""

import os
import time
import logging

logger = logging.getLogger(__name__)


class OTPHandler:
    """Handle OTP verification for LinkedIn login"""
    
    def __init__(self):
        """Initialize OTP Handler"""
        self.pyotp_available = self._check_pyotp()
    
    def _check_pyotp(self):
        """Check if pyotp library is available"""
        try:
            import pyotp
            logger.info("✅ pyotp library is available for automatic OTP generation")
            return True
        except ImportError:
            logger.warning("⚠️ pyotp not installed. Automatic OTP generation disabled.")
            logger.info("💡 Install with: pip install pyotp")
            return False
    
    def _generate_otp_from_secret(self, email):
        """
        Generate OTP from 2FA secret key
        
        Args:
            email: The email address of the account
            
        Returns:
            str: 6-digit OTP code or None if generation fails
        """
        if not self.pyotp_available:
            return None
        
        try:
            import pyotp
            
            # Convert email to environment variable format
            # Example: dummy1@gmail.com -> LINKEDIN_2FA_SECRET_dummy1_at_gmail_com
            env_var_name = f"LINKEDIN_2FA_SECRET_{email.replace('@', '_at_').replace('.', '_')}"
            secret_key = os.getenv(env_var_name, '')
            
            if not secret_key:
                logger.info(f"💡 No 2FA secret found for {email}")
                logger.info(f"💡 Set environment variable: {env_var_name}")
                return None
            
            # Generate OTP using TOTP (Time-based One-Time Password)
            totp = pyotp.TOTP(secret_key)
            otp_code = totp.now()
            
            logger.info(f"✅ Generated OTP from 2FA secret for {email}")
            return otp_code
            
        except Exception as e:
            logger.error(f"❌ Error generating OTP from secret: {e}")
            return None
    
    def _get_manual_otp(self, email):
        """
        Get manually provided OTP from environment variable
        
        Args:
            email: The email address of the account
            
        Returns:
            str: 6-digit OTP code or None if not found
        """
        # Convert email to environment variable format
        # Example: dummy1@gmail.com -> LINKEDIN_OTP_dummy1_at_gmail_com
        env_var_name = f"LINKEDIN_OTP_{email.replace('@', '_at_').replace('.', '_')}"
        otp_code = os.getenv(env_var_name, '')
        
        if otp_code:
            logger.info(f"✅ Found manual OTP in environment for {email}")
            return otp_code
        
        logger.info(f"💡 No manual OTP found for {email}")
        logger.info(f"💡 Set environment variable: {env_var_name}")
        return None
    
    def get_otp_code(self, email):
        """
        Get OTP code - tries automatic generation first, then manual
        
        Args:
            email: The email address of the account
            
        Returns:
            str: 6-digit OTP code or None if not available
        """
        # Try automatic OTP generation from 2FA secret (recommended)
        otp_code = self._generate_otp_from_secret(email)
        if otp_code:
            return otp_code
        
        # Fallback to manually provided OTP
        otp_code = self._get_manual_otp(email)
        if otp_code:
            return otp_code
        
        logger.error(f"❌ No OTP available for {email}")
        logger.info("💡 Options:")
        logger.info(f"   1. Set 2FA secret: LINKEDIN_2FA_SECRET_{email.replace('@', '_at_').replace('.', '_')}")
        logger.info(f"   2. Set manual OTP: LINKEDIN_OTP_{email.replace('@', '_at_').replace('.', '_')}")
        
        return None
    
    def handle_otp_verification(self, page, email):
        """
        Handle OTP verification on LinkedIn login page
        
        Args:
            page: Playwright page object
            email: Email address of the account being logged in
            
        Returns:
            bool: True if OTP was successfully handled, False otherwise
        """
        try:
            logger.info(f"🔐 Attempting to handle OTP verification for {email}")
            
            # Wait for the OTP page to fully load
            logger.info("⏳ Waiting for OTP verification page to load...")
            
            # Wait for page to stabilize and load verification elements
            try:
                # Wait for any of these elements that indicate OTP page
                page.wait_for_selector("div.form__content, input[name='pin'], input[validation='pin']", timeout=10000)
                logger.info("✅ OTP page elements detected")
            except:
                logger.warning("⚠️ OTP page elements not detected, proceeding anyway...")
            
            time.sleep(2)  # Additional wait for dynamic content
            
            # Try different OTP input selectors based on actual LinkedIn HTML
            otp_selectors = [
                # Most specific selector based on your HTML
                "input#input__phone_verification_pin",
                "input[name='pin'][validation='pin']",
                "input.form__input--text.input_verification_pin",
                
                # Fallback selectors
                "div.form__content input[name='pin']",
                "input[id='input__phone_verification_pin']",
                "input[validation='pin']",
                "input[name='pin']",
                "input[maxlength='6'][type='tel']",
                "input[pattern*='0-9']",
                "input[aria-label*='code']",
                "input[aria-label*='Code']",
                "input[type='tel'][maxlength='6']",
                
                # XPath-style selectors (converted to CSS)
                "div[class*='form__content'] input[name='pin']",
                "div[class*='form__content'] input[type='tel']",
                
                # Generic fallbacks
                "input[placeholder*='code']",
                "input[placeholder*='Code']",
                "input[id*='verification']",
                "input[id*='pin']"
            ]
            
            # First, let's debug what's actually on the page
            logger.info("🔍 Debugging: Looking for OTP input field...")
            
            # Check if we're on the right page
            page_content = page.content()
            if "verification" in page_content.lower() or "pin" in page_content.lower():
                logger.info("✅ Detected verification/PIN page")
            else:
                logger.warning("⚠️ May not be on OTP verification page")
            
            # Try to find the form__content div first
            form_content = None
            try:
                form_content = page.wait_for_selector("div.form__content", timeout=5000)
                if form_content:
                    logger.info("✅ Found form__content div")
                else:
                    logger.warning("⚠️ form__content div not found")
            except:
                logger.warning("⚠️ form__content div not found")
            
            # Now try to find the OTP input
            otp_input = None
            successful_selector = None
            
            for i, selector in enumerate(otp_selectors):
                try:
                    logger.info(f"🔍 Trying selector {i+1}/{len(otp_selectors)}: {selector}")
                    otp_input = page.wait_for_selector(selector, timeout=2000)
                    if otp_input:
                        successful_selector = selector
                        logger.info(f"✅ Found OTP input field with: {selector}")
                        break
                except Exception as e:
                    logger.debug(f"❌ Selector failed: {selector} - {str(e)}")
                    continue
            
            # If CSS selectors fail, try XPath
            if not otp_input:
                logger.info("🔍 CSS selectors failed, trying XPath...")
                xpath_selectors = [
                    "//div[contains(@class, 'form__content')]//input[@name='pin']",
                    "//input[@id='input__phone_verification_pin']",
                    "//input[@validation='pin']",
                    "//input[@name='pin' and @maxlength='6']",
                    "//input[@type='tel' and @maxlength='6']",
                    "//input[contains(@class, 'input_verification_pin')]"
                ]
                
                for xpath in xpath_selectors:
                    try:
                        logger.info(f"🔍 Trying XPath: {xpath}")
                        otp_input = page.wait_for_selector(f"xpath={xpath}", timeout=2000)
                        if otp_input:
                            successful_selector = f"xpath={xpath}"
                            logger.info(f"✅ Found OTP input field with XPath: {xpath}")
                            break
                    except Exception as e:
                        logger.debug(f"❌ XPath failed: {xpath} - {str(e)}")
                        continue
            
            if not otp_input:
                logger.error("❌ Could not find OTP input field with any selector")
                
                # Debug: Save page screenshot and HTML for analysis
                try:
                    logger.info("📸 Saving debug information...")
                    page.screenshot(path="debug_otp_page.png")
                    with open("debug_otp_page.html", "w", encoding="utf-8") as f:
                        f.write(page.content())
                    logger.info("💾 Saved debug_otp_page.png and debug_otp_page.html")
                except:
                    pass
                
                # Try to find any input fields on the page
                all_inputs = page.query_selector_all("input")
                logger.info(f"🔍 Found {len(all_inputs)} input fields on page:")
                for i, inp in enumerate(all_inputs[:10]):  # Show first 10
                    try:
                        attrs = {
                            'id': inp.get_attribute('id'),
                            'name': inp.get_attribute('name'),
                            'class': inp.get_attribute('class'),
                            'type': inp.get_attribute('type'),
                            'maxlength': inp.get_attribute('maxlength')
                        }
                        attrs = {k: v for k, v in attrs.items() if v}  # Remove None values
                        logger.info(f"  Input {i+1}: {attrs}")
                    except:
                        pass
                
                return False
            
            # Get OTP code
            otp_code = self.get_otp_code(email)
            
            if not otp_code:
                logger.error("❌ No OTP code available")
                return False
            
            # Enter OTP code
            logger.info(f"📝 Entering OTP code: {'*' * len(otp_code)}")
            otp_input.fill(otp_code)
            time.sleep(1)
            
            # Try to find and click submit button
            submit_selectors = [
                "button[type='submit']",
                "button[data-test-id='submit-btn']",
                "button[aria-label='Submit']",
                "button:has-text('Submit')",
                "button:has-text('Verify')",
                "button:has-text('Continue')"
            ]
            
            submit_button = None
            for selector in submit_selectors:
                try:
                    submit_button = page.query_selector(selector)
                    if submit_button:
                        logger.info(f"✅ Found submit button: {selector}")
                        break
                except:
                    continue
            
            if submit_button:
                logger.info("🖱️ Clicking submit button")
                submit_button.click()
                time.sleep(3)
                return True
            else:
                logger.warning("⚠️ Could not find submit button, trying Enter key")
                otp_input.press("Enter")
                time.sleep(3)
                return True
            
        except Exception as e:
            logger.error(f"❌ Error handling OTP verification: {e}")
            return False
    
    def test_otp_generation(self, email):
        """
        Test OTP generation for a given email
        Use this to verify your 2FA setup is working
        
        Args:
            email: Email address to test
            
        Returns:
            str: Generated OTP or error message
        """
        otp_code = self.get_otp_code(email)
        
        if otp_code:
            print(f"✅ Successfully generated OTP for {email}: {otp_code}")
            print(f"🔍 Compare this with your authenticator app to verify it's correct")
            return otp_code
        else:
            print(f"❌ Failed to generate OTP for {email}")
            print(f"📋 Make sure you have set one of these environment variables:")
            print(f"   - LINKEDIN_2FA_SECRET_{email.replace('@', '_at_').replace('.', '_')}")
            print(f"   - LINKEDIN_OTP_{email.replace('@', '_at_').replace('.', '_')}")
            return None


# Standalone testing function
def test_otp_setup():
    """
    Test your OTP setup
    Run this script directly to test if your 2FA secrets are configured correctly
    """
    from dotenv import load_dotenv
    load_dotenv()
    
    print("="*60)
    print("OTP CONFIGURATION TEST")
    print("="*60)
    
    # Load accounts from environment
    accounts_str = os.getenv('LINKEDIN_ACCOUNTS', '')
    if not accounts_str:
        print("❌ No LINKEDIN_ACCOUNTS found in .env file")
        return
    
    accounts = []
    for account in accounts_str.split(','):
        account = account.strip()
        if ':' in account:
            email, _ = account.split(':', 1)
            accounts.append(email.strip())
    
    print(f"\n📧 Found {len(accounts)} accounts")
    print("-"*60)
    
    handler = OTPHandler()
    
    for email in accounts:
        print(f"\n🔍 Testing OTP for: {email}")
        print("-"*60)
        
        # Check for 2FA secret
        secret_var = f"LINKEDIN_2FA_SECRET_{email.replace('@', '_at_').replace('.', '_')}"
        has_secret = bool(os.getenv(secret_var))
        print(f"2FA Secret ({secret_var}): {'✅ Found' if has_secret else '❌ Not found'}")
        
        # Check for manual OTP
        otp_var = f"LINKEDIN_OTP_{email.replace('@', '_at_').replace('.', '_')}"
        has_otp = bool(os.getenv(otp_var))
        print(f"Manual OTP ({otp_var}): {'✅ Found' if has_otp else '❌ Not found'}")
        
        # Try to generate OTP
        otp_code = handler.get_otp_code(email)
        if otp_code:
            print(f"\n✅ Generated OTP: {otp_code}")
            print(f"🔍 Verify this matches your authenticator app!")
        else:
            print(f"\n❌ Could not generate OTP")
            print(f"💡 Setup instructions:")
            print(f"   1. Enable 2FA on LinkedIn for {email}")
            print(f"   2. Get your 2FA secret key during setup")
            print(f"   3. Add to .env: {secret_var}=YOUR_SECRET_KEY")
    
    print("\n" + "="*60)
    print("TEST COMPLETE")
    print("="*60)


if __name__ == "__main__":
    # Run test when script is executed directly
    test_otp_setup()