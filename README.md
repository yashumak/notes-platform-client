NotesHub – Frontend

NotesHub is an online notes-sharing platform that helps students upload, browse, search, and download academic resources. The frontend is built using Next.js and React, providing a clean, responsive, and user-friendly interface for accessing educational materials.

Features

- User Authentication: Login, registration, and forgot-password interfaces.
- User Dashboard: Access and manage personal academic resources.
- Upload Notes: Upload educational documents through an easy-to-use interface.
- Browse Notes: Explore notes, assignments, question papers, question banks, PPTs, and research papers.
- Search Functionality: Search for academic resources using keywords.
- Advanced Filtering: Filter resources by university, course, branch, study type, and academic year.
- User Profile: View and manage user profile information.
- Responsive UI: Optimized layouts for desktops, laptops, tablets, and mobile devices.
- API Integration: Communicate with the backend through REST APIs.
- Cloud File Access: Access academic documents stored in cloud object storage.

Technology Stack

- Framework: Next.js
- Library: React.js
- Language: TypeScript
- Styling: Tailwind CSS
- Markup: HTML5
- API Communication: Fetch API / REST APIs
- Routing: Next.js App Router
- Deployment: Vercel
- Version Control: Git and GitHub

Project Structure

```text
frontend/
│
├── app/
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   ├── dashboard/
│   ├── notes/
│   ├── upload/
│   ├── profile/
│   ├── components/
│   ├── globals.css
│   └── page.tsx
│
├── components/
├── hooks/
├── lib/
├── public/
├── types/
│
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

Getting Started

Follow these steps to run the frontend application locally.

Prerequisites

Make sure you have installed:

- Node.js (LTS version recommended)
- npm
- Git
- A running backend API or deployed backend URL

1. Clone the Repository

2. Navigate to the Project Directory

cd notes-platform-frontend

3. Install Dependencies

npm install

4. Configure Environment Variables

Create a ".env.local" file in the frontend root directory.

NEXT_PUBLIC_API_URL=http://localhost:5000

For production, replace the local URL with your deployed backend API URL.

5. Start the Development Server

npm run dev

Open your browser and visit:

http://localhost:3000

The application will automatically reload when you make changes to the source files.

Available Scripts

Command| Description
"npm run dev"| Starts the development server
"npm run build"| Creates a production build
"npm run start"| Starts the production server
"npm run lint"| Runs the configured linting checks, if available

Backend Integration

The frontend communicates with the NotesHub backend using REST APIs.

Backend Repository: https://github.com/yashumak/notes-platform-server

The backend is responsible for:

- User registration and authentication.
- User profile management.
- Notes upload and management.
- Notes metadata and database operations.
- File storage integration.
- Secure API access.

Deployment

The frontend application is deployed using Vercel.

Deploy using Vercel

1. Push your frontend code to GitHub.
2. Open https://vercel.com/.
3. Import your frontend GitHub repository.
4. Configure the environment variable "NEXT_PUBLIC_API_URL".
5. Deploy the application.

After deployment, verify that the frontend communicates correctly with the production backend.

Security

- Never expose backend secrets in frontend environment variables.
- Use "NEXT_PUBLIC_" only for values that are safe to expose publicly.
- Protect authenticated pages and API requests.
- Validate user inputs.
- Handle authentication failures and expired sessions.
- Use HTTPS in production.
- Do not commit ".env.local" files to GitHub.

Future Enhancements

- AI-powered notes search.
- Advanced filtering and sorting.
- Personalized study material recommendations.
- Bookmark and save notes.
- Notes rating and review functionality.
- Improved loading performance and caching.
- Enhanced mobile user experience.

Author

Yash Umak

- GitHub: https://github.com/yashumak
- Portfolio: https://yashumak.me
- LinkedIn: https://linkedin.com/in/yashumak

License

This project is developed for educational and academic resource-sharing purposes. Add an appropriate open-source license if you intend to distribute the source code publicly.
