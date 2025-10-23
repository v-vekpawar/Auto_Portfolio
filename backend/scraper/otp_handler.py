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
            
            # Wait a bit for the OTP page to load
            time.sleep(2)
            
            # Try different OTP input selectors (LinkedIn changes these sometimes)
            otp_selectors = [
                "input[id='input__phone_verification_pin']",
                "input[name='pin']",
                "input[type='tel']",
                "input[aria-label='Verification code']",
                "input[placeholder*='code']",
                "input[placeholder*='Code']",
                "input[id*='verification']",
                "input[id*='pin']"
            ]
            
            otp_input = None
            for selector in otp_selectors:
                try:
                    otp_input = page.wait_for_selector(selector, timeout=3000)
                    if otp_input:
                        logger.info(f"✅ Found OTP input field: {selector}")
                        break
                except:
                    continue
            
            if not otp_input:
                logger.warning("❌ Could not find OTP input field")
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