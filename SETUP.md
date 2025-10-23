# 🚀 AutoPortfolio Complete Setup Guide

**Comprehensive setup instructions for AutoPortfolio - Intelligent Automated Portfolio Generator**

## 🎓 Educational Purpose & Platform Compliance

**This project is created purely for educational and learning purposes.** We deeply respect and acknowledge the terms of service and guidelines of LinkedIn, GitHub, and all other platforms integrated within this application.

### **Educational Intent**

- **Learning Resource**: Demonstrates web scraping, API integration, and full-stack development concepts
- **Technology Showcase**: Shows modern web technologies, AI integration, and automation techniques
- **Best Practices**: Illustrates responsible data extraction and ethical scraping practices
- **Open Source Education**: Helps developers understand complex system architecture

### **Platform Respect & Compliance**

- **LinkedIn Terms**: Full compliance with LinkedIn's Terms of Service, robots.txt, and usage guidelines
- **GitHub Guidelines**: Respects GitHub's API terms and rate limiting policies
- **Google AI**: Follows Google Gemini AI usage policies and best practices
- **Responsible Usage**: Encourages ethical data extraction practices and rate limiting

### **Legal Responsibility**

**Users are expected to use this software responsibly and in compliance with all applicable platform terms and legal requirements.**

---

## 📋 Prerequisites

Before starting, ensure you have:

