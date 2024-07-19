# Jobify - Your Ultimate Job Finder


-   Frontend repo is here: https://github.com/Anmol-SlayerOP/Jobify
-   Try the app here: 

## Summary for Backend

This project is a backend API built with JavaScript. It offers functionality for user authentication, job search, and job management. The API includes secure password storage, JWT-based authentication, email functionalities, and integrates with an external job search API. It also temporarily stores job data for future use.

(https://i.ibb.co/FBG6gVz/Jobify-Logo.png)

## Installation and Setup

1. Clone the repository.
2. Install dependencies:
```bash
 - npm install
```
3. Run the server
```bash
- npm run dev
```



### Database Connection

1. Setup .env in the root
2. Add MONGO_URI with correct value



## Features

- **User Authentication**: 
  - Passwords are hashed using bcrypt.
  - JWTs are used for secure authentication.
- **Email Functionality**: 
  - Sends email links for email confirmation.
  - Sends password reset links.
- **Job Search API Integration**: 
  - Searches job data using an external API.
  - Temporarily stores job data in a local `Job` model.
- **Job Models**: 
  - `Job`: Stores all job data from the external API.
  - `UserJob`: Stores jobs saved or created by users.
  - `FeaturedJob`: References user-created jobs.
- **User Model**: 
  - Connects to the `UserJob` model.
  - Stores arrays of IDs for important jobs, saved jobs, and created jobs.
- **Gemini AI Resume Generation**: 
  - Utilizes Gemini AI to generate resumes as HTML.

## More Security Measures

- **helmet**: Secures the app by setting various HTTP headers.
- **cors**: Ensures API accessibility from different domains.
- **xss-clean**: Sanitizes user input to protect against cross-site scripting attacks.
- **express-rate-limit**: Limits API hits to 7 per 10 minutes per user for Job Search API endpoint.

## Some Restrictions
I have Scripts for Job Data Scraping to seed my database But, free hosting services like Vercel do not support always-on servers, so these scripts are not present in this repo.




If you'd like to talk, you can contact me here: https://www.linkedin.com/in/anmol-nag-965151197/

**Note**: Ensure you have your database and environment variables properly configured before running the application.
