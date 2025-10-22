# AutoPortfolio Backend

A Flask-based backend service that automatically scrapes LinkedIn profiles, GitHub repositories, and parses resume files to generate comprehensive portfolio data.

## 🎓 Educational Purpose & Compliance

**This backend is created for educational and learning purposes.** It demonstrates web scraping, API integration, and data processing techniques while respecting platform guidelines and terms of service.

- **Educational Focus**: Learn web scraping, API design, and data extraction
- **Platform Compliance**: Respects LinkedIn's Terms of Service and robots.txt
- **Responsible Usage**: Implements rate limiting and ethical scraping practices
- **Learning Resource**: Understand modern backend development patterns

## 🏗️ Architecture Overview

```
backend/
├── app.py                      # Main Flask application
├── config.py                   # Configuration settings
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Docker configuration
├── scraper/                    # Scraping modules
│   ├── linkedin_scraper.py     # LinkedIn profile scraper
│   ├── github_scraper.py       # GitHub API integration
│   └── resume_parser.py        # Resume file parser
├── cookies/                    # LinkedIn session management
│   ├── account_state.json      # Account usage tracking
│   └── playwright_user_data/   # Browser session data
└── uploads/                    # Temporary resume storage
```

## 🔧 Core Components

### 1. Main Application (`app.py`)

**Flask Routes:**
- `GET /` - Health check endpoint
- `POST /scrape` - Main scraping endpoint that combines all data sources

**Key Functions:**
- `scrape_profile()` - Orchestrates the complete scraping process
- `combine_profile_data()` - Merges data from LinkedIn, GitHub, and resume sources

### 2. LinkedIn Scraper (`scraper/linkedin_scraper.py`)

**Features:**
- **Playwright-based scraping** with realistic browser behavior
- **Account rotation system** to avoid rate limits
- **Persistent session management** with cookie storage
- **Anti-detection measures** with random delays and human-like interactions

**Key Methods:**
```python
class LinkedInScraper:
    def scrape_profile(profile_url)          # Main scraping method
    def _extract_name()                      # Extract user's name
    def _extract_headline()                  # Extract professional headline
    def _extract_about()                     # Extract about section
    def _extract_experience()                # Extract work experience
    def _extract_skills()                    # Extract skills list
    def _extract_education()                 # Extract education info
```

**Account Management:**
- Supports multiple LinkedIn accounts for rotation
- Tracks usage per account to prevent overuse
- Automatic cooldown periods between scrapes
- Session persistence across restarts

### 3. GitHub Scraper (`scraper/github_scraper.py`)

**Features:**
- **GitHub REST API integration** for reliable data access
- **Repository analysis** with metadata extraction
- **Rate limit handling** with optional authentication token

**Key Methods:**
```python
class GitHubScraper:
    def scrape_profile(github_url)           # Main scraping method
    def _get_user_profile(username)          # Get user profile data
    def _get_repositories(username)          # Get user repositories
    def _extract_username(github_url)        # Extract username from URL
```

### 4. Resume Parser (`scraper/resume_parser.py`)

**Supported Formats:**
- PDF files (using PyPDF2)
- DOCX files (using python-docx)

**Extraction Capabilities:**
- Contact information (email, phone)
- Work experience with dates and descriptions
- Skills and technologies
- Education background

**Key Methods:**
```python
class ResumeParser:
    def parse_resume(file_path)              # Main parsing method
    def _extract_pdf_text(file_path)         # PDF text extraction
    def _extract_docx_text(file_path)        # DOCX text extraction
    def _extract_contact_info(text)          # Contact info extraction
    def _extract_experience(text)            # Experience extraction
    def _extract_skills(text)                # Skills extraction
```

## 📊 Data Structures

### Input Data Structure

**Request Format:**
```json
{
  "linkedin_url": "https://linkedin.com/in/username",
  "github_url": "https://github.com/username",
  "resume_file": "file_upload_object"
}
```

### LinkedIn Data Structure

