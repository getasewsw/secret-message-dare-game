# secret-message-dare-game
Dare game
# Secret Message Dare Game

A fun interactive web game where players complete dares by entering names of people they know.

## Features

- 40 unique dare cards
- Progress tracking
- Data persistence with Neon PostgreSQL
- Downloadable reports
- Mobile-responsive design

## Deployment

This app is designed to be deployed on Netlify with Neon DB.

### Setup Instructions

1. **Create Neon Database:**
   - Go to [neon.tech](https://neon.tech) and create a free account
   - Create a new project and database
   - Copy your database connection string

2. **Deploy to Netlify:**
   - Push this repository to GitHub
   - Connect your GitHub repo to Netlify
   - Add environment variable in Netlify: `DATABASE_URL` = your Neon DB connection string
   - Deploy!

## Local Development

To run locally, simply open `index.html` in a web browser.

## Technologies Used

- HTML, CSS, JavaScript
- Bootstrap 5
- Netlify Functions
- Neon PostgreSQL
