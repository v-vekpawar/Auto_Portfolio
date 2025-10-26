from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import json
import io
from scraper.linkedin_scraper import LinkedInScraper, scrape_linkedin_profile
from scraper.github_scraper import GitHubScraper
from scraper.ai_resume_parser import AIResumeParser as ResumeParser
from portfolio_generator import PortfolioGenerator
from ai_content_generator import force_enhance_portfolio_content
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
# Configure CORS for production and development
allowed_origins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://autoportfolio.vercel.app',  # Replace with your actual Vercel domain
    'https://*.vercel.app'  # Allow all Vercel preview deployments
]

# Get additional origins from environment variable
cors_origins_env = os.getenv('CORS_ORIGINS', '')
if cors_origins_env:
    additional_origins = [origin.strip() for origin in cors_origins_env.split(',')]
    allowed_origins.extend(additional_origins)
    
CORS(app, origins=allowed_origins)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'AutoPortfolio Backend API is running'
    })

@app.route('/scrape', methods=['POST'])
def scrape_profile():
    try:
        # Get form data
        linkedin_url = request.form.get('linkedin_url', '').strip()
        github_url = request.form.get('github_url', '').strip()
        resume_file = request.files.get('resume_file')
        headless_mode = os.getenv('LINKEDIN_HEADLESS', 'True').lower() == 'true'
        
        # Check if at least one input is provided
        if not linkedin_url and not github_url and not resume_file:
            return jsonify({'error': 'At least one input is required: LinkedIn URL, GitHub URL, or Resume file'}), 400
        
        # Initialize scrapers
        github_scraper = GitHubScraper()
        resume_parser = ResumeParser()
        
        # Initialize data containers
        linkedin_data = {}
        github_data = {}
        resume_data = {}
        
        # Priority 1: Parse resume first (highest priority)
        if resume_file:
            print("📄 Step 1/4: Parsing resume...")
            # Save uploaded file temporarily
            filename = resume_file.filename
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            resume_file.save(filepath)
            
            # Parse resume
            resume_data = resume_parser.parse_resume(filepath)
            
            # Clean up uploaded file
            os.remove(filepath)
            print("✅ Resume parsing completed")
        else:
            print("📄 Step 1/4: No resume file provided, skipping resume parsing")
        
        # Priority 2: Scrape LinkedIn data (medium priority)
        if linkedin_url:
            print(f"🔗 Step 2/4: Scraping LinkedIn: {linkedin_url} (headless: {headless_mode})")
            try:
                linkedin_data = scrape_linkedin_profile(linkedin_url, headless=headless_mode)
                if not linkedin_data or linkedin_data.get('name') == 'John Doe':
                    print("⚠️ LinkedIn scraping returned dummy data, using empty fallback")
                    linkedin_data = {
                        'name': '',
                        'headline': '',
                        'about': '',
                        'experience': [],
                        'skills': [],
                        'education': [],
                        'certificates': []
                    }
                else:
                    print("✅ LinkedIn scraping completed successfully")
            except Exception as e:
                print(f"❌ LinkedIn scraping failed: {e}")
                linkedin_data = {
                    'name': '',
                    'headline': '',
                    'about': '',
                    'experience': [],
                    'skills': [],
                    'education': [],
                    'certificates': []
                }
        else:
            print("🔗 Step 2/4: No LinkedIn URL provided, skipping LinkedIn scraping")
            linkedin_data = {
                'name': '',
                'headline': '',
                'about': '',
                'experience': [],
                'skills': [],
                'education': [],
                'certificates': []
            }
        
        # Priority 3: Scrape GitHub data (lowest priority)
        if github_url:
            print(f"🐙 Step 3/4: Scraping GitHub: {github_url}")
            try:
                github_data = github_scraper.scrape_profile(github_url)
                print("✅ GitHub scraping completed successfully")
            except Exception as e:
                print(f"❌ GitHub scraping failed: {e}")
                github_data = {}
        else:
            print("🐙 Step 3/4: No GitHub URL provided, skipping GitHub scraping")
            github_data = {}
        
        # Combine all data
        print("🔄 Step 4/4: Combining and processing data...")
        portfolio_data = combine_profile_data(linkedin_data, github_data, resume_data)
        
        # Enhance portfolio content with AI-generated headlines and summaries
        print("🤖 Enhancing portfolio content with AI...")
        try:
            portfolio_data = enhance_portfolio_content(portfolio_data)
            print("✅ AI content enhancement completed")
        except Exception as e:
            print(f"⚠️ AI content enhancement failed: {e}")
            # Continue without AI enhancement
        
        # Debug: Log final portfolio data structure
        print(f"📊 Final portfolio data:")
        print(f"  - Name: {portfolio_data.get('name', 'N/A')}")
        print(f"  - Headline: {portfolio_data.get('headline', 'N/A')[:50]}...")
        print(f"  - About: {len(portfolio_data.get('about', ''))} characters")
        print(f"  - Projects: {len(portfolio_data.get('projects', []))}")
        print(f"  - Certificates: {len(portfolio_data.get('certificates', []))}")
        print(f"  - Experience: {len(portfolio_data.get('experience', []))}")
        print(f"  - Skills: {len(portfolio_data.get('skills', []))}")
        
        if portfolio_data.get('projects'):
            print(f"  - Project names: {[p.get('name') for p in portfolio_data['projects']]}")
        if portfolio_data.get('certificates'):
            print(f"  - Certificate names: {[c.get('certificate') for c in portfolio_data['certificates']]}")
        
        print("🎉 Portfolio generation completed successfully!")
        return jsonify(portfolio_data)
        
    except Exception as e:
        print(f"Error in scrape_profile: {str(e)}")
        return jsonify({'error': f'Failed to scrape profile: {str(e)}'}), 500

