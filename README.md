
# StudyBuddy Application

StudyBuddy is a comprehensive platform for students to share and discover study materials. This application allows users to upload, browse, and download study notes, while also featuring user authentication, admin capabilities, and resource management.

## Features

- **User Authentication**: Sign up, login, forgot password flow
- **Study Notes Management**: Upload, view, upvote, and download study notes
- **Admin Dashboard**: Manage users and resources
- **Search & Filter**: Find notes by subject or keyword
- **User Profiles**: View and manage your uploaded content
- **PDF Handling**: Preview and download PDF study materials
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Default Admin User

The application is initialized with a default admin user:
- Email: admin@studybuddy.com
- Password: Admin123!

### User Routes

- **/** - Home page displaying all notes
- **/login** - User authentication page
- **/register** - User registration page (accessible via the login page)
- **/confirm** - Email confirmation page
- **/reset-password** - Password reset page
- **/admin** - Admin dashboard (admin users only)
- **/upload** - Page to upload new notes (authenticated users only)
- **/my-notes** - Page displaying user's uploaded notes (authenticated users only)
- **/note/:id** - Detail page for individual notes

## User Roles

- **User**: Can upload, view, download, and upvote notes. Can manage their own content.
- **Admin**: Has full access to the system, including managing users and all content.

## Technical Details

### Technology Stack

- Frontend: React, TypeScript, Tailwind CSS, shadcn/ui
- Backend: Supabase (authentication, database, storage)
- Hosting: [Your hosting provider]

### Authentication Flow

1. **Sign Up**: Users register with email and password
2. **Email Confirmation**: Users receive a confirmation email
3. **Password Reset**: Users can reset their password via email
4. **Role-Based Access**: Different permissions for regular users and admin users

### Development Setup

To run this project locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. The application will be available at: `http://localhost:5173`

For more detailed instructions, see the `AdminInstructions.md` file for admin-specific functionality.

## Database Structure

- **profiles**: User profile information and roles
- **resources**: Study notes and materials
- **storage**: PDF files and attachments

## Troubleshooting

- **Admin Access Issues**: See `AdminInstructions.md`
- **Upload Problems**: Ensure file is a valid PDF under 10MB
- **Email Confirmation**: Check spam folder for confirmation emails
