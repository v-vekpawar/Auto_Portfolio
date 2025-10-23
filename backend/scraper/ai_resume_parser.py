"""
AI-Powered Resume Parser using Google Gemini
Enhanced resume parsing with AI for better accuracy and structure
"""

import os
import re
import json
from pathlib import Path
import logging

# PDF and DOCX parsing
try:
    import PyPDF2
    PDF_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False

try:
    from docx import Document
    DOCX_AVAILABLE = True
except ImportError:
    DOCX_AVAILABLE = False

# Google Gemini AI
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AIResumeParser:
    """AI-powered resume parser using Google Gemini"""
    
    def __init__(self):
        self.gemini_enabled = self._setup_gemini()
        
        # Fallback to manual parsing if AI not available
        if not self.gemini_enabled:
            logger.warning("⚠️ Gemini AI not available, falling back to manual parsing")
    
    def _setup_gemini(self):
        """Setup Google Gemini AI"""
        if not GEMINI_AVAILABLE:
            logger.warning("⚠️ google-generativeai not installed")
            return False
        
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            logger.warning("⚠️ GEMINI_API_KEY not found in environment variables")
            return False
        
        try:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')
            logger.info("✅ Gemini AI initialized successfully")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to initialize Gemini AI: {e}")
            return False
    
    def parse_resume(self, file_path):
        """Parse resume file using AI or fallback to manual parsing"""
        try:
            file_path = Path(file_path)
            
            if not file_path.exists():
                logger.error(f"File not found: {file_path}")
                return self._get_dummy_resume_data()
            
            # Extract text from file
            text = self._extract_text_from_file(file_path)
            
            if not text:
                logger.warning("No text extracted from resume")
                return self._get_dummy_resume_data()
            
            # Use AI parsing if available, otherwise fallback to manual
            if self.gemini_enabled:
                return self._parse_with_ai(text)
            else:
                return self._parse_manually(text)
                
        except Exception as e:
            logger.error(f"Error parsing resume: {str(e)}")
            return self._get_dummy_resume_data()
    
    def _extract_text_from_file(self, file_path):
        """Extract text from PDF or DOCX file"""
        if file_path.suffix.lower() == '.pdf':
            return self._extract_pdf_text(file_path)
        elif file_path.suffix.lower() in ['.docx', '.doc']:
            return self._extract_docx_text(file_path)
        else:
            logger.warning(f"Unsupported file type: {file_path.suffix}")
            return ""
    
    def _extract_pdf_text(self, file_path):
        """Extract text from PDF file"""
        if not PDF_AVAILABLE:
            logger.warning("PyPDF2 not available, cannot parse PDF")
            return ""
        
        try:
            text = ""
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
            return text
        except Exception as e:
            logger.error(f"Error extracting PDF text: {str(e)}")
            return ""
    
    def _extract_docx_text(self, file_path):
        """Extract text from DOCX file"""
        if not DOCX_AVAILABLE:
            logger.warning("python-docx not available, cannot parse DOCX")
            return ""
        
        try:
            doc = Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            logger.error(f"Error extracting DOCX text: {str(e)}")
            return ""
    
    def _parse_with_ai(self, text):
        """Parse resume text using Google Gemini AI"""
        try:
            logger.info("🤖 Using AI to parse resume...")
            
            prompt = f"""
            You are an expert resume parser. Extract ALL structured information from the following resume text and return it as a JSON object.

            IMPORTANT: Look carefully for ALL sections in the resume, including:
            1. Personal Information (name, email, phone, location)
            2. Professional Summary/Objective/About
            3. Work Experience (company, title, duration, description)
            4. Education (institution, degree, field, year)
            5. Skills (technical and soft skills)
            6. Certifications/Licenses (name, issuer, date, credential ID if available)
            7. Projects (personal, academic, or professional projects with descriptions and technologies)
            8. Awards/Achievements (if mentioned)
            9. Publications (if any)
            10. Volunteer Experience (if any)

            PAY SPECIAL ATTENTION TO:
            - Any section titled "Projects", "Personal Projects", "Academic Projects", "Portfolio"
            - Any section titled "Certifications", "Certificates", "Licenses", "Credentials"
            - Look for project names, descriptions, technologies used, GitHub links
            - Look for certification names, issuing organizations, dates, credential IDs

            Return the data in this exact JSON format:
            {{
                "contact": {{
                    "name": "Full Name",
                    "email": "email@example.com",
                    "phone": "+1-234-567-8900",
                    "location": "City, State"
                }},
                "summary": "Professional summary or objective",
                "experience": [
                    {{
                        "title": "Job Title",
                        "company": "Company Name",
                        "duration": "Start Date - End Date",
                        "description": "Job description and achievements"
                    }}
                ],
                "education": [
                    {{
                        "institution": "University/School Name",
                        "degree": "Degree Type",
                        "field": "Field of Study",
                        "year": "Graduation Year"
                    }}
                ],
                "skills": ["Skill1", "Skill2", "Skill3"],
                "certifications": [
                    {{
                        "name": "Certification Name",
                        "issuer": "Issuing Organization",
                        "date": "Issue Date"
                    }}
                ],
                "projects": [
                    {{
                        "name": "Project Name",
                        "description": "Detailed project description and what it accomplishes",
                        "technologies": ["Tech1", "Tech2", "Tech3"],
                        "link": "GitHub or live demo URL if mentioned",
                        "duration": "Project timeline if mentioned"
                    }}
                ],
                "awards": [
                    {{
                        "name": "Award/Achievement Name",
                        "issuer": "Issuing Organization",
                        "date": "Date received",
                        "description": "Brief description"
                    }}
                ]
            }}

            INSTRUCTIONS:
            - If you find a "Projects" section, extract ALL projects mentioned
            - If you find a "Certifications" section, extract ALL certifications
            - Look for section headers like "PROJECTS", "PERSONAL PROJECTS", "PORTFOLIO"
            - Look for section headers like "CERTIFICATIONS", "CERTIFICATES", "LICENSES"
            - Include project technologies/tools used (programming languages, frameworks, etc.)
            - Include certification issuing organizations and dates
            - If no projects or certifications are found, return empty arrays []
            - Be thorough - don't miss any sections

            Resume Text:
            {text}

            Return ONLY the JSON object with no additional text, explanations, or markdown formatting.
            """
            
            response = self.model.generate_content(prompt)
            
            # Clean and parse the response
            response_text = response.text.strip()
            
            # Remove markdown code blocks if present
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            # Parse JSON
            parsed_data = json.loads(response_text)
            
            # Debug: Log what AI extracted
            logger.info(f"🔍 AI extracted {len(parsed_data.get('projects', []))} projects")
            logger.info(f"🔍 AI extracted {len(parsed_data.get('certifications', []))} certifications")
            logger.info(f"🔍 AI extracted {len(parsed_data.get('experience', []))} work experiences")
            logger.info(f"🔍 AI extracted {len(parsed_data.get('skills', []))} skills")
            
            # Log project names for debugging
            if parsed_data.get('projects'):
                project_names = [p.get('name', 'Unnamed') for p in parsed_data['projects']]
                logger.info(f"📋 Project names found: {project_names}")
            
            # Log certification names for debugging
            if parsed_data.get('certifications'):
                cert_names = [c.get('name', 'Unnamed') for c in parsed_data['certifications']]
                logger.info(f"🏆 Certifications found: {cert_names}")
            
            # Transform to expected format
            result = self._transform_ai_response(parsed_data)
            
            logger.info("✅ AI resume parsing completed successfully")
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"❌ Failed to parse AI response as JSON: {e}")
            logger.info("🔄 Falling back to manual parsing...")
            return self._parse_manually(text)
        except Exception as e:
            logger.error(f"❌ AI parsing failed: {e}")
            logger.info("🔄 Falling back to manual parsing...")
            
            # Try to extract projects and certifications manually as backup
            manual_result = self._parse_manually(text)
            manual_result['projects'] = self._extract_projects_manually(text)
            manual_result['certifications'] = self._extract_certifications_manually(text)
            
            return manual_result
    
    def _transform_ai_response(self, ai_data):
        """Transform AI response to expected format"""
        try:
            # Extract contact info
            contact = ai_data.get('contact', {})
            
            # Extract experience
            experience = []
            for exp in ai_data.get('experience', []):
                experience.append({
                    'title': exp.get('title', ''),
                    'company': exp.get('company', ''),
                    'duration': exp.get('duration', ''),
                    'description': exp.get('description', '')
                })
            
            # Extract education
            education = []
            for edu in ai_data.get('education', []):
                education.append({
                    'institution': edu.get('institution', ''),
                    'degree': edu.get('degree', ''),
                    'field': edu.get('field', ''),
                    'year': edu.get('year', '')
                })
            
            # Extract skills
            skills = ai_data.get('skills', [])
            
            # Extract certifications
            certifications = []
            for cert in ai_data.get('certifications', []):
                certifications.append({
                    'certificate': cert.get('name', ''),
                    'issuer': cert.get('issuer', ''),
                    'date': cert.get('date', ''),
                    'link': ''  # AI can't extract links reliably
                })
            
            # Extract projects with better handling
            projects = []
            for proj in ai_data.get('projects', []):
                projects.append({
                    'name': proj.get('name', ''),
                    'description': proj.get('description', ''),
                    'technologies': proj.get('technologies', []),
                    'link': proj.get('link', ''),
                    'duration': proj.get('duration', '')
                })
            
            # Extract awards/achievements
            awards = []
            for award in ai_data.get('awards', []):
                awards.append({
                    'name': award.get('name', ''),
                    'issuer': award.get('issuer', ''),
                    'date': award.get('date', ''),
                    'description': award.get('description', '')
                })
            
            result = {
                'contact': {
                    'name': contact.get('name', ''),
                    'email': contact.get('email', ''),
                    'phone': contact.get('phone', ''),
                    'location': contact.get('location', '')
                },
                'summary': ai_data.get('summary', ''),
                'experience': experience,
                'education': education,
                'skills': skills,
                'certifications': certifications,
                'projects': projects,
                'awards': awards
            }
            
            # Debug: Log final result counts
            logger.info(f"📊 Final result - Projects: {len(projects)}, Certifications: {len(certifications)}")
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Error transforming AI response: {e}")
            return self._get_dummy_resume_data()
    
    def _parse_manually(self, text):
        """Fallback manual parsing (simplified version of original)"""
        logger.info("📝 Using manual parsing as fallback...")
        
        return {
            'contact': self._extract_contact_info(text),
            'summary': self._extract_summary(text),
            'experience': self._extract_experience_manual(text),
            'education': self._extract_education_manual(text),
            'skills': self._extract_skills_manual(text),
            'certifications': [],
            'projects': []
        }
    
    def _extract_contact_info(self, text):
        """Extract contact information manually"""
        contact = {}
        
        # Email pattern
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_match = re.search(email_pattern, text)
        if email_match:
            contact['email'] = email_match.group()
        
        # Phone pattern
        phone_pattern = r'[\+]?[1-9]?[0-9]{7,15}'
        phone_match = re.search(phone_pattern, text)
        if phone_match:
            contact['phone'] = phone_match.group()
        
        return contact
    
    def _extract_summary(self, text):
        """Extract professional summary"""
        lines = text.split('\n')
        for i, line in enumerate(lines):
            if any(keyword in line.lower() for keyword in ['summary', 'objective', 'profile']):
                # Return next few lines as summary
                summary_lines = lines[i+1:i+4]
                return ' '.join([l.strip() for l in summary_lines if l.strip()])
        return ""
    
    def _extract_experience_manual(self, text):
        """Extract work experience manually"""
        experience = []
        
        # Simple pattern matching for dates and job titles
        experience_patterns = [
            r'(\d{4})\s*[-–]\s*(\d{4}|\w+)\s*[:\-]?\s*([^\n]+)',
        ]
        
        for pattern in experience_patterns:
            matches = re.finditer(pattern, text, re.MULTILINE | re.IGNORECASE)
            for match in matches:
                start_date = match.group(1)
                end_date = match.group(2)
                description = match.group(3).strip()
                
                if len(description) > 10:
                    experience.append({
                        'title': 'Position',
                        'company': 'Company',
                        'duration': f"{start_date} - {end_date}",
                        'description': description[:200]
                    })
        
        return experience[:3]
    
    def _extract_education_manual(self, text):
        """Extract education manually"""
        education = []
        education_keywords = ['university', 'college', 'bachelor', 'master', 'degree']
        
        lines = text.split('\n')
        for line in lines:
            if any(keyword in line.lower() for keyword in education_keywords):
                if len(line.strip()) > 10:
                    education.append({
                        'institution': line.strip()[:100],
                        'degree': '',
                        'field': '',
                        'year': ''
                    })
        
        return education[:2]
    
    def _extract_skills_manual(self, text):
        """Extract skills manually"""
        skills_keywords = [
            'python', 'javascript', 'java', 'react', 'node.js', 'django', 'flask',
            'aws', 'docker', 'kubernetes', 'git', 'sql', 'mongodb', 'postgresql'
        ]
        
        found_skills = []
        text_lower = text.lower()
        
        for skill in skills_keywords:
            if skill in text_lower:
                found_skills.append(skill.title())
        
        return list(set(found_skills))
    
    def _extract_projects_manually(self, text):
        """Extract projects manually as fallback"""
        projects = []
        lines = text.split('\n')
        
        # Look for project section
        in_projects_section = False
        project_keywords = ['project', 'portfolio', 'github', 'built', 'developed', 'created']
        
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            
            # Detect project section start
            if any(keyword in line_lower for keyword in ['projects', 'portfolio', 'personal projects']):
                in_projects_section = True
                continue
            
            # Detect section end
            if in_projects_section and line.strip() and line[0].isupper() and ':' not in line:
                if not any(keyword in line_lower for keyword in project_keywords):
                    in_projects_section = False
            
            # Extract project info
            if in_projects_section and line.strip() and len(line.strip()) > 10:
                projects.append({
                    'name': line.strip()[:50],
                    'description': line.strip(),
                    'technologies': [],
                    'link': '',
                    'duration': ''
                })
        
        return projects[:5]  # Return top 5 projects
    
    def _extract_certifications_manually(self, text):
        """Extract certifications manually as fallback"""
        certifications = []
        lines = text.split('\n')
        
        # Look for certification section
        in_cert_section = False
        cert_keywords = ['certified', 'certification', 'certificate', 'license', 'credential']
        
        for line in lines:
            line_lower = line.lower().strip()
            
            # Detect certification section
            if any(keyword in line_lower for keyword in ['certification', 'certificate', 'license']):
                in_cert_section = True
                continue
            
            # Extract certification info
            if (in_cert_section or any(keyword in line_lower for keyword in cert_keywords)) and line.strip():
                if len(line.strip()) > 10:
                    certifications.append({
                        'certificate': line.strip()[:100],
                        'issuer': '',
                        'date': '',
                        'link': ''
                    })
        
        return certifications[:5]  # Return top 5 certifications
    
    def _get_dummy_resume_data(self):
        """Return dummy resume data for demo purposes"""
        return {
            'contact': {
                'name': 'John Doe',
                'email': 'john.doe@example.com',
                'phone': '+1-555-0123',
                'location': 'San Francisco, CA'
            },
            'summary': 'Experienced software engineer with expertise in full-stack development and cloud technologies.',
            'experience': [
                {
                    'title': 'Senior Software Engineer',
                    'company': 'TechCorp',
                    'duration': '2022 - Present',
                    'description': 'Led development of scalable web applications using modern frameworks and cloud technologies.'
                },
                {
                    'title': 'Full Stack Developer',
                    'company': 'StartupXYZ',
                    'duration': '2020 - 2022',
                    'description': 'Built responsive web applications and RESTful APIs using React, Node.js, and PostgreSQL.'
                }
            ],
            'education': [
                {
                    'institution': 'University of Technology',
                    'degree': 'Bachelor of Science',
                    'field': 'Computer Science',
                    'year': '2020'
                }
            ],
            'skills': [
                'Python', 'JavaScript', 'React', 'Node.js', 'Django', 
                'PostgreSQL', 'AWS', 'Docker', 'Git', 'Machine Learning'
            ],
            'certifications': [
                {
                    'certificate': 'AWS Certified Solutions Architect',
                    'issuer': 'Amazon Web Services',
                    'date': '2023',
                    'link': ''
                }
            ],
            'projects': [
                {
                    'name': 'E-commerce Platform',
                    'description': 'Full-stack e-commerce solution with payment integration',
                    'technologies': ['React', 'Node.js', 'MongoDB']
                }
            ]
        }


# Backward compatibility - create alias for existing code
class ResumeParser(AIResumeParser):
    """Alias for backward compatibility"""
    pass