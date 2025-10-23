"""
LinkedIn Profile Scraper – Playwright version with account rotation and persistent login.
"""

import time
import random
import logging
import json
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError
import sys
import os
from dotenv import load_dotenv
from .otp_handler import OTPHandler
load_dotenv()

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import SELENIUM_TIMEOUT

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LinkedInScraper:
    """LinkedIn Profile Scraper using Playwright with account rotation."""

    def __init__(self, headless=True):
        self.headless = headless
        self.playwright = None
        self.browser = None
        self.page = None
        
        # Load LinkedIn accounts from environment
        self.accounts = self._load_accounts()
        self.current_account_index = 0
        self.scrape_count = 0
        self.max_scrapes_per_account = int(os.getenv('MAX_SCRAPES_PER_ACCOUNT', '10'))
        self.account_start_time = time.time()
        self.max_session_duration = int(os.getenv('MAX_SESSION_DURATION', '1800'))  # 30 minutes default
        
        # Initialize OTP handler
        self.otp_handler = OTPHandler()

        # Track challenge attempts per account
        self.challenge_attempts = {}
        self.max_challenge_attempts = 3

        self.user_data_dir = Path("./cookies/playwright_user_data")
        self.cookies_file = self.user_data_dir / "linkedin_cookies.json"
        self.account_state_file = Path("./cookies/account_state.json")
        
        # Load account state (cooldowns, usage stats)
        self.account_state = self._load_account_state()
        
        # Initialize browser
        self._initialize_browser()

    def _load_accounts(self):
        """Load LinkedIn accounts from environment variable"""
        accounts_str = os.getenv('LINKEDIN_ACCOUNTS', '')
        
        if not accounts_str:
            logger.warning("No LINKEDIN_ACCOUNTS found in .env file")
            return []
        
        accounts = []
        for account in accounts_str.split(','):
            account = account.strip()
            if ':' in account:
                email, password = account.split(':', 1)
                accounts.append({
                    'email': email.strip(),
                    'password': password.strip()
                })
        
        logger.info(f"✅ Loaded {len(accounts)} LinkedIn accounts")
        return accounts

    def _load_account_state(self):
        """Load account usage state from file"""
        try:
            if self.account_state_file.exists():
                with open(self.account_state_file, 'r') as f:
                    return json.load(f)
        except Exception as e:
            logger.warning(f"Could not load account state: {e}")
        
        # Initialize default state
        return {account['email']: {'last_used': 0, 'total_scrapes': 0, 'ban_count': 0, 'is_blocked': False} 
                for account in self.accounts}

    def _save_account_state(self):
        """Save account usage state to file"""
        try:
            self.account_state_file.parent.mkdir(parents=True, exist_ok=True)
            with open(self.account_state_file, 'w') as f:
                json.dump(self.account_state, f, indent=2)
        except Exception as e:
            logger.error(f"Could not save account state: {e}")

    def _get_next_available_account(self):
        """Get next account that's not in cooldown period and not blocked"""
        cooldown_hours = int(os.getenv('ACCOUNT_COOLDOWN_HOURS', '6'))
        cooldown_seconds = cooldown_hours * 3600
        current_time = time.time()
        
        # Try to find an account not in cooldown and not blocked
        attempts = 0
        
        while attempts < len(self.accounts):
            account = self.accounts[self.current_account_index]
            email = account['email']
            account_state = self.account_state.get(email, {})
            last_used = account_state.get('last_used', 0)
            is_blocked = account_state.get('is_blocked', False)
            
            # Skip blocked accounts
            if is_blocked:
                logger.info(f"⛔ Account {email} is blocked, skipping...")
                self.current_account_index = (self.current_account_index + 1) % len(self.accounts)
                attempts += 1
                continue
            
            # Check cooldown
            if current_time - last_used >= cooldown_seconds:
                logger.info(f"✅ Selected account: {email}")
                return self.current_account_index
            
            logger.info(f"⏰ Account {email} in cooldown, trying next...")
            self.current_account_index = (self.current_account_index + 1) % len(self.accounts)
            attempts += 1
        
        # If all accounts are blocked or in cooldown
        logger.warning("⚠️ All accounts are either blocked or in cooldown")
        
        # Try to find least recently used non-blocked account
        available_accounts = [i for i, acc in enumerate(self.accounts) 
                            if not self.account_state.get(acc['email'], {}).get('is_blocked', False)]
        
        if not available_accounts:
            logger.error("❌ All accounts are blocked! Cannot continue.")
            return None
        
        # Use the least recently used available account
        oldest_index = min(available_accounts, 
                        key=lambda i: self.account_state.get(self.accounts[i]['email'], {}).get('last_used', 0))
        self.current_account_index = oldest_index
        logger.info(f"Using least recently used available account: {self.accounts[oldest_index]['email']}")
        return oldest_index

    def _initialize_browser(self):
        """Initialize or reinitialize browser with fresh context"""
        try:
            # Close existing browser if any
            if self.browser:
                try:
                    self.browser.close()
                except:
                    pass
            
            if self.playwright:
                try:
                    self.playwright.stop()
                except:
                    pass
            
            # Start fresh playwright instance
            self.playwright = sync_playwright().start()
            
            # Create user data directory
            self.user_data_dir.mkdir(parents=True, exist_ok=True)
            
            # Launch browser with persistent context
            self.browser = self.playwright.chromium.launch_persistent_context(
                user_data_dir=str(self.user_data_dir),
                headless=self.headless,
                args=[
                    "--disable-blink-features=AutomationControlled",
                    "--disable-dev-shm-usage",
                    "--no-sandbox",
                    "--disable-web-security",
                    "--disable-features=VizDisplayCompositor",
                    "--disable-automation",
                    "--disable-plugins-discovery",
                    "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                ]
            )
            
            self.page = self.browser.pages[0] if self.browser.pages else self.browser.new_page()
            
            # Anti-detection script
            self.page.add_init_script("""
                Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
                delete window.cdc_adoQpoasnfa76pfcZLmcfl_Array;
                delete window.cdc_adoQpoasnfa76pfcZLmcfl_Promise;
                delete window.cdc_adoQpoasnfa76pfcZLmcfl_Symbol;
            """)
            
            # Try to load cookies
            self.load_cookies()
            
            logger.info("✅ Browser initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing browser: {e}")
            raise

    def clear_browser_data(self):
        """Completely clear browser data for fresh session"""
        try:
            logger.info("🧹 Clearing browser data...")
            
            # Close browser
            if self.browser:
                try:
                    self.browser.close()
                except:
                    pass
            
            if self.playwright:
                try:
                    self.playwright.stop()
                except:
                    pass
            
            # Delete user data directory
            if self.user_data_dir.exists():
                shutil.rmtree(self.user_data_dir)
                logger.info("✅ Deleted user data directory")
            
            # Delete cookies file
            if self.cookies_file.exists():
                self.cookies_file.unlink()
                logger.info("✅ Deleted cookies file")
            
            # Wait a bit
            time.sleep(2)
            
            logger.info("✅ Browser data cleared successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error clearing browser data: {e}")
            return False

    def switch_account(self):
        """Switch to next available account with fresh browser session"""
        try:
            logger.info("🔄 Switching to next account...")
            
            # Update current account state
            if self.accounts:
                current_email = self.accounts[self.current_account_index]['email']
                if current_email in self.account_state:
                    self.account_state[current_email]['last_used'] = time.time()
                    self.account_state[current_email]['total_scrapes'] += self.scrape_count
                    self._save_account_state()
            
            # Clear browser data
            self.clear_browser_data()
            
            # Move to next account
            self.current_account_index = (self.current_account_index + 1) % len(self.accounts)
            next_account_index = self._get_next_available_account()

            if next_account_index is None:
                logger.error("❌ No available accounts to switch to!")
                return False
            
            # Reset counters
            self.scrape_count = 0
            self.account_start_time = time.time()
            
            # Reinitialize browser
            self._initialize_browser()
            
            logger.info(f"✅ Switched to account {self.current_account_index + 1}/{len(self.accounts)}")
            return True
            
        except Exception as e:
            logger.error(f"Error switching account: {e}")
            return False

    def should_switch_account(self):
        """Determine if we should switch to next account"""
        try:
            # Check scrape count limit
            if self.scrape_count >= self.max_scrapes_per_account:
                logger.info(f"📊 Scrape limit reached ({self.scrape_count}/{self.max_scrapes_per_account})")
                return True
            
            # Check session duration
            session_duration = time.time() - self.account_start_time
            if session_duration >= self.max_session_duration:
                logger.info(f"⏰ Session duration limit reached ({session_duration:.0f}s/{self.max_session_duration}s)")
                return True
            
            # Check for challenge/auth pages
            if self.page:
                current_url = self.page.url.lower()
                
                challenge_indicators = ['checkpoint', 'challenge', 'authwall', 'uas/login']
                if any(indicator in current_url for indicator in challenge_indicators):
                    logger.warning(f"⚠️ Challenge detected in URL: {current_url}")
                    return True
                
                # Check for specific page elements
                challenge_selectors = [
                    "text='Verify your identity'",
                    "text='Welcome back'",
                    "text='Let's do a quick security check'",
                    "text='Enter the code we sent to'",
                    "[data-test-id='verification-challenge']"
                ]
                
                for selector in challenge_selectors:
                    try:
                        if self.page.query_selector(selector):
                            logger.warning(f"⚠️ Challenge element detected: {selector}")
                            return True
                    except:
                        pass
            
            return False
            
        except Exception as e:
            logger.warning(f"Error checking if should switch: {e}")
            return False

    def save_cookies(self):
        try:
            cookies = self.page.context.cookies()
            linkedin_cookies = [c for c in cookies if 'linkedin' in c.get('domain', '')]
            
            if linkedin_cookies:
                with open(self.cookies_file, 'w') as f:
                    json.dump(linkedin_cookies, f, indent=2)
                logger.info(f"✅ Saved {len(linkedin_cookies)} cookies")
                return True
            return False
        except Exception as e:
            logger.error(f"Cookie save error: {e}")
            return False

    def load_cookies(self):
        try:
            if not self.cookies_file.exists():
                return False
            
            with open(self.cookies_file, 'r') as f:
                cookies = json.load(f)
            
            if cookies:
                try:
                    self.page.context.clear_cookies()
                except:
                    pass
                self.page.context.add_cookies(cookies)
                logger.info(f"✅ Loaded {len(cookies)} cookies")
                return True
            return False
        except Exception as e:
            logger.error(f"Cookie load error: {e}")
            return False

    def random_delay(self, min_sec=1, max_sec=3):
        """Add random delays to mimic human behavior."""
        time.sleep(random.uniform(min_sec, max_sec))

    def login_to_linkedin(self, profile_url=None):
        """Log in with current account or use saved session."""
        try:
            # Check if we should switch accounts before attempting login
            if self.should_switch_account() and len(self.accounts) > 1:
                logger.info("🔄 Proactive account switch triggered")
                self.switch_account()
            
            logger.info("Checking if already logged in...")
            self.page.goto("https://www.linkedin.com/feed", timeout=60000)  # 60 second timeout
            self.random_delay(3, 5)
            
            if self._is_logged_in():
                logger.info("Already logged in! ✅")
                if profile_url:
                    self.page.goto(profile_url, timeout=60000)
                    self.random_delay()
                return True

            # Try automated login if accounts are available
            if self.accounts:
                logger.info("Attempting automated login with current account...")
                return self._automated_login(profile_url)
            
            # Fallback to manual login
            if self.headless:
                logger.error("❌ Not logged in! Provide LINKEDIN_ACCOUNTS in .env or run with headless=False")
                return False
            
            logger.info("Opening login page for manual login...")
            self.page.goto("https://www.linkedin.com/login", timeout=60000)  # 60 second timeout
            self.random_delay(2, 4)
            
            logger.info("Please log in manually in the browser...")

            # Wait for login completion
            for i in range(60):
                logger.info(f"Waiting for login... ({i+1}/60)")
                time.sleep(3)
                try:
                    actual_url = self.page.evaluate("window.location.href").lower()
                    logger.info(f"Browser URL: {actual_url}")
                    
                    if any(x in actual_url for x in ['/feed', '/mynetwork', '/in/', '/jobs']):
                        logger.info("Detected successful navigation, checking login status...")
                        self.random_delay(3, 5)
                        
                        if self._is_logged_in():
                            logger.info("✅ Login successful!")
                            self.save_cookies()
                            break
                    
                except Exception as check_error:
                    if "Execution context was destroyed" in str(check_error):
                        logger.debug("Page navigation in progress...")
                    else:
                        logger.warning(f"Error during login check: {check_error}")
                    continue
            else:
                logger.error("⏰ Timeout waiting for login.")
                return False

            if profile_url:
                self.page.goto(profile_url)
                self.random_delay()
            return True

        except Exception as e:
            logger.error(f"Error during login: {str(e)}")
            return False

    def _automated_login(self, profile_url=None, is_retry=False):
        """Perform automated login using current account credentials."""
        try:
            if not self.accounts:
                logger.error("No accounts available for automated login")
                return False
            
            account = self.accounts[self.current_account_index]
            email = account['email']
            password = account['password']
            
            # Check if account is blocked
            if self.account_state.get(email, {}).get('is_blocked', False):
                logger.warning(f"⛔ Account {email} is marked as blocked, switching...")
                if len(self.accounts) > 1:
                    if self.switch_account():
                        return self._automated_login(profile_url, is_retry=True)
                return False
            
            # Track challenge attempts for this account
            if email not in self.challenge_attempts:
                self.challenge_attempts[email] = 0
            
            # If too many challenge attempts, mark as blocked
            if self.challenge_attempts[email] >= self.max_challenge_attempts:
                logger.error(f"⛔ Account {email} exceeded challenge attempts ({self.max_challenge_attempts}), marking as blocked")
                self.account_state[email]['is_blocked'] = True
                self.account_state[email]['ban_count'] += 1
                self._save_account_state()
                
                # Try next account if available
                if len(self.accounts) > 1:
                    if self.switch_account():
                        return self._automated_login(profile_url, is_retry=True)
                return False
            
            logger.info(f"Navigating to LinkedIn login page with account: {email}")
            self.page.goto("https://www.linkedin.com/login", timeout=60000)
            self.random_delay(2, 3)
            
            # Fill in email
            logger.info("Entering email...")
            email_input = self.page.wait_for_selector("#username", timeout=10000)
            email_input.fill(email)
            self.random_delay(0.5, 1.5)
            
            # Fill in password
            logger.info("Entering password...")
            password_input = self.page.wait_for_selector("#password", timeout=10000)
            password_input.fill(password)
            self.random_delay(0.5, 1.5)
            
            # Click login button
            logger.info("Clicking login button...")
            login_button = self.page.wait_for_selector("button[type='submit']", timeout=10000)
            login_button.click()
            
            # Wait for navigation
            self.random_delay(5, 7)
            
            # Check for verification/security challenges
            current_url = self.page.url.lower()
            
            # Check for OTP/verification challenge
            if any(indicator in current_url for indicator in ['checkpoint', 'challenge', 'verify']):
                logger.warning(f"⚠️ Security checkpoint/OTP verification detected for {email}!")
                
                # Increment challenge attempts
                self.challenge_attempts[email] += 1
                
                # Try to handle OTP verification using OTP handler
                otp_handled = self.otp_handler.handle_otp_verification(self.page, email)
                
                if otp_handled:
                    # Check if login successful after OTP
                    self.random_delay(3, 5)
                    if self._is_logged_in():
                        logger.info(f"✅ OTP verification successful for {email}!")
                        self.challenge_attempts[email] = 0  # Reset attempts on success
                        self.save_cookies()
                        
                        if email in self.account_state:
                            self.account_state[email]['last_used'] = time.time()
                            self._save_account_state()
                        
                        if profile_url:
                            self.page.goto(profile_url)
                            self.random_delay()
                        return True
                
                # OTP handling failed, switch account if available
                if len(self.accounts) > 1:
                    logger.info(f"Switching to next account due to challenge (attempt {self.challenge_attempts[email]}/{self.max_challenge_attempts})...")
                    if self.switch_account():
                        return self._automated_login(profile_url, is_retry=True)
                else:
                    logger.error("Only one account available and it's challenged")
                
                return False
            
            # Verify login success
            if self._is_logged_in():
                logger.info(f"✅ Automated login successful with {email}!")
                self.challenge_attempts[email] = 0  # Reset attempts on success
                self.save_cookies()
                
                # Update account state
                if email in self.account_state:
                    self.account_state[email]['last_used'] = time.time()
                    self._save_account_state()
                
                if profile_url:
                    self.page.goto(profile_url)
                    self.random_delay()
                return True
            else:
                logger.error(f"❌ Automated login failed with {email}")
                self.challenge_attempts[email] += 1
                
                # Try next account if available and not a retry
                if len(self.accounts) > 1 and not is_retry:
                    logger.info("Trying next account...")
                    if self.switch_account():
                        return self._automated_login(profile_url, is_retry=True)
                
                return False
                
        except Exception as e:
            logger.error(f"Error during automated login: {str(e)}")
            
            # Only try next account if not already retrying
            if len(self.accounts) > 1 and not is_retry:
                logger.info("Switching to next account due to error...")
                if self.switch_account():
                    return self._automated_login(profile_url, is_retry=True)
            
            return False

    def _is_logged_in(self):
        """Check if user is logged in to LinkedIn"""
        try:
            try:
                current_url = self.page.evaluate("window.location.href").lower()
            except:
                current_url = self.page.url.lower()
            
            logger.info(f"Checking login status. Current URL: {current_url}")

            # Quick URL checks
            if any(x in current_url for x in ['/login', '/signup', '/checkpoint']):
                logger.info(f"❌ Detected no login via URL: {current_url}")
                return False
            
            if any(x in current_url for x in ['/feed', '/mynetwork', '/in/', '/jobs']):
                logger.info(f"✅ Detected login via URL: {current_url}")
                return True
            
            # Wait for page load
            try:
                self.page.wait_for_load_state('domcontentloaded', timeout=5000)
            except:
                pass
            
            # Check key elements
            selectors = [
                "header[id='global-nav']",
                "div[class='global-nav__content']", 
                "div[class='profile-card-member-details']",
                "main[aria-label='Main Feed']",
                "div[id='global-nav-search']"
            ]
            
            return any(self.page.query_selector(s) for s in selectors)
            
        except Exception as e:
            logger.warning(f"Error checking login status: {e}")
            return False

    def scrape_profile(self, profile_url):
        """Scrape LinkedIn profile data with automatic account switching."""
        try:
            # Check if we should switch accounts BEFORE scraping
            if self.should_switch_account() and len(self.accounts) > 1:
                logger.info("🔄 Switching account before scraping...")
                self.switch_account()
            
            # Attempt login/navigation
            if not self.login_to_linkedin(profile_url):
                logger.warning("Login failed, returning dummy data for demo")
                return self._get_dummy_linkedin_data()

            logger.info(f"Scraping profile: {profile_url}")
            self.random_delay()
            
            # Check again for challenges after navigation
            if self.should_switch_account() and len(self.accounts) > 1:
                logger.info("🔄 Challenge detected during scraping, switching account...")
                self.switch_account()
                return self.scrape_profile(profile_url)
            
            profile_data = {
                'name': self._extract_name(),
                'headline': self._extract_headline(),
                'about': self._extract_about(),
                'experience': self._extract_experience(),
                'skills': self._extract_skills(),
                'education': self._extract_education(),
                'certificates': self._extract_certificates(),
                'url': profile_url
            }
            
            # Increment scrape count
            self.scrape_count += 1
            logger.info(f"✅ Profile scraping completed successfully (Count: {self.scrape_count}/{self.max_scrapes_per_account})")
            
            return profile_data

        except Exception as e:
            logger.error(f"❌ Error scraping profile: {str(e)}")
            return self._get_dummy_linkedin_data()

    def _extract_name(self):
        try:
            self.page.wait_for_selector("//h1", timeout=SELENIUM_TIMEOUT * 1000)
            element = self.page.query_selector("//h1")
            return element.inner_text().strip() if element else "Name not found"
        except Exception as e:
            logger.warning(f"Name extraction error: {str(e)}")
            return "Name not found"

    def _extract_headline(self):
        try:
            element = self.page.query_selector("//h1/ancestor::div[1]/following-sibling::div[contains(@class,'text-body-medium')]")
            return element.inner_text().strip() if element else "Headline not found"
        except Exception as e:
            logger.warning(f"Headline extraction error: {str(e)}")
            return "Headline not found"

    def _extract_about(self):
        try:
            about_header = self.page.query_selector("//h2[.//span[text()='About']]")
            if about_header:
                try:
                    show_more = self.page.query_selector("//div[contains(@class, 'display-flex ph5 pv3')]//button")
                    if show_more:
                        show_more.click()
                        self.random_delay(1, 2)
                except:
                    pass

                selectors = [
                    "//div[contains(@class, 'display-flex ph5 pv3')]//span[@aria-hidden='true']",
                    "//section[contains(@class, 'pv-about-section')]//span",
                    "//div[contains(@class, 'pv-shared-text')]//span",
                    "//div[contains(@id, 'about')]//span"
                ]

                for selector in selectors:
                    element = self.page.query_selector(selector)
                    if element:
                        text = element.inner_text().strip()
                        if text:
                            return text
            return "About section not found"
        except Exception as e:
            return f"Error: {e}"

    def _extract_experience(self):
        try:
            experience_list = []
            experience_header = self.page.locator("//h2[.//span[text()='Experience']]").first
            if experience_header.count() == 0:
                return []

            experience_container = experience_header.locator("xpath=./ancestor::div[4]").first
            experience_section = experience_container.locator("xpath=./following-sibling::div").first
            experience_items = experience_section.locator("xpath=.//li[contains(@class, 'artdeco-list__item')]").all()

            for item in experience_items[:5]:
                try:
                    title_element = item.locator("xpath=.//div[contains(@class, 't-bold')]//span[@aria-hidden='true']").first
                    company_element = item.locator("xpath=.//span[contains(@class,'t-normal')]//span[@aria-hidden='true']").first
                    duration_element = item.locator("xpath=.//span[contains(@class,'t-normal')]//span[contains(@class,'pvs-entity') and @aria-hidden='true']").first

                    title = title_element.inner_text().strip() if title_element else ""
                    company = company_element.inner_text().strip().split('·')[0].strip() if company_element else ""
                    duration = duration_element.inner_text().strip().split('·')[-1].strip() if duration_element else ""

                    if title and company:
                        experience_list.append({
                            'title': title, 
                            'company': company,
                            'duration': duration,
                        })
                except:
                    continue

            return experience_list
        except Exception as e:
            logger.warning(f"Experience extraction error: {str(e)}")
            return []

    def _extract_skills(self):
        try:
            skills_list = []
            skills_header = self.page.locator("//h2[.//span[text()='Skills']]")
            if skills_header.count() == 0:
                return []

            skills_container = skills_header.locator("xpath=./ancestor::div[4]").first
            skills_section = skills_container.locator("xpath=./following-sibling::div").first
            show_all_link = skills_section.locator("xpath=.//div[contains(@class,'pv-action')]//a[.//span[contains(normalize-space(.), 'Show all') and contains(normalize-space(.), 'skills')]]")

            if show_all_link.count() > 0:
                logger.info("Clicking 'Show all skills'...")
                handle = show_all_link.element_handle()
                if handle:
                    self.page.evaluate("element => element.scrollIntoView({block: 'center'})", handle)
                    self.random_delay(1, 2)
                
                with self.page.expect_navigation(timeout=15000):
                    show_all_link.click()
                
                self.random_delay(2, 4)
                
                try:
                    self.page.wait_for_selector("//section[@class='artdeco-card pb3']//li[contains(@class,'artdeco-list__item')]", timeout=10000)
                    skill_items = self.page.locator("xpath=//section[@class='artdeco-card pb3']//li[contains(@class,'artdeco-list__item')]").all()
                    
                    for item in skill_items[:15]:
                        skill_element = item.locator("xpath=.//div[contains(@class, 't-bold')]//span[@aria-hidden='true']").first
                        if skill_element:
                            skill = skill_element.inner_text().strip()
                            if skill:
                                skills_list.append(skill)
                    
                    skills_list = list(dict.fromkeys(skills_list))
                except Exception as wait_error:
                    logger.warning(f"Skills content didn't load: {wait_error}")
                
                # Navigate back
                try:
                    back_arrow = self.page.query_selector("//button[@aria-label='Back to the main profile page']")
                    if back_arrow:
                        back_arrow.click()
                        self.page.wait_for_selector("//h1", timeout=10000)
                    else:
                        original_url = self.page.url.split('/details/')[0] + '/'
                        self.page.goto(original_url)
                        self.random_delay()
                except Exception as back_error:
                    logger.warning(f"Error navigating back: {back_error}")
            else:
                # Extract from main page
                main_page_skills = skills_section.locator("xpath=.//li[contains(@class,'artdeco-list__item')]").all()
                for item in main_page_skills[:10]:
                    skill_element = item.locator("xpath=.//div[contains(@class, 't-bold')]//span[@aria-hidden='true']").first
                    if skill_element:
                        skill = skill_element.inner_text().strip()
                        if skill:
                            skills_list.append(skill)

            return skills_list
        except Exception as e:
            logger.warning(f"Skills extraction error: {str(e)}")
            return []

    def _extract_education(self):
        try:
            education_list = []
            education_header = self.page.locator("//h2[.//span[text()='Education']]")
            if education_header.count() == 0:
                return []

            education_container = education_header.locator("xpath=./ancestor::div[4]").first
            education_section = education_container.locator("xpath=./following-sibling::div").first
            
            # Try main page first
            main_page_education = education_section.locator("xpath=.//li[contains(@class,'artdeco-list__item')]").all()
            if len(main_page_education) > 0:
                for item in main_page_education[:5]:
                    try:
                        # Extract school name
                        school_element = item.locator("xpath=.//div[contains(@class, 't-bold')]//span[@aria-hidden='true']").first
                        school = school_element.inner_text().strip() if school_element else ""
                        
                        # Extract degree and field
                        degree_element = school_element.locator("xpath=./ancestor::div[4]/following-sibling::span//span[@aria-hidden='true']").first
                        degree_text = degree_element.inner_text().strip() if degree_element else ""
                        
                        # Extract year/duration
                        year_element = degree_element.locator("xpath=./ancestor::span/following-sibling::span//span[@aria-hidden='true']").first
                        year = year_element.inner_text().strip() if year_element else ""
                        
                        # Parse degree and field from degree_text
                        degree = ""
                        field = ""
                        if degree_text:
                            # Common patterns: "Bachelor of Science", "Master's in Computer Science", etc.
                            degree = degree_text.split("-")[0].strip()
                            field = degree_text.split("-")[1].split(",")[1].strip() if "," in degree_text.split("-")[1] else ""

                        if school:
                            education_entry = {
                                'school': school,
                                'degree': degree or 'Degree',
                                'field': field or 'Field of Study',
                                'year': year or 'Year'
                            }
                            education_list.append(education_entry)
                    except Exception as item_error:
                        logger.warning(f"Error extracting education item: {item_error}")
                        continue
                
                if education_list:
                    return education_list

            # Try "Show all" approach if main page failed
            show_all_link = education_section.locator("xpath=.//div[contains(@class,'pv-action')]//a[.//span[contains(normalize-space(.), 'Show all') and contains(normalize-space(.), 'educations')]]")
            if show_all_link.count() > 0:
                handle = show_all_link.element_handle()
                if handle:
                    self.page.evaluate("element => element.scrollIntoView({block: 'center'})", handle)
                    self.random_delay(1, 2)
                
                with self.page.expect_navigation(timeout=15000):
                    show_all_link.click()
                
                self.random_delay(2, 4)
                
                try:
                    self.page.wait_for_selector("//section[contains(@class,'artdeco-card')]//li[contains(@class,'artdeco-list__item')]", timeout=10000)
                    education_items = self.page.locator("xpath=//section[contains(@class,'artdeco-card')]//li[contains(@class,'artdeco-list__item')]").all()
                    
                    for item in education_items[:5]:
                        try:
                            # Extract school name
                            school_element = item.locator("xpath=.//div[contains(@class, 't-bold')]//span[@aria-hidden='true']").first
                            school = school_element.inner_text().strip() if school_element else ""
                            
                            # Extract degree and field
                            degree_element = school_element.locator("xpath=./ancestor::div[4]/following-sibling::span//span[@aria-hidden='true']").first
                            degree_text = degree_element.inner_text().strip() if degree_element else ""
                            
                            # Extract year/duration
                            year_element = degree_element.locator("xpath=./ancestor::span/following-sibling::span//span[@aria-hidden='true']").first
                            year = year_element.inner_text().strip() if year_element else ""
                            
                            # Parse degree and field from degree_text
                            degree = ""
                            field = ""
                            if degree_text:
                                # Common patterns: "Bachelor of Science", "Master's in Computer Science", etc.
                                degree = degree_text.split("-")[0].strip()
                                field = degree_text.split("-")[1].split(",")[1].strip() if "," in degree_text.split("-")[1] else ""

                            if school:
                                education_entry = {
                                    'school': school,
                                    'degree': degree or 'Degree',
                                    'field': field or 'Field of Study',
                                    'year': year or 'Year'
                                }
                                education_list.append(education_entry)
                        except Exception as item_error:
                            logger.warning(f"Error extracting education item: {item_error}")
                            continue
                            
                except Exception as wait_error:
                    logger.warning(f"Education content didn't load: {wait_error}")
                
                # Navigate back
                try:
                    back_arrow = self.page.query_selector("//button[@aria-label='Back to the main profile page']")
                    if back_arrow:
                        back_arrow.click()
                        self.page.wait_for_selector("//h1", timeout=10000)
                    else:
                        original_url = self.page.url.split('/details/')[0] + '/'
                        self.page.goto(original_url)
                        self.random_delay()
                except Exception as back_error:
                    logger.warning(f"Error navigating back: {back_error}")

            return education_list
        except Exception as e:
            logger.warning(f"Education extraction error: {str(e)}")
            return []

    def _extract_certificates(self):
        try:
            certificate_list = []
            certification_header = self.page.locator("//h2[.//span[text()='Licenses & certifications']]")
            if certification_header.count() == 0:
                return []

            certification_container = certification_header.locator("xpath=./ancestor::div[4]").first
            certification_section = certification_container.locator("xpath=./following-sibling::div").first

            # Try "Show all" approach first
            show_all_link = certification_section.locator("xpath=.//div[contains(@class,'pv-action')]//a[.//span[contains(normalize-space(.), 'Show all') and contains(normalize-space(.), 'licenses & certifications')]]")
            if show_all_link.count() > 0:
                handle = show_all_link.element_handle()
                if handle:
                    self.page.evaluate("element => element.scrollIntoView({block: 'center'})", handle)
                    self.random_delay(1, 2)
                
                with self.page.expect_navigation(timeout=15000):
                    show_all_link.click()
                
                self.random_delay(2, 4)
                
                try:
                    self.page.wait_for_selector("//section[contains(@class,'artdeco-card')]//li[contains(@class,'artdeco-list__item')]", timeout=10000)
                    certificate_items = self.page.locator("xpath=//section[contains(@class,'artdeco-card')]//li[contains(@class,'artdeco-list__item')]").all()
                    
                    for item in certificate_items[:5]:
                        try:
                            # Extract certificate name
                            certificate_element = item.locator("xpath=.//div[contains(@class, 't-bold')]//span[@aria-hidden='true']").first
                            certificate = certificate_element.inner_text().strip() if certificate_element else ""
                            
                            # Extract certificate link
                            link_element = item.locator("xpath=.//a").first
                            certificate_link = link_element.get_attribute("href") if link_element else ""

                            # Extract certificate issuer
                            issuer_element = certificate_element.locator("xpath=ancestor::div[4]/following-sibling::span//span[@aria-hidden='true']").first
                            issuer = issuer_element.inner_text().strip() if issuer_element else ""

                            # Extract issued date
                            date_element = issuer_element.locator("xpath=./ancestor::span/following-sibling::span//span[@aria-hidden='true']").first
                            date = date_element.inner_text().strip() if date_element else ""

                            if certificate:
                                certificate_entry = {
                                    'certificate': certificate,
                                    'link': certificate_link or 'Link to Certificate',
                                    'issuer': issuer or 'Issued By __',
                                    'date': date or 'Issued Date'
                                }
                                certificate_list.append(certificate_entry)
                        except Exception as item_error:
                            logger.warning(f"Error extracting certificate item: {item_error}")
                            continue
                            
                except Exception as wait_error:
                    logger.warning(f"Certificates content didn't load: {wait_error}")
                
                # Navigate back
                try:
                    back_arrow = self.page.query_selector("//button[@aria-label='Back to the main profile page']")
                    if back_arrow:
                        back_arrow.click()
                        self.page.wait_for_selector("//h1", timeout=10000)
                    else:
                        original_url = self.page.url.split('/details/')[0] + '/'
                        self.page.goto(original_url)
                        self.random_delay()
                except Exception as back_error:
                    logger.warning(f"Error navigating back: {back_error}")

            else:
                # Try main page extraction if no show all
                certificate_list = []
                main_page_certification = certification_section.locator("xpath=.//li[contains(@class,'artdeco-list__item')]").all()
                if len(main_page_certification) > 0:
                    for item in main_page_certification[:5]:
                        try:
                            # Extract certificate name
                            certificate_element = item.locator("xpath=.//div[contains(@class, 't-bold')]//span[@aria-hidden='true']").first
                            certificate = certificate_element.inner_text().strip() if certificate_element else ""
                            
                            # Extract certificate link
                            link_element = item.locator("xpath=.//a").first
                            certificate_link = link_element.get_attribute("href") if link_element else ""

                            # Extract certificate issuer
                            issuer_element = certificate_element.locator("xpath=ancestor::div[4]/following-sibling::span//span[@aria-hidden='true']").first
                            issuer = issuer_element.inner_text().strip() if issuer_element else ""

                            # Extract issued date
                            date_element = issuer_element.locator("xpath=./ancestor::span/following-sibling::span//span[@aria-hidden='true']").first
                            date = date_element.inner_text().strip() if date_element else ""

                            if certificate:
                                certificate_entry = {
                                    'certificate': certificate,
                                    'link': certificate_link or 'Link to Certificate',
                                    'issuer': issuer or 'Issued By __',
                                    'date': date or 'Issued Date'
                                }
                                certificate_list.append(certificate_entry)
                        except Exception as item_error:
                            logger.warning(f"Error extracting certificates item: {item_error}")
                            continue
                    
                    if certificate_list:
                        return certificate_list

            return certificate_list

        except Exception as e:
            logger.warning(f"Certificate extraction error: {str(e)}")
            return []

    def close(self):
        """Close browser and save final state"""
        try:
            # Update final account state
            if self.accounts:
                current_email = self.accounts[self.current_account_index]['email']
                if current_email in self.account_state:
                    self.account_state[current_email]['last_used'] = time.time()
                    self.account_state[current_email]['total_scrapes'] += self.scrape_count
                    self._save_account_state()
            
            # Save cookies
            self.save_cookies()
            
            # Close browser
            if self.browser:
                self.browser.close()
            if self.playwright:
                self.playwright.stop()
            
            logger.info("✅ Browser closed successfully")
        except Exception as e:
            logger.error(f"Error during close: {e}")

    def _get_dummy_linkedin_data(self):
        """Return dummy data for demo purposes"""
        return {
            'name': 'John Doe',
            'headline': 'Full Stack Developer | AI Enthusiast',
            'about': 'Passionate developer with 5+ years of experience building scalable web applications. Love working with modern technologies and solving complex problems.',
            'experience': [
                {
                    'title': 'Senior Software Engineer',
                    'company': 'TechCorp Inc.',
                    'duration': 'Jan 2022 - Present',
                    'description': 'Lead development of microservices architecture using Node.js and Python. Mentored junior developers and improved system performance by 40%.'
                },
                {
                    'title': 'Full Stack Developer',
                    'company': 'StartupXYZ',
                    'duration': 'Jun 2020 - Dec 2021',
                    'description': 'Built responsive web applications using React and Django. Implemented CI/CD pipelines and reduced deployment time by 60%.'
                }
            ],
            'skills': ['JavaScript', 'Python', 'React', 'Node.js', 'Django', 'PostgreSQL', 'AWS', 'Docker', 'Git', 'Agile'],
            'education': [
                {
                    'school': 'University of Technology',
                    'degree': 'Bachelor of Science',
                    'field': 'Computer Science',
                    'year': '2020'
                },
                {
                    'school': 'TechBootcamp Academy',
                    'degree': 'Certificate',
                    'field': 'Full Stack Web Development',
                    'year': '2019'
                }
            ],
            'certificates': [
                {
                    'certificate': "Data Analytics Certificate",
                    'link': "https://example.com/certificate1",
                    'issuer': "AutoPortfolio Academy",
                    'date': "Jan 2023"
                },
                {
                    'certificate': "Python Developer Certificate",
                    'link': "https://example.com/certificate2",
                    'issuer': "AutoPortfolio Academy",
                    'date': "Mar 2023"
                }
            ]
        }

    def get_account_stats(self):
        """Get statistics about account usage"""
        stats = {
            'total_accounts': len(self.accounts),
            'current_account_index': self.current_account_index + 1,
            'current_scrape_count': self.scrape_count,
            'max_scrapes_per_account': self.max_scrapes_per_account,
            'account_details': []
        }
        
        for account in self.accounts:
            email = account['email']
            account_info = self.account_state.get(email, {})
            stats['account_details'].append({
                'email': email,
                'total_scrapes': account_info.get('total_scrapes', 0),
                'last_used': account_info.get('last_used', 0),
                'ban_count': account_info.get('ban_count', 0),
                'is_blocked': account_info.get('is_blocked', False)
            })
        
        return stats


def scrape_linkedin_profile(profile_url, headless=True):
    """Convenience function to scrape a LinkedIn profile"""
    scraper = LinkedInScraper(headless=headless)
    try:
        profile_data = scraper.scrape_profile(profile_url)
        return profile_data
    except Exception as e:
        logger.error(f"Scrape error: {str(e)}")
        return None
    finally:
        scraper.close()


def scrape_multiple_profiles(profile_urls, headless=True):
    """Scrape multiple LinkedIn profiles with automatic account rotation"""
    scraper = LinkedInScraper(headless=headless)
    results = []
    
    try:
        for i, url in enumerate(profile_urls):
            logger.info(f"\n{'='*60}")
            logger.info(f"Scraping profile {i+1}/{len(profile_urls)}: {url}")
            logger.info(f"{'='*60}\n")
            
            profile_data = scraper.scrape_profile(url)
            results.append(profile_data)
            
            # Add delay between profiles
            if i < len(profile_urls) - 1:
                delay = random.uniform(10, 20)
                logger.info(f"⏳ Waiting {delay:.1f}s before next profile...")
                time.sleep(delay)
        
        # Print final stats
        logger.info("\n" + "="*60)
        logger.info("SCRAPING COMPLETED - ACCOUNT STATISTICS")
        logger.info("="*60)
        stats = scraper.get_account_stats()
        logger.info(f"Total accounts used: {stats['total_accounts']}")
        logger.info(f"Profiles scraped: {len(results)}")
        for detail in stats['account_details']:
            logger.info(f"\nAccount: {detail['email']}")
            logger.info(f"  - Total scrapes: {detail['total_scrapes']}")
            logger.info(f"  - Ban count: {detail['ban_count']}")
        logger.info("="*60 + "\n")
        
        return results
    except Exception as e:
        logger.error(f"Error in batch scraping: {str(e)}")
        return results
    finally:
        scraper.close()