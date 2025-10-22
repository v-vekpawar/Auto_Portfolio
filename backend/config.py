# Configuration settings for AutoPortfolio backend

# Selenium/Playwright timeout settings
SELENIUM_TIMEOUT = 10  # seconds

# LinkedIn scraper settings
LINKEDIN_HEADLESS = True
LINKEDIN_COOKIE_EXPIRY = 30  # days

# GitHub API settings
GITHUB_API_TIMEOUT = 10  # seconds
GITHUB_MAX_REPOS = 10

# File upload settings
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

# Flask settings
FLASK_HOST = '0.0.0.0'
FLASK_PORT = 5000
FLASK_DEBUG = True