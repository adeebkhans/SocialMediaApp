# SocialMediaApp (Instagram Like)

A social media platform with real-time messaging and notifications. This app provides an interactive and dynamic user experience, allowing users to connect, communicate, and share content seamlessly.

## Features

- **Real-Time Messaging**: Chat with other users instantly using Socket.IO (Js lib for webSockets).
- **Notifications**: Get notified about activities and messages.
- **User Authentication**: Secure login and registration with JWT.
- **File Uploads**: Upload images securely via Cloudinary.
- **Responsive UI**: Tailwind CSS for styling and responsive design.

## Tech Stack

### Frontend
- **React**: Library for building user interfaces.
- **React Router**: For client-side routing.
- **Redux Toolkit**: State management.
- **Socket.IO Client**: For real-time communication.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **ShadCN**: For UI components
- **Vite**: Fast frontend tooling for development.

### Backend
- **Node.js**: JavaScript runtime.
- **Express**: Backend framework.
- **Socket.IO**: Real-time, bidirectional communication.
- **MongoDB (Mongoose)**: Database for storing user data.
- **JWT**: Secure authentication.
- **Multer & Cloudinary**: Image uploads and processing.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/adeebkhans/SocialMediaApp.git
   cd SocialMediaApp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   npm install --prefix frontend
   ```

3. **Environment Variables**:
   - Create a `.env` file in the root directory with:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     CLOUDINARY_URL=your_cloudinary_url
     ```

4. **Run the application**:
   - **Frontend**: `npm run dev --prefix frontend`
   - **Backend**: `npm run dev`

## Build

To build the frontend for production:
```bash
npm run build --prefix frontend
```

Feel free to modify or add any additional details!