def combine_profile_data(linkedin_data, github_data, resume_data):
    """Combine data from different sources with section-wise priorities"""
    
    # Initialize portfolio with empty data
    portfolio = {
        'name': '',
        'headline': '',
        'about': '',
        'experience': [],
        'skills': [],
        'education': [],
        'certificates': [],
        'projects': [],
        'contact': {}
    }
    
    # Track data sources for each section (for future user switching)
    data_sources = {
        'name': {'resume': '', 'linkedin': '', 'github': ''},
        'headline': {'resume': '', 'linkedin': '', 'github': ''},
        'about': {'resume': '', 'linkedin': '', 'github': ''},
        'experience': {'resume': [], 'linkedin': [], 'github': []},
        'skills': {'resume': [], 'linkedin': [], 'github': []},
        'education': {'resume': [], 'linkedin': [], 'github': []},
        'certificates': {'resume': [], 'linkedin': [], 'github': []},
        'projects': {'resume': [], 'linkedin': [], 'github': []},
        'contact': {'resume': {}, 'linkedin': {}, 'github': {}}
    }
    
    # Collect data from all sources
    collect_all_source_data(data_sources, linkedin_data, github_data, resume_data)
    
    # Apply section-wise priorities with fallback
    apply_section_priorities(portfolio, data_sources)
    
    # Add fallback values if still empty
    add_fallback_values(portfolio)
    
    return portfolio