```json
{
  "name": "John Doe",
  "headline": "Senior Software Engineer at Tech Company",
  "about": "Passionate developer with 5+ years of experience...",
  "experience": [
    {
      "title": "Senior Software Engineer",
      "company": "Tech Company",
      "duration": "Jan 2020 - Present",
      "description": "Led development of microservices architecture..."
    }
  ],
  "skills": [
    "JavaScript", "Python", "React", "Node.js", "AWS"
  ],
  "education": [
    {
      "school": "University Name",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "year": "2018"
    }
  ],
  "certifcates": [
    {
      certificate': "Data Analytics Certificate",
      'link': "https://example.com/certificate1",
      'issuer': "AutoPortfolio Academy",
      'date': "Jan 2023"
    }
  ]
}
```

### GitHub Data Structure

```json
{
  "profile": {
    "login": "username",
    "name": "John Doe",
    "bio": "Full-stack developer",
    "html_url": "https://github.com/username",
    "public_repos": 25,
    "followers": 150,
    "following": 75
  },
  "repositories": [
    {
      "name": "awesome-project",
      "description": "A modern web application built with React",
      "html_url": "https://github.com/username/awesome-project",
      "homepage": "https://awesome-project.com",
      "stargazers_count": 45,
      "forks_count": 12,
      "language": "JavaScript",
      "topics": ["react", "nodejs", "mongodb"],
      "created_at": "2023-01-15T10:30:00Z",
      "updated_at": "2023-10-20T14:45:00Z"
    }
  ]
}
```

### Resume Data Structure

```json
{
  "contact": {
    "email": "john.doe@email.com",
    "phone": "+1 (555) 123-4567"
  },
  "experience": [
    {
      "title": "Software Engineer",
      "company": "Previous Company",
      "duration": "2018 - 2020",
      "description": "Developed web applications using modern frameworks"
    }
  ],
  "skills": [
    "Python", "Django", "PostgreSQL", "Docker"
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Master of Science",
      "field": "Software Engineering",
      "year": "2018"
    }
  ]
}
```

### Combined Output Structure

```json
{
  "name": "John Doe",
  "headline": "Senior Software Engineer at Tech Company",
  "about": "Passionate developer with 5+ years of experience...",
  "experience": [
    // Combined from LinkedIn and resume, deduplicated
  ],
  "skills": [
    // Combined from all sources, deduplicated
  ],
  "projects": [
    // Transformed from GitHub repositories
    {
      "name": "awesome-project",
      "description": "A modern web application built with React",
      "link": "https://awesome-project.com",
      "github": "https://github.com/username/awesome-project",
      "stars": 45,
      "technologies": ["react", "nodejs", "mongodb"]
    }
  ],
  "education": [
    // Combined from LinkedIn and resume
  ]
}
```

## 🔄 Data Flow

1. **Request Processing**
   - Receive LinkedIn URL, GitHub URL, and optional resume file
   - Validate input parameters
   - Store resume file temporarily

2. **LinkedIn Scraping**
   - Initialize Playwright browser with account rotation
   - Navigate to LinkedIn profile with anti-detection measures
   - Extract profile information using CSS selectors
   - Handle dynamic content loading and pagination

3. **GitHub Data Fetching**
   - Extract username from GitHub URL
   - Make authenticated API requests to GitHub
   - Fetch user profile and repository data
   - Sort repositories by popularity (stars)

4. **Resume Processing**
   - Parse uploaded file (PDF/DOCX)
   - Extract text content using appropriate libraries
   - Use regex patterns to identify sections
   - Extract structured data from unstructured text

5. **Data Combination**
   - Merge data from all sources
   - Deduplicate skills and experience entries
   - Transform GitHub repositories into project format
   - Prioritize data quality (resume > LinkedIn > GitHub)

6. **Response Generation**
   - Return combined portfolio data as JSON
   - Clean up temporary files
   - Log scraping statistics

## 🛡️ Anti-Detection Features

