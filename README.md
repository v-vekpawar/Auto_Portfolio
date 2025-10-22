# 🚀 AutoPortfolio - Intelligent Automated Portfolio Generator

![AutoPortfolio Banner](https://img.shields.io/badge/AutoPortfolio-v1.0-blue?style=for-the-badge&logo=react)

AutoPortfolio is a full-stack web application that automatically generates beautiful, professional portfolio websites from your LinkedIn profile, GitHub repositories, and resume. No coding required – just provide your data and get a stunning portfolio in minutes!

## 🎓 Educational Purpose & Platform Compliance

**This project is created purely for educational and learning purposes.** I deeply respect and acknowledge the terms of service and guidelines of LinkedIn, GitHub, and all other platforms integrated within this application. 

- **Educational Intent**: This project demonstrates web scraping, API integration, and full-stack development concepts
- **Platform Respect**: Full compliance with LinkedIn's Terms of Service, robots.txt, and usage guidelines
- **Responsible Usage**: Encourages ethical data extraction practices and rate limiting
- **Learning Resource**: Designed to help developers understand modern web technologies and data integration

**Users are expected to use this software responsibly and in compliance with all applicable platform terms and legal requirements.**

## ✨ Features

- 🔗 **LinkedIn Integration** - Automatically extract profile, experience, skills, and education
- 🐙 **GitHub Integration** - Showcase your repositories with live stats
- 📄 **Resume Parsing** - Upload PDF/DOC/DOCX files for enhanced data extraction
- 🎨 **Multiple Templates** - Choose from Minimal, Modern, or Professional designs
- ✏️ **Live Editing** - Edit any section before generating your portfolio
- 🧩 **Custom Sections** - Add your own sections (hobbies, awards, etc.)
- 📱 **Fully Responsive** - Perfect on desktop, tablet, and mobile
- ⚡ **Fast Generation** - Get your portfolio in under 60 seconds

## 🛠️ Tech Stack

### Backend
- **Python 3.8+** - Core language
- **Flask** - Web framework
- **Playwright** - LinkedIn scraping
- **GitHub API** - Repository data
- **PyPDF2/python-docx** - Resume parsing

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8 or higher** - [Download Python](https://python.org/downloads/)
- **Node.js 18 or higher** - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/)

## 🚀 Complete Setup Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/autoportfolio.git
cd autoportfolio
```

### Step 2: Backend Setup

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Create Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

#### 2.3 Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### 2.4 Install Playwright Browsers
```bash
playwright install
```

#### 2.5 Configure Environment Variables
Create a `.env` file in the `backend` directory:

```bash
# Copy the example file (if it exists)
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# LinkedIn Scraping Configuration (Optional but recommended)
LINKEDIN_ACCOUNTS=your_email_1@example.com:your_password_1,your_email_2@example.com:your_password_2,
LINKEDIN_HEADLESS=true
MAX_SCRAPES_PER_ACCOUNT=10
ACCOUNT_COOLDOWN_HOURS=6

# GitHub API Configuration (Optional - for higher rate limits)
GITHUB_TOKEN=your_github_personal_access_token

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=true
FLASK_PORT=5001

# Security
SECRET_KEY=your_secret_key_here
```

### Step 3: Frontend Setup

#### 3.1 Navigate to Frontend Directory
```bash
# Open new terminal window/tab
cd frontend
```

#### 3.2 Install Node.js Dependencies
```bash
npm install
```

#### 3.3 Configure Environment Variables
Create a `.env.local` file in the `frontend` directory:

```bash
# Copy example file (if it exists)
cp .env.local.example .env.local
```

Edit the `.env.local` file:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Run the Application

You need to run both backend and frontend simultaneously.

#### 4.1 Start the Backend Server
```bash
# In the backend directory with activated virtual environment
cd backend
python app.py
```

You should see:
```
* Running on http://localhost:5001
* Debug mode: on
```

#### 4.2 Start the Frontend Development Server
```bash
# In a new terminal, navigate to frontend directory
cd frontend
npm run dev
```

You should see:
```
▲ Next.js 14.0.0
- Local:        http://localhost:3000
```

### Step 5: Access the Application

Open your browser and navigate to:
- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5001

## 📖 How to Use AutoPortfolio

### Step 1: Provide Your Data
1. Go to http://localhost:3000
2. Click "Get Started"
3. Provide at least one of:
   - **LinkedIn Profile URL** (e.g., https://linkedin.com/in/yourprofile)
   - **GitHub Username** (e.g., yourusername)
   - **Resume File** (PDF, DOC, or DOCX format)

### Step 2: Data Extraction
1. Click "Extract Data"
2. Wait 30-60 seconds for processing
3. The system will:
   - Scrape your LinkedIn profile (if provided)
   - Fetch GitHub repositories and stats
   - Parse your resume content

### Step 3: Review & Edit
1. Review all extracted information
2. Edit any sections as needed
3. Add missing information
4. Create custom sections (awards, hobbies, etc.)
5. Choose your preferred template design

### Step 4: Generate Portfolio
1. Click "Generate Portfolio"
2. Your portfolio website is created instantly
3. Share the generated link or download the files

## ⚖️ LinkedIn Scraping - Legal & Ethical Guidelines

### 🚨 IMPORTANT LEGAL NOTICE

**Please read and comply with LinkedIn's Terms of Service before using the scraping functionality.**

### LinkedIn Terms of Service Compliance

1. **Personal Use Only**
   - Use AutoPortfolio only for creating your own personal portfolio
   - Do NOT use it for commercial data harvesting
   - Do NOT scrape other people's profiles without explicit permission

2. **Respect Rate Limits**
   - The application includes built-in delays and cooldowns
   - Maximum 10 scrapes per account per day (configurable)
   - 6-hour cooldown between account uses
   - Random delays between requests to avoid detection

3. **Account Security**
   - Use dedicated LinkedIn accounts for scraping (not your main account)
   - Consider using LinkedIn's official API for commercial applications
   - Store credentials securely in environment variables

4. **Responsible Scraping Practices**
   - Don't overload LinkedIn's servers
   - Respect robots.txt guidelines
   - Use headless mode in production
   - Monitor for IP blocking or account restrictions

### LinkedIn API Alternative

For commercial use or higher volume needs, consider using:
- **LinkedIn Marketing Developer Platform**
- **LinkedIn Profile API** (requires approval)
- **LinkedIn Learning API**

### Configuration for Ethical Scraping

```env
# Recommended settings for responsible scraping
LINKEDIN_HEADLESS=true
MAX_SCRAPES_PER_ACCOUNT=5
ACCOUNT_COOLDOWN_HOURS=12
SELENIUM_TIMEOUT=15
RANDOM_DELAY_MIN=2
RANDOM_DELAY_MAX=5
```

### Legal Disclaimer

- Users are solely responsible for compliance with LinkedIn's Terms of Service
- AutoPortfolio developers are not liable for any misuse of the scraping functionality
- Always check current LinkedIn Terms of Service before use
- Consider legal consultation for commercial applications

## 🔧 Configuration Options

### Backend Configuration (.env)

```env
# LinkedIn Scraping
LINKEDIN_ACCOUNTS=email1:pass1,email2:pass2  # Multiple accounts for rotation
LINKEDIN_HEADLESS=true                        # Run browser in background
MAX_SCRAPES_PER_ACCOUNT=10                   # Daily limit per account
ACCOUNT_COOLDOWN_HOURS=6                     # Hours between account reuse

# GitHub API
GITHUB_TOKEN=ghp_your_token_here             # Personal access token
GITHUB_MAX_REPOS=10                          # Max repositories to fetch

# File Upload
MAX_FILE_SIZE=16777216                       # 16MB file size limit
ALLOWED_EXTENSIONS=pdf,doc,docx              # Allowed resume formats

# Flask Settings
FLASK_ENV=development                        # development/production
FLASK_DEBUG=true                            # Enable debug mode
FLASK_PORT=5001                             # Backend port
SECRET_KEY=your_secret_key                  # Flask secret key
```

### Frontend Configuration (.env.local)

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001    # Backend API URL
NEXT_PUBLIC_APP_URL=http://localhost:3000        # Frontend URL
NEXT_PUBLIC_MAX_FILE_SIZE=16777216              # File upload limit
```

## 🐛 Troubleshooting

### Common Backend Issues

#### Python/Pip Issues
```bash
# If pip is not found
python -m ensurepip --upgrade

# If virtual environment activation fails
python -m venv --clear venv
```

#### Playwright Issues
```bash
# If browser installation fails
playwright install --force

# If specific browser needed
playwright install chromium
```

#### LinkedIn Scraping Issues
- **Profile not found**: Ensure LinkedIn URL is public and correct
- **Login failed**: Check credentials in .env file
- **Rate limited**: Reduce MAX_SCRAPES_PER_ACCOUNT or increase cooldown
- **Browser crashes**: Try with LINKEDIN_HEADLESS=false for debugging

#### Port Issues
```bash
# If port 5001 is in use (Windows)
netstat -ano | findstr :5001
taskkill /PID <PID_NUMBER> /F

# If port 5001 is in use (macOS/Linux)
lsof -ti:5001 | xargs kill -9
```

### Common Frontend Issues

#### Node.js/NPM Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# If npm install fails, try yarn
npm install -g yarn
yarn install
```

#### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild the application
npm run build
```

#### Connection Issues
- Ensure backend is running on port 5001
- Check NEXT_PUBLIC_BACKEND_URL in .env.local
- Verify CORS settings in Flask backend
- Check browser console for detailed error messages

### Getting Help

1. **Check Console Logs**: Look for detailed error messages
2. **Verify Prerequisites**: Ensure Python, Node.js, and Git are installed
3. **Environment Variables**: Double-check all .env configurations
4. **Port Conflicts**: Make sure ports 3000 and 5001 are available
5. **GitHub Issues**: Create an issue with detailed error information


## 📁 Project Structure

```
autoportfolio/
├── backend/                    # Flask backend application
│   ├── scraper/               # Data extraction modules
│   │   ├── linkedin_scraper.py    # LinkedIn profile scraping
│   │   ├── github_scraper.py      # GitHub API integration
│   │   └── resume_parser.py       # PDF/DOC resume parsing
│   ├── templates/             # Portfolio HTML templates
│   ├── static/               # Static assets
│   ├── app.py               # Main Flask application
│   ├── config.py            # Configuration management
│   ├── requirements.txt     # Python dependencies
│   └── .env                # Environment variables
├── frontend/                   # Next.js frontend application
│   ├── app/                  # Next.js 14 App Router
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/           # React components
│   │   ├── ui/              # UI components
│   │   ├── form/            # Form components
│   │   └── portfolio/       # Portfolio components
│   ├── lib/                 # Utilities and configurations
│   │   ├── types.ts         # TypeScript type definitions
│   │   └── utils.ts         # Utility functions
│   ├── store/               # State management (Zustand)
│   ├── public/              # Static assets
│   ├── package.json         # Node.js dependencies
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   ├── tsconfig.json        # TypeScript configuration
│   └── .env.local          # Environment variables
├── .gitignore              # Git ignore rules
├── README.md              # This file
├── SETUP_GUIDE.md         # Detailed setup instructions
└── LICENSE               # License file (recommended)
```

## 📄 License Information

### Custom Proprietary License

AutoPortfolio is released under a **Custom Proprietary License** that provides specific usage rights while maintaining control over distribution and modifications.

### What You CAN Do:
- ✅ Use the software for personal or educational purposes
- ✅ Run and execute the software on your local systems
- ✅ Make modifications for your own personal use
- ✅ Create portfolios using the application

### What You CANNOT Do:
- ❌ Distribute or share the original code or modified versions
- ❌ Copy code to other projects or repositories
- ❌ Upload modified versions to public repositories without approval
- ❌ Use the code as a base for competing products
- ❌ Sublicense or sell the software

### Contribution Process:
1. **Local Development**: Make modifications on your local machine only
2. **Submit Pull Request**: Propose changes via GitHub pull requests
3. **Wait for Approval**: Only approved changes can be pushed to the repository
4. **No Unauthorized Distribution**: Modified versions must stay local until approved

### Legal Responsibility:
- **User Liability**: You are fully responsible for compliance with all laws and platform terms
- **LinkedIn Compliance**: You must follow LinkedIn's Terms of Service
- **No Author Liability**: The author is not responsible for any misuse or legal issues
- **Indemnification**: Users agree to protect the author from legal claims

### Why This License?

This custom license allows:
1. **Controlled Distribution**: Prevents unauthorized copying and sharing
2. **Quality Control**: Ensures all public modifications are approved
3. **Legal Protection**: Shields the author from liability
4. **Usage Freedom**: Still allows personal and commercial use
5. **Contribution Management**: Maintains organized development process

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: `git commit -m 'Add amazing feature'`
4. **Push to Branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Be respectful and constructive in discussions

## 🙏 Acknowledgments

- **LinkedIn** for providing professional profile data
- **GitHub** for repository and project information
- **Playwright** for reliable web scraping capabilities
- **Next.js** and **React** for the powerful frontend framework
- **Flask** for the lightweight and flexible backend
- **Tailwind CSS** for beautiful and responsive styling
- **Open Source Community** for inspiration and tools

## ⚠️ Important Disclaimers

1. **LinkedIn Compliance**: Users are responsible for complying with LinkedIn's Terms of Service
2. **Personal Use**: Designed for creating personal portfolios, not commercial data harvesting
3. **Data Security**: Handle all personal data responsibly and securely
4. **Legal Compliance**: Ensure compliance with all applicable laws and regulations
5. **No Warranty**: Software provided "as is" without warranty of any kind

## 📞 Support & Contact

- **GitHub Issues**: [Create an issue](https://github.com/v-vekpawar/autoportfolio/issues)
- **Documentation**: Check SETUP_GUIDE.md for detailed instructions
- **Email**: contact.vivekpawar@gmail.com (replace with your contact)

---

**Built with ❤️ for the developer community**

*If AutoPortfolio helped you create an amazing portfolio, please give it a ⭐ on GitHub and share it with others!*

## 🔄 Version History

- **v1.0.0** - Initial release with LinkedIn, GitHub, and resume parsing
- **v1.1.0** - Added multiple templates and custom sections
- **v1.2.0** - Enhanced scraping reliability and error handling

---

*Last updated: October 2025*