def collect_all_source_data(data_sources, linkedin_data, github_data, resume_data):
    """Collect data from all sources into organized structure"""
    
    # Collect LinkedIn data
    if linkedin_data:
        data_sources['name']['linkedin'] = linkedin_data.get('name', '')
        data_sources['headline']['linkedin'] = linkedin_data.get('headline', '')
        data_sources['about']['linkedin'] = linkedin_data.get('about', '')
        data_sources['experience']['linkedin'] = linkedin_data.get('experience', [])
        data_sources['skills']['linkedin'] = linkedin_data.get('skills', [])
        data_sources['education']['linkedin'] = linkedin_data.get('education', [])
        data_sources['certificates']['linkedin'] = linkedin_data.get('certificates', [])
        # LinkedIn rarely has projects, but just in case
        data_sources['projects']['linkedin'] = linkedin_data.get('projects', [])
    
    # Collect GitHub data
    if github_data:
        # GitHub projects from repositories
        if github_data.get('repositories'):
            github_projects = []
            for repo in github_data['repositories']:
                project = {
                    'name': repo.get('name', ''),
                    'description': repo.get('description', ''),
                    'link': repo.get('html_url', ''),
                    'github': repo.get('html_url', ''),
                    'stars': repo.get('stargazers_count', 0),
                    'technologies': repo.get('topics', [])
                }
                github_projects.append(project)
            data_sources['projects']['github'] = github_projects
        
        # GitHub profile data
        if github_data.get('profile'):
            profile = github_data['profile']
            data_sources['name']['github'] = profile.get('name', '')
            data_sources['about']['github'] = profile.get('bio', '')
    
    # Collect Resume data
    if resume_data:
        # Basic info
        if resume_data.get('contact', {}).get('name'):
            data_sources['name']['resume'] = resume_data['contact']['name']
        
        # Contact info
        if resume_data.get('contact'):
            data_sources['contact']['resume'] = resume_data['contact']
        
        # Resume summary as both headline and about
        if resume_data.get('summary'):
            data_sources['headline']['resume'] = resume_data['summary']
            data_sources['about']['resume'] = resume_data['summary']
        
        # Experience, skills, education
        data_sources['experience']['resume'] = resume_data.get('experience', [])
        data_sources['skills']['resume'] = resume_data.get('skills', [])
        data_sources['education']['resume'] = resume_data.get('education', [])
        
        # Resume projects
        if resume_data.get('projects'):
            resume_projects = []
            for project in resume_data['projects']:
                portfolio_project = {
                    'name': project.get('name', ''),
                    'description': project.get('description', ''),
                    'link': project.get('link', ''),
                    'github': project.get('link', ''),
                    'stars': 0,
                    'technologies': project.get('technologies', [])
                }
                resume_projects.append(portfolio_project)
            data_sources['projects']['resume'] = resume_projects
        
        # Resume certifications
        if resume_data.get('certifications'):
            resume_certs = []
            for cert in resume_data['certifications']:
                portfolio_cert = {
                    'certificate': cert.get('certificate', ''),
                    'issuer': cert.get('issuer', ''),
                    'date': cert.get('date', ''),
                    'link': cert.get('link', '')
                }
                resume_certs.append(portfolio_cert)
            data_sources['certificates']['resume'] = resume_certs

def apply_section_priorities(portfolio, data_sources):
    """Apply section-wise priorities with fallback logic"""
    
    # Section-wise priority definitions
    priorities = {
        'projects': ['github', 'resume', 'linkedin'],      # GitHub > Resume > LinkedIn
        'headline': ['linkedin', 'resume', 'github'],      # LinkedIn > Resume > GitHub  
        'about': ['linkedin', 'resume', 'github'],         # LinkedIn > Resume > GitHub
        'experience': ['resume', 'linkedin', 'github'],    # Resume > LinkedIn > GitHub
        'skills': ['resume', 'linkedin', 'github'],        # Resume > LinkedIn > GitHub
        'education': ['resume', 'linkedin', 'github'],     # Resume > LinkedIn > GitHub
        'certificates': ['linkedin', 'resume', 'github'],  # LinkedIn > Resume > GitHub
        'contact': ['resume', 'linkedin', 'github'],       # Resume > LinkedIn > GitHub
        'name': ['resume', 'linkedin', 'github']           # Resume > LinkedIn > GitHub
    }
    
    # Apply priorities with fallback
    for section, priority_order in priorities.items():
        for source in priority_order:
            source_data = data_sources[section][source]
            
            # Check if source has meaningful data
            if has_meaningful_data(source_data):
                portfolio[section] = source_data
                print(f"📊 Using {source} data for {section}")
                break  # Stop at first meaningful source
        
        # If no meaningful data found, keep empty (will get fallback later)
        if not has_meaningful_data(portfolio.get(section)):
            print(f"⚠️ No meaningful data found for {section}")

