"""
AI Content Generator for AutoPortfolio
Generates professional headlines and summaries using Google Gemini
"""

import os
import json
import logging
from typing import Dict, Any, Optional

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AIContentGenerator:
    """Generate professional headlines and summaries using AI"""
    
    def __init__(self):
        self.gemini_enabled = self._setup_gemini()
    
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
            logger.info("✅ Gemini AI initialized for content generation")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to initialize Gemini AI: {e}")
            return False
    
    def generate_headline(self, portfolio_data: Dict[str, Any]) -> str:
        """Generate a professional headline based on portfolio data"""
        
        if not self.gemini_enabled:
            return self._generate_fallback_headline(portfolio_data)
        
        try:
            logger.info("🤖 Generating AI-powered headline...")
            
            # Extract relevant information for headline generation
            name = portfolio_data.get('name', 'Professional')
            experience = portfolio_data.get('experience', [])
            skills = portfolio_data.get('skills', [])
            education = portfolio_data.get('education', [])
            projects = portfolio_data.get('projects', [])
            
            # Create context for AI
            context = self._build_context_for_headline(name, experience, skills, education, projects)
            
            prompt = f"""
            You are a professional career coach and LinkedIn expert. Generate a compelling, professional headline for this person's portfolio.

            Context about the person:
            {context}

            Requirements for the headline:
            1. Keep it under 120 characters
            2. Make it professional and engaging
            3. Highlight their main expertise/role
            4. Include 1-2 key skills or technologies
            5. Make it suitable for LinkedIn, portfolio websites, and resumes
            6. Avoid generic terms like "Experienced Professional"
            7. Be specific about their domain/industry

            Examples of good headlines:
            - "Full-Stack Developer | React & Node.js Expert | Building Scalable Web Applications"
            - "Data Scientist | Python & Machine Learning Specialist | Turning Data into Insights"
            - "Product Manager | SaaS & Mobile Apps | Driving User Growth & Innovation"

            Generate ONE professional headline. Return only the headline text, no quotes or additional formatting.
            """
            
            logger.info("🚀 Calling Gemini API for headline generation...")
            response = self.model.generate_content(prompt)
            
            if not response or not response.text:
                logger.error("❌ Gemini API returned empty response for headline")
                return self._generate_fallback_headline(portfolio_data)
            
            headline = response.text.strip()
            logger.info(f"📝 Raw AI response: {headline}")
            
            # Clean up the response
            headline = headline.replace('"', '').replace("'", "").strip()
            
            # Validate length
            if len(headline) > 150:
                headline = headline[:147] + "..."
            
            # Validate that we got a meaningful response
            if not headline or len(headline) < 10:
                logger.error("❌ Generated headline too short or empty")
                return self._generate_fallback_headline(portfolio_data)
            
            logger.info(f"✅ Generated AI headline: {headline}")
            return headline
            
        except Exception as e:
            logger.error(f"❌ AI headline generation failed: {e}")
            return self._generate_fallback_headline(portfolio_data)
    
    def generate_summary(self, portfolio_data: Dict[str, Any]) -> str:
        """Generate a professional summary/about section based on portfolio data"""
        
        if not self.gemini_enabled:
            return self._generate_fallback_summary(portfolio_data)
        
        try:
            logger.info("🤖 Generating AI-powered summary...")
            
            # Extract relevant information
            name = portfolio_data.get('name', 'Professional')
            headline = portfolio_data.get('headline', '')
            experience = portfolio_data.get('experience', [])
            skills = portfolio_data.get('skills', [])
            education = portfolio_data.get('education', [])
            projects = portfolio_data.get('projects', [])
            certificates = portfolio_data.get('certificates', [])
            
            # Create context for AI
            context = self._build_context_for_summary(name, headline, experience, skills, education, projects, certificates)
            
            prompt = f"""
            You are a professional career coach and content writer. Write a concise professional summary for this person's portfolio.

            Context about the person:
            {context}

            Requirements for the summary:
            1. Write in first person ("I am..." or "Passionate...")
            2. Keep it to exactly 3-5 lines (50-80 words maximum)
            3. Highlight their main expertise and role
            4. Include 2-3 key skills or technologies
            5. Make it punchy and impactful
            6. Avoid clichés and generic terms
            7. Focus on their core value proposition

            Examples of good short summaries:
            - "Passionate full-stack developer with 5+ years building scalable web applications. Specialized in React, Node.js, and Python with experience leading development teams. Currently focused on creating innovative solutions in fintech and e-commerce."
            
            - "Data scientist with expertise in machine learning and Python analytics. Experienced in transforming complex datasets into actionable business insights. Passionate about leveraging AI to solve real-world problems."

            Generate ONE concise professional summary (3-5 lines only). Return only the summary text, no quotes or additional formatting.
            """
            
            logger.info("🚀 Calling Gemini API for summary generation...")
            response = self.model.generate_content(prompt)
            
            if not response or not response.text:
                logger.error("❌ Gemini API returned empty response for summary")
                return self._generate_fallback_summary(portfolio_data)
            
            summary = response.text.strip()
            logger.info(f"📝 Raw AI response length: {len(summary)} chars")
            
            # Clean up the response
            summary = summary.replace('"', '').replace("'", "").strip()
            
            # Validate that we got a meaningful response
            if not summary or len(summary) < 30:
                logger.error("❌ Generated summary too short or empty")
                return self._generate_fallback_summary(portfolio_data)
            
            # Validate length (aim for 50-80 words, 3-5 lines)
            words = summary.split()
            if len(words) > 80:
                # Truncate to approximately 3-4 sentences
                sentences = summary.split('. ')
                if len(sentences) > 4:
                    summary = '. '.join(sentences[:4]) + '.'
                else:
                    summary = ' '.join(words[:80]) + "..."
            
            logger.info(f"✅ Generated AI summary ({len(words)} words, {len(summary.split('. '))} sentences)")
            return summary
            
        except Exception as e:
            logger.error(f"❌ AI summary generation failed: {e}")
            return self._generate_fallback_summary(portfolio_data)
    
    def _build_context_for_headline(self, name, experience, skills, education, projects):
        """Build context string for headline generation"""
        context_parts = []
        
        if name:
            context_parts.append(f"Name: {name}")
        
        if experience:
            latest_job = experience[0] if experience else {}
            if latest_job.get('title'):
                context_parts.append(f"Current/Latest Role: {latest_job['title']}")
            if latest_job.get('company'):
                context_parts.append(f"Company: {latest_job['company']}")
        
        if skills:
            top_skills = skills[:8]  # Top 8 skills
            context_parts.append(f"Key Skills: {', '.join(top_skills)}")
        
        if education:
            latest_edu = education[0] if education else {}
            if latest_edu.get('degree'):
                context_parts.append(f"Education: {latest_edu['degree']}")
        
        if projects:
            context_parts.append(f"Has {len(projects)} projects")
        
        return '\n'.join(context_parts)
    
    def _build_context_for_summary(self, name, headline, experience, skills, education, projects, certificates):
        """Build context string for summary generation"""
        context_parts = []
        
        if name:
            context_parts.append(f"Name: {name}")
        
        if headline:
            context_parts.append(f"Professional Headline: {headline}")
        
        if experience:
            context_parts.append(f"Work Experience ({len(experience)} positions):")
            for i, exp in enumerate(experience[:3]):  # Top 3 experiences
                context_parts.append(f"  {i+1}. {exp.get('title', '')} at {exp.get('company', '')} ({exp.get('duration', '')})")
                if exp.get('description'):
                    context_parts.append(f"     {exp['description'][:100]}...")
        
        if skills:
            context_parts.append(f"Skills: {', '.join(skills[:15])}")  # Top 15 skills
        
        if projects:
            context_parts.append(f"Projects ({len(projects)}):")
            for i, proj in enumerate(projects[:3]):  # Top 3 projects
                context_parts.append(f"  {i+1}. {proj.get('name', '')} - {proj.get('description', '')[:50]}...")
        
        if certificates:
            cert_names = [cert.get('certificate', '') for cert in certificates[:3]]
            context_parts.append(f"Certifications: {', '.join(cert_names)}")
        
        if education:
            for edu in education[:2]:  # Top 2 education entries
                degree = edu.get('degree', '')
                field = edu.get('field', '')
                school = edu.get('school') or edu.get('institution', '')
                context_parts.append(f"Education: {degree} in {field} from {school}")
        
        return '\n'.join(context_parts)
    
    def _generate_fallback_headline(self, portfolio_data: Dict[str, Any]) -> str:
        """Generate fallback headline without AI"""
        experience = portfolio_data.get('experience', [])
        skills = portfolio_data.get('skills', [])
        
        # Try to create headline from experience and skills
        if experience and experience[0].get('title'):
            title = experience[0]['title']
            if skills:
                top_skills = skills[:2]
                return f"{title} | {' & '.join(top_skills)} Specialist"
            return f"{title} | Experienced Professional"
        
        if skills:
            if len(skills) >= 2:
                return f"{skills[0]} & {skills[1]} Developer | Building Innovative Solutions"
            return f"{skills[0]} Specialist | Passionate About Technology"
        
        return "Experienced Professional | Passionate About Innovation"
    
    def _generate_fallback_summary(self, portfolio_data: Dict[str, Any]) -> str:
        """Generate fallback summary without AI"""
        experience = portfolio_data.get('experience', [])
        skills = portfolio_data.get('skills', [])
        projects = portfolio_data.get('projects', [])
        
        summary_parts = []
        
        if experience:
            years = len(experience)
            title = experience[0].get('title', 'Professional') if experience else 'Professional'
            summary_parts.append(f"Experienced {title.lower()} with {years}+ years in the industry.")
        
        if skills:
            top_skills = skills[:3]  # Reduced from 5 to 3
            if len(top_skills) > 1:
                summary_parts.append(f"Specialized in {', '.join(top_skills[:-1])} and {top_skills[-1]}.")
            else:
                summary_parts.append(f"Specialized in {top_skills[0]}.")
        
        if projects:
            summary_parts.append(f"Delivered {len(projects)} successful projects.")
        else:
            summary_parts.append("Passionate about creating innovative solutions.")
        
        # Keep only first 3 parts to maintain 3-line limit
        return ' '.join(summary_parts[:3])


