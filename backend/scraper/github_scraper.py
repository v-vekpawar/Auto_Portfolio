import requests
import os
from urllib.parse import urlparse

class GitHubScraper:
    def __init__(self):
        self.github_token = os.getenv('GITHUB_TOKEN')  # Optional: for higher rate limits
        self.base_url = 'https://api.github.com'
        
    def scrape_profile(self, github_url):
        """Scrape GitHub profile and repositories"""
        try:
            # Extract username from URL
            username = self._extract_username(github_url)
            if not username:
                return self._get_dummy_github_data()
            
            # Get user profile
            user_data = self._get_user_profile(username)
            
            # Get repositories
            repos_data = self._get_repositories(username)
            
            return {
                'profile': user_data,
                'repositories': repos_data
            }
            
        except Exception as e:
            print(f"Error scraping GitHub: {str(e)}")
            return self._get_dummy_github_data()
    
    def _extract_username(self, github_url):
        """Extract username from GitHub URL"""
        try:
            parsed = urlparse(github_url)
            path_parts = parsed.path.strip('/').split('/')
            if path_parts and path_parts[0]:
                return path_parts[0]
        except:
            pass
        return None
    
    def _get_user_profile(self, username):
        """Get GitHub user profile data"""
        try:
            headers = {}
            if self.github_token:
                headers['Authorization'] = f'token {self.github_token}'
            
            response = requests.get(
                f'{self.base_url}/users/{username}',
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"GitHub API error: {response.status_code}")
                return {}
                
        except Exception as e:
            print(f"Error fetching GitHub profile: {str(e)}")
            return {}
    
    def _get_repositories(self, username):
        """Get user's public repositories"""
        try:
            headers = {}
            if self.github_token:
                headers['Authorization'] = f'token {self.github_token}'
            
            # Get repositories, sorted by stars and updated date
            response = requests.get(
                f'{self.base_url}/users/{username}/repos',
                headers=headers,
                params={
                    'sort': 'updated',
                    'direction': 'desc',
                    'per_page': 10  # Limit to top 10 repos
                },
                timeout=10
            )
            
            if response.status_code == 200:
                repos = response.json()
                
                # Filter and enhance repository data
                filtered_repos = []
                for repo in repos:
                    # Skip forks unless they have significant stars
                    if repo.get('fork') and repo.get('stargazers_count', 0) < 5:
                        continue
                    
                    # Skip repos without description
                    if not repo.get('description'):
                        continue
                    
                    filtered_repos.append({
                        'name': repo.get('name', ''),
                        'description': repo.get('description', ''),
                        'html_url': repo.get('html_url', ''),
                        'stargazers_count': repo.get('stargazers_count', 0),
                        'language': repo.get('language', ''),
                        'topics': repo.get('topics', []),
                        'updated_at': repo.get('updated_at', ''),
                        'created_at': repo.get('created_at', '')
                    })
                
                # Sort by stars and return top repositories
                filtered_repos.sort(key=lambda x: x['stargazers_count'], reverse=True)
                return filtered_repos[:8]  # Return top 8 repositories
            else:
                print(f"GitHub repos API error: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"Error fetching GitHub repositories: {str(e)}")
            return []
    
    def _get_dummy_github_data(self):
        """Return dummy GitHub data for demo purposes"""
        return {
            'profile': {
                'login': 'johndoe',
                'name': 'John Doe',
                'bio': 'Full-stack developer passionate about open source',
                'public_repos': 25,
                'followers': 150,
                'following': 80
            },
            'repositories': [
                {
                    'name': 'awesome-web-app',
                    'description': 'A modern web application built with React and Node.js',
                    'html_url': 'https://github.com/johndoe/awesome-web-app',
                    'stargazers_count': 45,
                    'language': 'JavaScript',
                    'topics': ['react', 'nodejs', 'mongodb', 'express'],
                    'updated_at': '2024-01-15T10:30:00Z',
                    'created_at': '2023-06-01T08:00:00Z'
                },
                {
                    'name': 'python-data-analyzer',
                    'description': 'Data analysis tool with machine learning capabilities',
                    'html_url': 'https://github.com/johndoe/python-data-analyzer',
                    'stargazers_count': 32,
                    'language': 'Python',
                    'topics': ['python', 'data-science', 'machine-learning', 'pandas'],
                    'updated_at': '2024-01-10T14:20:00Z',
                    'created_at': '2023-08-15T12:00:00Z'
                },
                {
                    'name': 'mobile-task-manager',
                    'description': 'Cross-platform mobile app for task management',
                    'html_url': 'https://github.com/johndoe/mobile-task-manager',
                    'stargazers_count': 28,
                    'language': 'TypeScript',
                    'topics': ['react-native', 'typescript', 'mobile', 'productivity'],
                    'updated_at': '2024-01-05T16:45:00Z',
                    'created_at': '2023-09-20T09:30:00Z'
                },
                {
                    'name': 'api-gateway-service',
                    'description': 'Microservices API gateway with authentication and rate limiting',
                    'html_url': 'https://github.com/johndoe/api-gateway-service',
                    'stargazers_count': 19,
                    'language': 'Go',
                    'topics': ['golang', 'microservices', 'api-gateway', 'docker'],
                    'updated_at': '2023-12-28T11:15:00Z',
                    'created_at': '2023-10-05T13:20:00Z'
                }
            ]
        }