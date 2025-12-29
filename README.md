# Mini User Management System

This is a full-stack user management system featuring a Node.js/Express backend and a React frontend. It includes JWT-based authentication, role-based access control (admin/user), and a complete suite of user and admin functionalities. This project was completed as part of the PurpleMerit Backend Intern Assessment, with the frontend being a deliberate extension to demonstrate full-stack capabilities.

## Tech Stack

**Backend:**

- **Node.js** with **Express.js**
- **PostgreSQL** for the database
- **JWT (JSON Web Tokens)** for authentication
- **bcrypt** for password hashing
- **Jest** & **Supertest** for unit testing

**Frontend:**

- **React** (with Vite)
- **React Router** for client-side routing
- **React Context API** for global state management
- **Axios** for API requests
- **react-hot-toast** for UI notifications
- **CSS Modules** for styling

## Live URLs

- **Backend API:** `https://mini-user-management-backend.onrender.com`
- **API Health Check:** `https://mini-user-management-backend.onrender.com/health`
- **Frontend Application:** `https://mini-user-management-system-purplem.vercel.app/`

## Features

- Secure user signup and login.
- Role-based access control: `admin` and `user` roles.
- **User Dashboard:** View profile information.
- **Profile Page:** Update personal details and change password.
- **Admin Dashboard:**
  - View a paginated list of all users.
  - Activate or deactivate user accounts.
  - Protected to ensure only admins have access.
- Protected routes for both users and admins.
- Professional UI with loading states, toasts, and confirmation modals.

## Project Setup

### Prerequisites

- Node.js (v18 or higher)
- npm
- A running PostgreSQL instance

### Backend Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/kushwith03/mini-user-management-system-purplemerit.git
    cd mini-user-management-system-purplemerit/backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory by copying the example file:

    ```bash
    cp .env.example .env
    ```

    Fill in the required variables, especially `DATABASE_URL` and `JWT_SECRET`.

4.  **Run database migrations:**
    The backend does not use an ORM. The SQL migration file is located at `backend/migrations/001_create_users_table.sql`. You must run this against your database manually or via a script. For the deployed version on Render, this is handled automatically by a pre-deploy command.

5.  **Start the server:**
    ```bash
    npm start
    ```

### Frontend Setup

1.  **Navigate to the frontend directory:**

    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

## API Documentation

The complete API contract is defined in the Postman collection located at:
`backend/docs/postman_collection.json`

You can import this file into Postman to test all available endpoints.
