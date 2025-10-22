# AutoPortfolio Frontend

A Next.js 14 frontend application for AutoPortfolio that automatically generates beautiful, professional portfolio websites from LinkedIn profiles, GitHub repositories, and resume data.

## 🎓 Educational Purpose

**This frontend is created for educational and learning purposes.** It demonstrates modern React development, Next.js 14 features, and full-stack integration patterns while maintaining respect for platform guidelines.

- **Learning Focus**: Modern React patterns, Next.js App Router, TypeScript integration
- **UI/UX Demonstration**: Responsive design, animations, and user experience best practices
- **Integration Patterns**: Frontend-backend communication and data handling
- **Educational Resource**: Understanding modern web development workflows

## 🚀 Features

- **Automated Data Extraction**: Integrates with Flask backend to extract LinkedIn, GitHub, and resume data
- **Multiple Templates**: Choose from Minimal, Modern, and Professional designs
- **Real-time Editing**: Edit extracted data before generating portfolio
- **Resume Upload**: Support for PDF, DOC, and DOCX file parsing
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion powered animations and transitions
- **TypeScript**: Full type safety throughout the application
- **Form Validation**: Comprehensive input validation and error handling

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📦 Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the frontend directory:
   ```bash
   # Copy example file (if it exists)
   cp .env.local.example .env.local
   ```
   
   Update the variables in `.env.local`:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_MAX_FILE_SIZE=16777216
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
frontend/
├── app/                        # Next.js 14 App Router
│   ├── page.tsx               # Landing page
│   ├── generate/              # Input form page
│   ├── preview/               # Data preview & editing
│   ├── portfolio/[id]/        # Generated portfolio
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
│   ├── form/                  # Form components
│   │   ├── InputForm.tsx      # Main input form
│   │   ├── FileUpload.tsx     # Resume upload
│   │   └── LoadingState.tsx   # Loading animation
│   ├── preview/               # Preview & editing
│   │   ├── DataPreview.tsx    # Data display
│   │   ├── EditModal.tsx      # Edit functionality
│   │   └── TemplateSelector.tsx # Template chooser
│   ├── portfolio/             # Portfolio sections
│   │   ├── Hero.tsx           # Hero section
│   │   ├── Experience.tsx     # Work experience
│   │   ├── Projects.tsx       # GitHub projects
│   │   ├── Skills.tsx         # Skills display
│   │   ├── Education.tsx      # Education timeline
│   │   └── Contact.tsx        # Contact section
│   └── ui/                    # Reusable UI components
├── lib/                       # Utilities and configurations
│   ├── api.ts                 # Backend API calls
│   ├── types.ts               # TypeScript interfaces
│   └── utils.ts               # Helper functions
├── store/
│   └── portfolioStore.ts      # Zustand state management
└── public/                    # Static assets
```

## 🎨 Templates

### Minimal Template
- Clean, simple design with blue accents
- Focus on content and readability
- Perfect for traditional industries

### Modern Template
- Dark theme with purple accents
- Bold typography and animations
- Great for tech and creative fields

### Professional Template
- Corporate style with green accents
- Structured layout and clean lines
- Ideal for business and consulting

## 🔄 User Flow

1. **Landing Page** (`/`) - Introduction and features
2. **Generate Form** (`/generate`) - Input LinkedIn/GitHub URLs and resume
3. **Preview & Edit** (`/preview`) - Review data and select template
4. **Portfolio** (`/portfolio/[id]`) - Final generated portfolio

## 🌐 API Integration

The frontend integrates with the Flask backend through these endpoints:

- `GET /` - Health check
- `POST /scrape` - Main scraping endpoint

### Request Format
```typescript
// Form data sent to backend
{
  linkedin_url?: string;        // Optional LinkedIn profile URL
  github_url?: string;          // Optional GitHub profile URL  
  resume_file?: File;           // Optional resume file (PDF/DOC/DOCX)
}
```

### Response Format
```typescript
// Combined portfolio data from all sources
{
  name: string;
  headline: string;
  about: string;
  experience: Experience[];
  skills: string[];
  projects: Project[];          // Transformed from GitHub repositories
  education?: Education[];
  contact?: Contact;
  certificates?: Certificate[]; // From LinkedIn
}
```

## 🎯 Key Features

### Form Validation
- URL validation for LinkedIn and GitHub
- File type and size validation for resume uploads
- Real-time error feedback

### Data Editing
- Inline editing for all sections
- Modal-based editing for complex data
- Real-time preview updates

### Template System
- Three distinct visual themes
- CSS custom properties for easy theming
- Responsive design across all templates

### Animations
- Page transitions with Framer Motion
- Scroll-triggered animations
- Hover effects and micro-interactions

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables**:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
   NEXT_PUBLIC_APP_URL=https://your-frontend-url.vercel.app
   ```
3. **Deploy** - Vercel will automatically build and deploy

### Manual Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm start
   ```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Tailwind CSS** for consistent styling

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Check if backend is running on port 5001
   - Verify CORS settings in backend
   - Check environment variables

2. **Build Errors**
   - Clear `.next` folder and rebuild
   - Check for TypeScript errors
   - Verify all dependencies are installed

3. **Styling Issues**
   - Check Tailwind CSS configuration
   - Verify CSS custom properties
   - Clear browser cache

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License & Compliance

This frontend is part of the AutoPortfolio system and is subject to the Custom Proprietary License in the main repository.

**Important Notes:**
- **Educational Purpose**: This frontend is designed for learning modern web development
- **Platform Respect**: Integrates responsibly with backend that respects platform terms
- **User Responsibility**: Users must ensure compliance with all platform terms of service
- **No Commercial Use**: Intended for personal and educational use only

See the main repository LICENSE file for complete terms and conditions.

## 🤝 Support

For support and questions:
- **Troubleshooting**: Check the troubleshooting section above
- **Backend Issues**: Review the backend README for API-related problems
- **GitHub Issues**: [Create an issue](https://github.com/v-vekpawar/autoportfolio/issues) with detailed information
- **Documentation**: Check the main README.md for complete setup instructions
- **Email**: contact.vivekpawar@gmail.com

## 🔗 Related Documentation

- **Main README**: Complete project overview and setup guide
- **Backend README**: API documentation and scraping details
- **SETUP_GUIDE.md**: Detailed installation instructions
- **LICENSE**: Terms and conditions for usage