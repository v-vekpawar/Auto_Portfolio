# AutoPortfolio Backend

Flask-based backend API for AutoPortfolio with advanced LinkedIn scraping, AI-powered resume parsing, and intelligent content generation.

## 🎓 Educational Purpose & Platform Compliance

**This backend is created purely for educational and learning purposes.** We deeply respect and acknowledge the terms of service and guidelines of LinkedIn, GitHub, Google AI, and all other platforms integrated within this application.

### **Educational Intent**
- **Learning Resource**: Demonstrates advanced web scraping techniques and API integration
- **Technology Showcase**: Shows modern backend development with AI integration
- **Best Practices**: Illustrates responsible data extraction and ethical scraping practices
- **Automation Education**: Teaches browser automation and 2FA handling

### **Platform Respect & Compliance**
- **LinkedIn Terms**: Full compliance with LinkedIn's Terms of Service, robots.txt, and usage guidelines
- **GitHub API**: Respects GitHub's API terms, rate limiting, and attribution requirements
- **Google Gemini AI**: Follows Google AI usage policies and best practices
- **Responsible Usage**: Encourages ethical data extraction practices and rate limiting

### **Legal Responsibility**
**Users are expected to use this backend responsibly and in compliance with all applicable platform terms and legal requirements. The backend includes built-in safeguards and rate limiting to promote responsible usage.**

## 🚀 Features

### **LinkedIn Integration with 2FA Support**
- **Account Rotation**: Multiple LinkedIn accounts with automatic switching
- **2FA Authentication**: Automated TOTP handling using PyOTP
- **Rate Limiting**: Built-in cooldowns and request limits
- **Security Checkpoints**: Handles LinkedIn security challenges
- **Headless Operation**: Browser automation with Playwright

### **AI-Powered Resume Processing**
- **Google Gemini Integration**: Advanced AI parsing using Gemini 2.5 Flash
- **Multi-Format Support**: PDF, DOC, DOCX file processing
- **Intelligent Extraction**: Projects, certifications, experience, skills
- **Structured Output**: Converts unstructured text to organized data
- **Fallback Parsing**: Manual extraction when AI unavailable

### **AI Content Enhancement**
- **Professional Headlines**: Generate industry-specific, compelling headlines
- **Personalized Summaries**: Create engaging 3-5 line professional summaries
- **Individual Endpoints**: Separate APIs for headline and summary enhancement
- **Concurrent Processing**: Handle multiple enhancement requests simultaneously
- **Smart Generation**: Context-aware content based on user's complete profile

### **GitHub Integration**
- **Repository Data**: Fetch public repositories with statistics
- **API Integration**: Uses GitHub REST API with optional authentication
- **Rate Limiting**: Respects GitHub API limits
- **Project Showcase**: Extracts technologies, descriptions, and metrics

## 🛠️ Tech Stack

- **Python 3.8+** - Core language
- **Flask** - Web framework with CORS support
- **Playwright** - Browser automation for LinkedIn scraping
- **PyOTP** - TOTP 2FA code generation
- **Google Gemini AI** - Advanced AI processing
- **PyPDF2** - PDF text extraction
- **python-docx** - Word document processing
- **APScheduler** - Background task scheduling
- **Jinja2** - Template rendering for portfolio generation

## 📋 Prerequisites

- Python 3.8 or higher
- Google Gemini API key (for AI features)
- LinkedIn accounts (optional, for LinkedIn scraping)
- GitHub token (optional, for higher rate limits)

## 🚀 Installation

### 1. Clone and Setup
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install
```

### 2. Environment Configuration

Create `.env` file:

```env
# LinkedIn Configuration
LINKEDIN_ACCOUNTS=email1@example.com:password1,email2@example.com:password2
LINKEDIN_HEADLESS=true
MAX_SCRAPES_PER_ACCOUNT=10
ACCOUNT_COOLDOWN_HOURS=6

# LinkedIn 2FA (Optional)
LINKEDIN_2FA_SECRET_email1_at_example_com=YOUR_TOTP_SECRET_KEY
LINKEDIN_2FA_SECRET_email2_at_example_com=YOUR_TOTP_SECRET_KEY

# Google Gemini AI (Required for AI features)
GEMINI_API_KEY=your_gemini_api_key

# GitHub API (Optional)
GITHUB_TOKEN=your_github_token

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=true
PORT=5001
SECRET_KEY=your_secret_key
```

### 3. Run the Server
```bash
python app.py
```

Server will start on `http://localhost:5001`

## 🔗 API Endpoints

### **Data Extraction**
```http
POST /scrape
Content-Type: multipart/form-data

Form Data:
- linkedin_url: LinkedIn profile URL (optional)
- github_url: GitHub profile URL (optional)  
- resume_file: Resume file (PDF/DOC/DOCX) (optional)
```

### **AI Content Enhancement**
```http
POST /enhance-headline
Content-Type: application/json

{
  "portfolio_data": {
    "name": "John Doe",
    "experience": [...],
    "skills": [...],
    // ... other portfolio data
  }
}

Response:
{
  "success": true,
  "new_headline": "Generated professional headline",
  "message": "Headline enhanced successfully"
}
```

```http
POST /enhance-summary
Content-Type: application/json

{
  "portfolio_data": {
    "name": "John Doe",
    "experience": [...],
    "skills": [...],
    // ... other portfolio data
  }
}

Response:
{
  "success": true,
  "new_summary": "Generated professional summary...",
  "message": "Summary enhanced successfully"
}
```