# Standalone function for easy import
def enhance_portfolio_content(portfolio_data: Dict[str, Any]) -> Dict[str, Any]:
    """Enhance portfolio data with AI-generated content"""
    try:
        generator = AIContentGenerator()
        
        # Generate headline if missing or generic
        current_headline = portfolio_data.get('headline', '').strip()
        logger.info(f"🔍 Current headline: '{current_headline}'")
        
        generic_headlines = [
            'Professional', 
            'Experienced Professional', 
            'Professional User',
            'Software Engineer',
            'Developer',
            ''
        ]
        
        if not current_headline or current_headline in generic_headlines or len(current_headline) < 20:
            logger.info("🎯 Generating new headline...")
            new_headline = generator.generate_headline(portfolio_data)
            portfolio_data['headline'] = new_headline
            logger.info(f"✨ Generated new headline: {new_headline}")
        else:
            logger.info("ℹ️ Headline looks good, keeping existing one")
        
        # Generate summary if missing or too short
        current_about = portfolio_data.get('about', '').strip()
        logger.info(f"🔍 Current about length: {len(current_about)} chars")
        
        generic_summaries = [
            'Dedicated professional with extensive experience in their field.',
            'Experienced professional',
            'Professional user',
            ''
        ]
        
        if not current_about or current_about in generic_summaries or len(current_about) < 100:
            logger.info("🎯 Generating new summary...")
            new_summary = generator.generate_summary(portfolio_data)
            portfolio_data['about'] = new_summary
            logger.info(f"✨ Generated new summary ({len(new_summary)} chars)")
        else:
            logger.info("ℹ️ Summary looks good, keeping existing one")
        
        return portfolio_data
        
    except Exception as e:
        logger.error(f"❌ Error in enhance_portfolio_content: {e}")
        # Return original data if enhancement fails
        return portfolio_data


def force_enhance_portfolio_content(portfolio_data: Dict[str, Any]) -> Dict[str, Any]:
    """Force enhance portfolio data with AI-generated content, regardless of existing quality"""
    try:
        generator = AIContentGenerator()
        
        logger.info("🚀 Force enhancing content - regenerating everything...")
        
        # Always generate new headline
        logger.info("🎯 Force generating new headline...")
        new_headline = generator.generate_headline(portfolio_data)
        portfolio_data['headline'] = new_headline
        logger.info(f"✨ Force generated new headline: {new_headline}")
        
        # Always generate new summary
        logger.info("🎯 Force generating new summary...")
        new_summary = generator.generate_summary(portfolio_data)
        portfolio_data['about'] = new_summary
        logger.info(f"✨ Force generated new summary ({len(new_summary)} chars)")
        
        return portfolio_data
        
    except Exception as e:
        logger.error(f"❌ Error in force_enhance_portfolio_content: {e}")
        # Return original data if enhancement fails
        return portfolio_data