- **Python 3.8+** - [Download Python](https://python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/)
- **Google Gemini API Key** - [Get API Key](https://aistudio.google.com/app/api-keys)
- **LinkedIn Account** (Optional) - For LinkedIn scraping
- **GitHub Token** (Optional) - For higher API rate limits

---

## 🔧 Complete Installation Guide

### Step 1: Clone Repository

```bash
git clone https://github.com/v-vekpawar/autoportfolio.git
cd autoportfolio
```

### Step 2: Backend Setup

#### 2.1 Navigate to Backend

```bash
cd backend
```

#### 2.2 Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

#### 2.3 Install Dependencies

```bash
pip install -r requirements.txt
```

#### 2.4 Install Playwright Browsers

```bash
playwright install
```

#### 2.5 Configure Environment Variables

Create `backend/.env` file:

```env
# LinkedIn Configuration (Optional but recommended)
LINKEDIN_ACCOUNTS=your_email_1@example.com:your_password_1,your_email_2@example.com:your_password_2
LINKEDIN_HEADLESS=true
MAX_SCRAPES_PER_ACCOUNT=10
ACCOUNT_COOLDOWN_HOURS=6

# LinkedIn 2FA Configuration (Optional - for accounts with 2FA enabled)
# Format: LINKEDIN_2FA_SECRET_{email_with_underscores_and_at}
LINKEDIN_2FA_SECRET_your_email_at_example_com=YOUR_TOTP_SECRET_KEY

# Google Gemini AI Configuration (Required for AI features)
GEMINI_API_KEY=your_gemini_api_key_here

# GitHub API Configuration (Optional - for higher rate limits)
GITHUB_TOKEN=your_github_personal_access_token

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=true
PORT=5001
SECRET_KEY=your_secret_key_here

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,https://your-frontend-domain.com
```

### Step 3: Frontend Setup

#### 3.1 Navigate to Frontend (New Terminal)

```bash
cd frontend
```

#### 3.2 Install Dependencies

```bash
npm install
```

#### 3.3 Configure Environment Variables

Create `frontend/.env.local` file:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MAX_FILE_SIZE=16777216
```

---

## 🔐 LinkedIn 2FA Setup (Optional)

### Step 1: Enable 2FA on LinkedIn

1. **Login to LinkedIn** → Go to Settings & Privacy
2. **Navigate to Security** → "Sign in & security" section
3. **Enable Two-step verification** → Choose "Authenticator app"
4. **Setup Process** → LinkedIn will show QR code and text key

### Step 2: Get TOTP Secret Key

**Important**: You need the **text key/secret**, not the QR code!

During LinkedIn 2FA setup:

- ✅ **Copy the text key** (long string of letters/numbers)
- ❌ **Don't use QR code** (not compatible with PyOTP)

### Step 3: Configure in Environment

Add to `backend/.env`:

```env
# Format: LINKEDIN_2FA_SECRET_{email_with_underscores}
# Replace @ with _at_ and . with _
LINKEDIN_2FA_SECRET_your_email_at_domain_com=YOUR_TOTP_SECRET_KEY
```

### Step 4: Test 2FA Setup

The system will automatically:

- Generate TOTP codes using PyOTP
- Enter codes during LinkedIn login
- Handle 2FA authentication seamlessly

---

## 🤖 Google Gemini AI Setup (Required)

### Step 1: Get API Key

1. **Visit Google AI Studio**: [https://aistudio.google.com/app/api-keys](https://aistudio.google.com/app/api-keys)
2. **Sign in** with your Google account
3. **Create API Key** → Click "Create API Key"
4. **Copy the key** → Save it securely

### Step 2: Configure API Key

Add to `backend/.env`:

````env
GEMINI_API_KEY=your_api_key_here

### Step 3: Verify AI Features

The AI will be used for:

- **Resume Parsing**: Extract structured data from PDF/DOC files
- **Headline Generation**: Create professional headlines
- **Summary Generation**: Write engaging 3-5 line summaries

---

## 🐙 GitHub Token Setup (Optional)

### Step 1: Create Personal Access Token

1. **GitHub Settings** → Developer settings → Personal access tokens
2. **Generate new token** → Choose "Tokens (classic)"
3. **Select scopes**: `public_repo` (for public repositories)
4. **Generate token** → Copy the token

### Step 2: Configure Token

Add to `backend/.env`:

```env
GITHUB_TOKEN=your_github_personal_access_token
````

**Benefits**:

- Higher API rate limits (5000 vs 60 requests/hour)
- Access to private repositories (if needed)
- Better reliability for GitHub data fetching

---

## 🚀 Running the Application

### Step 1: Start Backend Server

```bash
# In backend directory with activated virtual environment
cd backend
python app.py
```

**Expected Output**:

```
* Running on http://localhost:5001
* Debug mode: on
INFO:ai_content_generator:✅ Gemini AI initialized for content generation
```

### Step 2: Start Frontend Server

```bash
# In new terminal, navigate to frontend directory
cd frontend
npm run dev
```

**Expected Output**:

```
▲ Next.js 14.0.0
- Local:        http://localhost:3000
- Ready in 2.1s
```

### Step 3: Access Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5001](http://localhost:5001)

---

## 🧪 Testing the Setup

### 1. Health Check

Visit [http://localhost:5001](http://localhost:5001) - Should show:

```json
{
  "status": "healthy",
  "message": "AutoPortfolio Backend API is running"
}
```

### 2. Frontend Test

Visit [http://localhost:3000](http://localhost:3000) - Should show the landing page

### 3. AI Test (Optional)

Test AI functionality at [http://localhost:5001/test-ai](http://localhost:5001/test-ai)

### 4. Complete Flow Test

1. **Go to** [http://localhost:3000](http://localhost:3000)
2. **Click** "Get Started"
3. **Provide** at least one data source:
   - LinkedIn URL: `https://linkedin.com/in/yourprofile`
   - GitHub URL: `https://github.com/yourusername`
   - Resume file: Upload PDF/DOC/DOCX
4. **Click** "Extract Data"
5. **Wait** for processing (30-60 seconds)
6. **Review** extracted data in preview
7. **Use** AI enhancement buttons for headline/summary
8. **Generate** portfolio

---

## 🔧 Configuration Options

### LinkedIn Scraping Settings

```env
# Account rotation
LINKEDIN_ACCOUNTS=email1:pass1,email2:pass2,email3:pass3

# Scraping behavior
LINKEDIN_HEADLESS=true                    # Run browser in background
MAX_SCRAPES_PER_ACCOUNT=10               # Daily limit per account
ACCOUNT_COOLDOWN_HOURS=6                 # Hours between account reuse
LINKEDIN_MANUAL_MODE=false               # Enable manual intervention

# Security
RANDOM_DELAY_MIN=2                       # Minimum delay between actions
RANDOM_DELAY_MAX=5                       # Maximum delay between actions
```

### AI Configuration

```env
# Google Gemini
GEMINI_API_KEY=your_key                  # Required for AI features

# AI behavior (optional)
AI_TIMEOUT=30                            # AI request timeout in seconds
AI_RETRY_COUNT=3                         # Number of retries for failed requests
```

### File Upload Settings

```env
# File handling
MAX_FILE_SIZE=16777216                   # 16MB file size limit
ALLOWED_EXTENSIONS=pdf,doc,docx          # Allowed resume formats
UPLOAD_FOLDER=uploads                    # Upload directory
```

---

## 🐛 Troubleshooting

### Common Backend Issues

#### Python/Pip Issues

```bash
# If pip is not found
python -m ensurepip --upgrade

# If virtual environment fails
python -m venv --clear venv
```

#### Playwright Issues

```bash
# If browser installation fails
playwright install --force

# If specific browser needed
playwright install chromium
```

#### LinkedIn Issues

- **Login Failed**: Check credentials in `LINKEDIN_ACCOUNTS`
- **2FA Failed**: Verify TOTP secret key format and timing
- **Rate Limited**: Increase `ACCOUNT_COOLDOWN_HOURS`
- **Browser Crashes**: Try `LINKEDIN_HEADLESS=false` for debugging

#### AI Issues

- **API Key Invalid**: Verify `GEMINI_API_KEY` at Google AI Studio
- **Quota Exceeded**: Check API usage limits
- **Parsing Failed**: AI will fallback to manual parsing

### Common Frontend Issues

#### Node.js/NPM Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build Issues

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### Connection Issues

- **Backend Unreachable**: Verify `NEXT_PUBLIC_BACKEND_URL`
- **CORS Errors**: Check `CORS_ORIGINS` in backend `.env`
- **Port Conflicts**: Change ports in environment files

### Port Conflicts

#### Windows

```cmd
# Find process using port
netstat -ano | findstr :5001
# Kill process
taskkill /PID <PID_NUMBER> /F
```

#### macOS/Linux

```bash
# Find and kill process
lsof -ti:5001 | xargs kill -9
```

---

## 🔒 Security Best Practices

### LinkedIn Account Security

1. **Use Dedicated Accounts**: Don't use your main LinkedIn account
2. **Enable 2FA**: Use TOTP 2FA for additional security
3. **Monitor Usage**: Keep track of scraping activity
4. **Respect Limits**: Don't exceed rate limits
5. **Secure Storage**: Keep credentials in `.env` files only

### API Key Security

1. **Environment Variables**: Never commit API keys to version control
2. **Key Rotation**: Regularly rotate API keys
3. **Access Control**: Limit API key permissions
4. **Monitoring**: Monitor API usage and costs

### General Security

1. **HTTPS in Production**: Use HTTPS for production deployments
2. **Input Validation**: Validate all user inputs
3. **File Upload Security**: Scan uploaded files for malware
4. **Rate Limiting**: Implement rate limiting for API endpoints

---

## 🚀 Production Deployment

### Backend Deployment (Render/Heroku)

1. **Prepare for Production**:

   ```env
   FLASK_ENV=production
   FLASK_DEBUG=false
   LINKEDIN_HEADLESS=true
   ```

2. **Docker Deployment**:
   ```bash
   docker build -t autoportfolio-backend .
   docker run -p 5001:5001 autoportfolio-backend
   ```

### Frontend Deployment (Vercel/Netlify)

1. **Build for Production**:

   ```bash
   npm run build
   ```

2. **Environment Variables**:
   ```env
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com
   NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
   ```

---

## 📄 Legal & Compliance

### Educational Use Only

This project is designed for:

- **Learning web scraping techniques**
- **Understanding AI integration**
- **Exploring full-stack development**
- **Demonstrating automation concepts**

### Platform Compliance

- **LinkedIn**: Respect Terms of Service and rate limits
- **GitHub**: Follow API guidelines and attribution requirements
- **Google AI**: Comply with Gemini AI usage policies
- **General**: Use responsibly and ethically

### User Responsibility

Users must:

- **Comply with all platform terms**
- **Use only for personal portfolios**
- **Respect rate limits and guidelines**
- **Take responsibility for their usage**

---

## 🤝 Getting Help

### Documentation

- **Main README**: Project overview and features
- **Backend README**: Backend-specific documentation
- **Frontend README**: Frontend-specific documentation

### Support Channels

- **GitHub Issues**: [Create an issue](https://github.com/v-vekpawar/autoportfolio/issues)
- **Discussions**: Community discussions and Q&A
- **Email**: contact.vivekpawar@gmail.com

### Before Asking for Help

1. **Check this setup guide** thoroughly
2. **Review error messages** carefully
3. **Check environment variables** are correct
4. **Verify prerequisites** are installed
5. **Test with minimal configuration** first

---

**Built with ❤️ for the developer community**

_If AutoPortfolio helped you create an amazing portfolio, please give it a ⭐ on GitHub and share it with others!_