def has_meaningful_data(data):
    """Check if data is meaningful (not empty, not just whitespace)"""
    if data is None:
        return False
    if isinstance(data, str):
        return bool(data.strip())
    if isinstance(data, list):
        return len(data) > 0
    if isinstance(data, dict):
        return bool(data)
    return bool(data)

def add_fallback_values(portfolio):
    """Add fallback values for empty sections"""
    if not portfolio.get('name'):
        portfolio['name'] = 'Professional User'
    if not portfolio.get('headline'):
        portfolio['headline'] = 'Experienced Professional'
    if not portfolio.get('about'):
        portfolio['about'] = 'Dedicated professional with extensive experience in their field.'
    
    # Remove duplicate skills while preserving order
    if portfolio.get('skills'):
        portfolio['skills'] = list(dict.fromkeys(portfolio['skills']))


@app.route('/enhance-headline', methods=['POST'])
def enhance_headline():
    """Enhance only the headline with AI"""
    try:
        data = request.get_json()
        portfolio_data = data.get('portfolio_data')
        
        if not portfolio_data:
            return jsonify({'error': 'Portfolio data is required'}), 400
        
        print("🤖 Enhancing headline with AI...")
        
        from ai_content_generator import AIContentGenerator
        generator = AIContentGenerator()
        new_headline = generator.generate_headline(portfolio_data)
        
        # Create a copy and update only the headline
        updated_data = portfolio_data.copy()
        updated_data['headline'] = new_headline
        
        return jsonify({
            'success': True,
            'new_headline': new_headline,
            'message': 'Headline enhanced successfully'
        })
        
    except Exception as e:
        print(f"Error enhancing headline: {str(e)}")
        return jsonify({'error': f'Failed to enhance headline: {str(e)}'}), 500

@app.route('/enhance-summary', methods=['POST'])
def enhance_summary():
    """Enhance only the about/summary with AI"""
    try:
        data = request.get_json()
        portfolio_data = data.get('portfolio_data')
        
        if not portfolio_data:
            return jsonify({'error': 'Portfolio data is required'}), 400
        
        print("🤖 Enhancing summary with AI...")
        
        from ai_content_generator import AIContentGenerator
        generator = AIContentGenerator()
        new_summary = generator.generate_summary(portfolio_data)
        
        # Create a copy and update only the summary
        updated_data = portfolio_data.copy()
        updated_data['about'] = new_summary
        
        return jsonify({
            'success': True,
            'new_summary': new_summary,
            'message': 'Summary enhanced successfully'
        })
        
    except Exception as e:
        print(f"Error enhancing summary: {str(e)}")
        return jsonify({'error': f'Failed to enhance summary: {str(e)}'}), 500

@app.route('/download-portfolio', methods=['POST'])
def download_portfolio():
    """Generate and download portfolio as zip file"""
    try:
        # Get portfolio data and template from request
        data = request.get_json()
        portfolio_data = data.get('portfolio_data')
        template_name = data.get('template', 'modern')
        
        if not portfolio_data:
            return jsonify({'error': 'Portfolio data is required'}), 400
        
        # Generate portfolio zip
        generator = PortfolioGenerator()
        zip_content = generator.generate_portfolio_zip(portfolio_data, template_name)
        
        # Create file-like object
        zip_io = io.BytesIO(zip_content)
        zip_io.seek(0)
        
        # Generate filename
        portfolio_name = portfolio_data.get('name', 'portfolio').replace(' ', '_').lower()
        filename = f"{portfolio_name}_portfolio.zip"
        
        return send_file(
            zip_io,
            mimetype='application/zip',
            as_attachment=True,
            download_name=filename
        )
        
    except Exception as e:
        print(f"Error generating portfolio download: {str(e)}")
        return jsonify({'error': f'Failed to generate portfolio: {str(e)}'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug, host='0.0.0.0', port=port)