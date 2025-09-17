# Netlify deployment commands

# 1. Install Netlify CLI globally (if not already installed)
npm install -g netlify-cli

# 2. Login to Netlify
netlify login

# 3. Initialize your site (run this in your project root)
netlify init

# 4. Set environment variable
netlify env:set VITE_TMDB_API_KEY "3aec63790d50f3b9fc2efb4c15a8cf99"

# 5. Deploy
netlify deploy

# 6. Deploy to production
netlify deploy --prod