### **Portfolio Generation**
```http
POST /download-portfolio
Content-Type: application/json

{
  "portfolio_data": {...},
  "template": "modern"
}

Response: ZIP file download
```

## 🔐 LinkedIn 2FA Setup

### 1. Enable 2FA on LinkedIn
1. Go to LinkedIn Settings & Privacy
2. Navigate to "Sign in & security"
3. Enable "Two-step verification"
4. Choose "Authenticator app"

### 2. Get TOTP Secret
During setup, LinkedIn will show:
- QR code (ignore this)
- **Text key/secret** (copy this)

### 3. Configure Environment
```env
# Format: LINKEDIN_2FA_SECRET_{email_with_underscores}
LINKEDIN_2FA_SECRET_your_email_at_domain_com=YOUR_TOTP_SECRET_KEY
```

### 4. How It Works
- PyOTP generates TOTP codes automatically
- Codes are entered during LinkedIn login
- No manual intervention required
- Supports multiple accounts with different secrets

## 🤖 AI Configuration

### Google Gemini Setup

1. **Get API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create new API key
   - Copy the key

2. **Configure Environment**:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. **AI Features**:
   - **Resume Parsing**: Extracts structured data from resume files
   - **Headline Generation**: Creates professional headlines based on experience
   - **Summary Generation**: Writes engaging 3-5 line summaries
   - **Fallback Support**: Graceful degradation when AI unavailable

### AI Processing Flow

1. **Resume Upload** → AI extracts projects, skills, experience
2. **Data Combination** → Merges LinkedIn, GitHub, and resume data
3. **Content Enhancement** → Generates professional headlines and summaries
4. **Individual Enhancement** → Users can enhance specific sections

## 📁 Project Structure

```
backend/
├── scraper/
│   ├── __init__.py
│   ├── linkedin_scraper.py      # LinkedIn automation with 2FA
│   ├── github_scraper.py        # GitHub API integration
│   ├── ai_resume_parser.py      # AI-powered resume parsing
│   └── otp_handler.py          # 2FA TOTP handling
├── templates/                   # Portfolio HTML templates
├── static/                     # Static assets
├── ai_content_generator.py     # AI headline/summary generation
├── portfolio_generator.py     # Portfolio HTML generation
├── config.py                   # Configuration management
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Docker configuration
└── .env                       # Environment variables
```

## 🔧 Configuration Options

### LinkedIn Scraping
```env
LINKEDIN_ACCOUNTS=email1:pass1,email2:pass2
LINKEDIN_HEADLESS=true
MAX_SCRAPES_PER_ACCOUNT=10
ACCOUNT_COOLDOWN_HOURS=6
LINKEDIN_MANUAL_MODE=false
```

### AI Configuration
```env
GEMINI_API_KEY=your_key
# AI will fallback to manual parsing if key is missing
```

### File Upload
```env
MAX_FILE_SIZE=16777216          # 16MB limit
ALLOWED_EXTENSIONS=pdf,doc,docx
```

## 🐛 Troubleshooting

### LinkedIn Issues
- **Login Failed**: Check credentials in LINKEDIN_ACCOUNTS
- **2FA Failed**: Verify TOTP secret key format
- **Rate Limited**: Increase ACCOUNT_COOLDOWN_HOURS
- **Browser Crashes**: Try LINKEDIN_HEADLESS=false for debugging

### AI Issues
- **Parsing Failed**: Check GEMINI_API_KEY validity
- **Quota Exceeded**: Monitor Gemini API usage limits
- **Empty Results**: AI will fallback to manual parsing

### General Issues
- **Port Conflicts**: Change PORT in .env file
- **Dependencies**: Reinstall with `pip install -r requirements.txt`
- **Playwright**: Run `playwright install` for browser setup

## 📄 License

Custom Proprietary License - See main project LICENSE file.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes to backend only
4. Test thoroughly
5. Submit pull request

## ⚖️ Legal & Ethical Guidelines

### **LinkedIn Scraping Compliance**

**Please read and comply with LinkedIn's Terms of Service before using the scraping functionality.**

#### **Responsible Usage Guidelines**
1. **Personal Use Only**: Use only for creating your own personal portfolio
2. **Respect Rate Limits**: Built-in delays and cooldowns prevent server overload
3. **Account Security**: Use dedicated accounts with 2FA for enhanced security
4. **Ethical Practices**: Don't overload servers or violate platform guidelines

#### **Built-in Safeguards**
- **Rate Limiting**: Maximum 10 scrapes per account per day
- **Cooldown Periods**: 6-hour cooldown between account uses
- **Random Delays**: Prevents detection and reduces server load
- **Circuit Breakers**: Automatic stopping when issues detected

### **AI Usage Compliance**
- **Google Gemini**: Follows Google AI usage policies and content guidelines
- **Data Privacy**: Processes data locally, doesn't store personal information
- **Ethical AI**: Uses AI for content enhancement, not manipulation

## 🔒 Security Notes

- Store credentials securely in .env file
- Use dedicated LinkedIn accounts for scraping
- Keep 2FA secrets confidential
- Monitor API usage and rate limits
- Follow all platform Terms of Service
- Use HTTPS in production environments
- Implement proper input validation
- Regular security audits and updates