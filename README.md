# Emeditate - AI-Powered Meditation Assistant

Emeditate is a modern web application that combines artificial intelligence with Sahaja Yoga principles to provide personalized meditation guidance and spiritual insights.

![Emeditate App Screenshot](public/heroImage.jpg)

## Features

- 🧘‍♀️ **AI-Powered Meditation Guide**: Personalized meditation assistance using advanced AI
- 🔒 **Secure Admin Dashboard**: Protected routes and authentication system
- 💬 **Interactive Chat Interface**: Real-time conversations with AI about meditation and spirituality
- 📱 **Responsive Design**: Seamless experience across all devices
- 🎨 **Modern UI**: Beautiful interface with gradient effects and smooth animations

## Tech Stack

- **Frontend**: Next.js 13+ (App Router)
- **UI**: Tailwind CSS, Framer Motion
- **Authentication**: JWT with HTTP-Only Cookies
- **State Management**: React Hooks
- **API Integration**: Axios
- **Security**: Protected Routes, CORS, Input Validation

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend API running (separate repository)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Moksh8516/Emeditate.git
cd emeditate
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://your-backend-url
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
emeditate/
├── app/                    # Next.js 13 app directory
│   ├── admin/             # Admin dashboard routes
│   ├── chat/              # Chat interface
│   └── page.tsx           # Homepage
├── components/            # Reusable components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
├── public/              # Static assets
└── middleware.ts        # Authentication middleware
```

## Authentication

The application uses a secure authentication system with:
- Protected routes using Next.js middleware
- HTTP-Only cookies for token storage
- Automatic redirect to login for unauthorized access
- Role-based access control

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Deployment

### Deploy on Firebase

1. Install Firebase CLI globally:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init
```
Select the following options:
- Choose 'Hosting'
- Select your Firebase project or create a new one
- Use `.next` as your public directory
- Configure as a single-page app: `No`
- Set up automatic builds and deploys with GitHub: `No`

4. Build your Next.js application:
```bash
npm run build
```

5. Deploy to Firebase:
```bash
firebase deploy
```

Your application will be live at `https://your-project-id.web.app`

### Environment Setup for Firebase

1. Set up Firebase configuration in your `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

2. Update your `next.config.js` to include Firebase domain in images config:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-project-id.web.app']
  }
}

module.exports = nextConfig
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org) - The React Framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