### LinkedIn Scraping Protection
- **Human-like behavior**: Random delays between actions
- **Browser fingerprinting**: Realistic user agent and viewport
- **Session persistence**: Maintain login state across requests
- **Account rotation**: Distribute load across multiple accounts
- **Rate limiting**: Respect platform limits with cooldown periods

### Error Handling
- **Graceful degradation**: Return partial data if some sources fail
- **Retry mechanisms**: Automatic retry with exponential backoff
- **Fallback data**: Dummy data when scraping fails completely
- **Comprehensive logging**: Detailed error tracking and debugging

## 🚀 Deployment

### Environment Variables (.env)
```bash
# LinkedIn Account Credentials (Use dedicated accounts, not personal)
LINKEDIN_ACCOUNTS=account1@example.com:password1,account2@example.com:password2

# LinkedIn Configuration
LINKEDIN_HEADLESS=true
MAX_SCRAPES_PER_ACCOUNT=10
ACCOUNT_COOLDOWN_HOURS=6

# GitHub API (Optional - for higher rate limits)
GITHUB_TOKEN=your_github_personal_access_token

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=true
FLASK_PORT=5001

# Security
SECRET_KEY=your_secret_key_here
```

### Docker Deployment
```bash
# Build image
docker build -t autoportfolio-backend .

# Run container
docker run -p 5001:5001 \
  -e LINKEDIN_EMAIL_1=your_email \
  -e LINKEDIN_PASSWORD_1=your_password \
  autoportfolio-backend
```

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install

# Run development server
python app.py
```

## 📝 API Usage Examples

### Basic Scraping Request
```bash
curl -X POST http://localhost:5001/scrape \
  -F "linkedin_url=https://linkedin.com/in/johndoe" \
  -F "github_url=https://github.com/johndoe" \
  -F "resume_file=@resume.pdf"
```

### Health Check
```bash
curl http://localhost:5001/
```

## ⚠️ Important Notes

### Rate Limits
- **LinkedIn**: 10 scrapes per account per day (configurable)
- **GitHub**: 60 requests per hour (unauthenticated), 5000 with token
- **Resume**: No limits (local processing)

### Data Privacy
- Resume files are deleted immediately after processing
- LinkedIn session data is stored locally for performance
- No user data is permanently stored or transmitted to third parties

### Legal Considerations & Compliance

**⚠️ IMPORTANT: LinkedIn Terms of Service Compliance**

- **Educational Use Only**: This backend is for learning and educational purposes
- **Respect Platform Terms**: Full compliance with LinkedIn's Terms of Service and robots.txt
- **Personal Profiles Only**: Only scrape your own profile or with explicit permission
- **Rate Limiting**: Implements responsible scraping with delays and cooldowns
- **Public Data Only**: Only accesses publicly available information
- **No Commercial Use**: Not intended for commercial data harvesting
- **User Responsibility**: Users must ensure compliance with all applicable terms and laws

**Recommended Practices:**
- Use dedicated LinkedIn accounts (not your main account)
- Keep MAX_SCRAPES_PER_ACCOUNT low (5-10 per day)
- Increase ACCOUNT_COOLDOWN_HOURS for safer usage
- Consider LinkedIn's official API for commercial applications
- Always check current platform terms before use

## 🔧 Configuration Options

### LinkedIn Scraper Settings (`config.py`)
```python
SELENIUM_TIMEOUT = 10              # Element wait timeout
LINKEDIN_HEADLESS = True           # Run browser in headless mode
LINKEDIN_COOKIE_EXPIRY = 30        # Cookie expiration in days
```

### GitHub API Settings
```python
GITHUB_API_TIMEOUT = 10            # API request timeout
GITHUB_MAX_REPOS = 10              # Maximum repositories to fetch
```

### File Upload Settings
```python
MAX_FILE_SIZE = 16 * 1024 * 1024   # 16MB maximum file size
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}
```

This backend provides a robust foundation for automated portfolio data collection with enterprise-grade reliability and anti-detection capabilities.