# LeetCode Email Reminder App

A comprehensive LeetCode practice tracker with email reminders, study sheets, and progress analytics built with Next.js, TypeScript, and Redux.

## Features

### 🔐 Authentication System
- User registration and login
- JWT-based authentication
- Protected routes
- User profile management

### 📧 Email Reminder System
- Daily streak tracking
- Smart notifications at 9 PM local time
- Customizable reminder settings
- Streak statistics

### 📚 Study Sheets Management
- Pre-loaded sheets (NeetCode Blind 75, 150, Love Babbar, Striver)
- Cross-sheet synchronization
- Progress tracking
- Direct links to LeetCode problems

### ⏱️ Timer System
- Pomodoro timer (25min work / 5min break)
- Custom timers for different problem types
- Session history tracking
- Sound notifications

### 📊 Analytics & Insights
- Daily activity charts
- Problem type analysis
- Difficulty distribution
- Weekly/monthly reports

### 🎨 Modern UI/UX
- Responsive design
- Dark/light theme support
- CSS Modules for styling
- Smooth animations

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Redux Toolkit
- **Styling**: CSS Modules, Tailwind CSS
- **Database**: Prisma, SQLite
- **Authentication**: JWT, bcryptjs
- **Email**: Resend.com
- **Charts**: Chart.js, React Chart.js 2

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd leetcode-reminder
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

Edit `.env.local` and add your configuration:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
RESEND_API_KEY="your-resend-api-key"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── sheets/           # Study sheets page
│   ├── timer/            # Timer page
│   ├── analytics/        # Analytics page
│   └── settings/         # Settings page
├── components/           # Reusable components
├── store/               # Redux store and slices
├── lib/                 # Utilities and configurations
├── types/               # TypeScript type definitions
└── hooks/               # Custom React hooks
```

## Database Schema

The app uses Prisma with SQLite and includes the following models:

- **User**: User accounts and profiles
- **Problem**: LeetCode problem metadata
- **StudySheet**: Study sheet definitions
- **UserProblem**: User progress on problems
- **UserSheet**: User's sheet preferences
- **TimerSession**: Timer session history
- **StreakData**: Streak tracking data

## API Routes

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Roadmap

- [ ] LeetCode API integration
- [ ] Email reminder system
- [ ] Study sheets with problem data
- [ ] Timer functionality
- [ ] Analytics dashboard
- [ ] Mobile app
- [ ] Study groups feature
- [ ] Problem recommendations
