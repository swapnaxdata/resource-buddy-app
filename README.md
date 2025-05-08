
# StudyBuddy

A platform for students to share and discover study materials.

## Features

- User authentication (sign up, login, password reset)
- Upload and share study notes/PDFs
- Browse and search study materials by subject
- Upvote useful study materials
- Admin dashboard to manage users and content

## Admin Access

Default admin credentials:
- Email: admin@studybuddy.com
- Password: Admin123!

For detailed instructions on creating or managing admin users, please see [Admin Instructions](./AdminInstructions.md).

## Key Features Fixed

1. Admin page access - Only users with role 'admin' can access the admin page
2. Upvote functionality - Users can now upvote any resource
3. Delete functionality - Users can delete their own notes, admins can delete any
4. Password reset flow - Users can request and complete password resets
5. Profile loading - Fixed issues with loading user profiles

## Technologies Used

- React
- TypeScript
- Supabase (Authentication, Database, Storage)
- Tailwind CSS
- shadcn/ui components

## Getting Started

1. Register or log in using the provided credentials
2. Browse study materials on the home page
3. Upload your own materials via the Upload page
4. Manage your uploaded content on the My Notes page
5. If you have admin access, utilize the Admin page to manage users and all content
