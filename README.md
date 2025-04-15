# WealthWise - Student Financial Management App

WealthWise is an AI-powered financial management application designed for students. It simplifies budgeting, expense tracking, goal setting, and financial planning with an intuitive interface and smart features.

![WealthWise Screenshot](https://via.placeholder.com/800x400?text=WealthWise+Dashboard)

## Features

- **AI-Powered Budget Management**: Get smart recommendations based on your spending patterns
- **Expense Tracking**: Log expenses through voice, camera, or manual entry
- **Financial Goal Setting**: Set and track progress towards financial goals
- **Interactive Dashboard**: Visualize your financial status with beautiful charts and metrics
- **Smart Suggestions**: Receive personalized suggestions to save money
- **User Authentication**: Secure login and registration with Supabase

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- Framer Motion
- Supabase (Authentication & Database)
- React Router
- React Hook Form
- Zod (Form Validation)
- Recharts (Data Visualization)

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/wealthwise.git
   cd wealthwise
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Copy the environment example file and configure it
   ```bash
   cp .env.example .env.local
   ```

4. Update the `.env.local` file with your Supabase credentials
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Development

Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`.

## Deployment

### Building for Production

1. Create a production-ready build:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Preview the production build locally:
   ```bash
   npm run preview
   # or
   yarn preview
   ```

### Deploy to Production

This application can be deployed to various platforms:

- **Vercel**: Connect your GitHub repository to Vercel for automatic deployments
- **Netlify**: Connect your GitHub repository to Netlify for automatic deployments
- **Firebase Hosting**: Use the Firebase CLI to deploy
- **AWS Amplify**: Connect your repository to AWS Amplify

Make sure to set up environment variables on your hosting platform.

## Project Structure

```
wealthwise/
├── public/             # Static files
├── src/                # Application source code
│   ├── components/     # UI components
│   │   ├── auth/       # Authentication components
│   │   ├── dashboard/  # Dashboard components
│   │   ├── expense/    # Expense tracking components
│   │   ├── goals/      # Financial goals components
│   │   ├── landing/    # Landing page components
│   │   ├── ui/         # Reusable UI components
│   │   └── ...
│   ├── context/        # React context providers
│   ├── lib/            # Utility libraries
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── .env.example        # Example environment variables
├── .env.production     # Production environment variables
├── index.html          # HTML entry point
└── package.json        # Project dependencies and scripts
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Shadcn UI](https://ui.shadcn.com/) for reusable UI components
- [Lucide Icons](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Supabase](https://supabase.com/) for authentication and database
