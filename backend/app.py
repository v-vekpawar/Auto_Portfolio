from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import json
import io
from scraper.linkedin_scraper import LinkedInScraper, scrape_linkedin_profile
from scraper.github_scraper import GitHubScraper
from scraper.resume_parser import ResumeParser
from portfolio_generator import PortfolioGenerator
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
        
        # Scrape LinkedIn data if URL provided
        if linkedin_url:
            print(f"Scraping LinkedIn: {linkedin_url} (headless: {headless_mode})")
            try:
                linkedin_data = scrape_linkedin_profile(linkedin_url, headless=headless_mode)
                if not linkedin_data or linkedin_data.get('name') == 'John Doe':
                    print("LinkedIn scraping returned dummy data, using empty fallback")
                    linkedin_data = {
                        'name': '',
                        'headline': '',
                        'about': '',
                        'experience': [],
                        'skills': [],
                        'education': [],
                        'certificates': []
                    }
            except Exception as e:
                print(f"LinkedIn scraping failed: {e}")
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
            print("No LinkedIn URL provided, skipping LinkedIn scraping")
            linkedin_data = {
                'name': '',
                'headline': '',
                'about': '',
                'experience': [],
                'skills': [],
                'education': [],
                'certificates': []
            }
        
        # Scrape GitHub data if URL provided
        if github_url:
            print(f"Scraping GitHub: {github_url}")
            try:
                github_data = github_scraper.scrape_profile(github_url)
            except Exception as e:
                print(f"GitHub scraping failed: {e}")
                github_data = {}
        else:
            print("No GitHub URL provided, skipping GitHub scraping")
            github_data = {}
        
        # Parse resume if provided
        resume_data = {}
        if resume_file:
            print("Parsing resume...")
            # Save uploaded file temporarily
            filename = resume_file.filename
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            resume_file.save(filepath)
            
            # Parse resume
            resume_data = resume_parser.parse_resume(filepath)
            
            # Clean up uploaded file
            os.remove(filepath)
        
        # Combine all data
        portfolio_data = combine_profile_data(linkedin_data, github_data, resume_data)
        
        return jsonify(portfolio_data)
        
    except Exception as e:
        print(f"Error in scrape_profile: {str(e)}")
        return jsonify({'error': f'Failed to scrape profile: {str(e)}'}), 500

def combine_profile_data(linkedin_data, github_data, resume_data):
    """Combine data from different sources with priority: Resume > LinkedIn > GitHub"""
    
    # Initialize portfolio with empty data
    portfolio = {
        'name': '',
        'headline': '',
        'about': '',
        'experience': [],
        'skills': [],
        'education': [],
        'certificates': [],
        'projects': []
    }
    
    # Priority 3: GitHub data (lowest priority)
    if github_data:
        # Add GitHub projects
        if github_data.get('repositories'):
            for repo in github_data['repositories']:
                project = {
                    'name': repo.get('name', ''),
                    'description': repo.get('description', ''),
                    'link': repo.get('html_url', ''),
                    'github': repo.get('html_url', ''),
                    'stars': repo.get('stargazers_count', 0),
                    'technologies': repo.get('topics', [])
                }
                portfolio['projects'].append(project)
        
        # Use GitHub profile data if available
        if github_data.get('profile'):
            profile = github_data['profile']
            if not portfolio['name'] and profile.get('name'):
                portfolio['name'] = profile['name']
            if not portfolio['about'] and profile.get('bio'):
                portfolio['about'] = profile['bio']
    
    # Priority 2: LinkedIn data (medium priority) - overwrites GitHub data
    if linkedin_data:
        if linkedin_data.get('name'):
            portfolio['name'] = linkedin_data['name']
        if linkedin_data.get('headline'):
            portfolio['headline'] = linkedin_data['headline']
        if linkedin_data.get('about'):
            portfolio['about'] = linkedin_data['about']
        if linkedin_data.get('experience'):
            portfolio['experience'] = linkedin_data['experience']
        if linkedin_data.get('skills'):
            portfolio['skills'] = linkedin_data['skills']
        if linkedin_data.get('education'):
            portfolio['education'] = linkedin_data['education']
        if linkedin_data.get('certificates'):
            portfolio['certificates'] = linkedin_data['certificates']
    
    # Priority 1: Resume data (highest priority) - overwrites everything
    if resume_data:
        # Override basic info if available in resume
        if resume_data.get('contact', {}).get('name'):
            portfolio['name'] = resume_data['contact']['name']
        
        # Override experience with resume data (highest priority)
        if resume_data.get('experience'):
            portfolio['experience'] = resume_data['experience']
        
        # Override skills with resume data if more comprehensive
        if resume_data.get('skills'):
            portfolio['skills'] = resume_data['skills']
        
        # Override education with resume data
        if resume_data.get('education'):
            portfolio['education'] = resume_data['education']
        
        # Add contact information from resume
        if resume_data.get('contact'):
            portfolio['contact'] = resume_data['contact']
    
    # Fallback values if still empty
    if not portfolio['name']:
        portfolio['name'] = 'Professional User'
    if not portfolio['headline']:
        portfolio['headline'] = 'Experienced Professional'
    if not portfolio['about']:
        portfolio['about'] = 'Dedicated professional with extensive experience in their field.'
    
    # Remove duplicates and clean data
    portfolio['skills'] = list(dict.fromkeys(portfolio['skills']))  # Remove duplicate skills while preserving order
    
    return portfolio

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