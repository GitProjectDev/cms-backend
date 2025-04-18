# Project Name: **CMS**

A fully functional backend CMS built with **Node.js**, **Express.js**, **MongoDB**, and **EJS** for efficient content management. It supports features like user authentication, content management (blogs, videos, articles, galleries), password reset functionality, and secure session handling.

---

## Features

- User authentication (login, registration, password reset).
- Secure session management with MongoDB as the session store.
- Flash messages for user notifications.
- Structured routes for managing blogs, videos, articles, and galleries.
- Password reset functionality with email-based OTP verification.
- **Public API Endpoints** for external access to published content.
- **Email/Mail Setup** for sending OTPs and notifications via Gmail SMTP.

---

## Table of Contents

- [Installation Instructions](#installation-instructions)
- [Environment Variables](#environment-variables)
- [Mail Setup](#mail-setup)
- [Usage](#usage)
- [Public API](#public-api)
- [File Structure](#file-structure)
- [Best Practices](#best-practices)
- [License](#license)

---

## Installation Instructions

Follow these steps to get your local copy of the project up and running:

### Prerequisites

- **Node.js**: Ensure you have the latest version of Node.js installed. If not, you can download it from [here](https://nodejs.org/).
- **MongoDB**: Set up a local or cloud MongoDB instance. You can sign up for [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud-based hosting or install MongoDB locally.
- **Git**: Make sure you have **Git** installed for version control.

### Step-by-Step Setup

1. **Clone the Repository**  
   Clone the repository from GitHub:
   ```bash
   git clone https://github.com/your-username/backend-cms.git
   cd backend-cms
   ```

2. **Install Dependencies**  
   Run the following command to install all required dependencies:
   ```bash
   npm install
   ```

3. **Setup Environment Variables**  
   Create a `.env` file in the root directory of your project with the following variables:

   ```bash
   NODE_ENV=development
   PORT=7004
   MONGO_URI=mongodb://localhost:27017/your_db_name   # Or MongoDB Atlas URI
   SESSION_SECRET=your_session_secret_key
   GMAIL_USER=your_email@gmail.com
   GMAIL_PASS=your_email_password_or_app_password
   MAIL_FROM=no-reply@example.com 
   CONTACT_EMAIL=contact@example.com
   ```

   - **`MONGO_URI`**: Replace this with the MongoDB connection string for your local or cloud database.
   - **`SESSION_SECRET`**: A secret key for session management. It should be a random, secure string.
   - **`GMAIL_USER` and `GMAIL_PASS`**: Credentials used for sending emails via Gmail SMTP. For better security, it's recommended to use an app-specific password.
   - **`MAIL_FROM`**: The default sender email address.
   - **`CONTACT_EMAIL`**: The email address where contact messages are sent.

4. **Run the Application**  
   After setting up the environment variables, start the application with:
   ```bash
   npm start
   ```
   The server will run on **http://localhost:7004**. Open this URL in your browser to access the application.

---

## Mail Setup

This project uses **Nodemailer** to send emails (for password resets, OTP verification, and contact messages) via Gmail's SMTP service. Follow these steps to ensure the mail functionality is set up correctly:

1. **Gmail Account Settings**  
   - Log in to your Gmail account.
   - Enable [Less Secure App Access](https://myaccount.google.com/lesssecureapps) (if applicable) or, preferably, set up an [App Password](https://support.google.com/accounts/answer/185833) if you have 2-Step Verification enabled.

2. **Configure Environment Variables**  
   Ensure that the following variables are correctly set in your `.env` file:
   - `GMAIL_USER`: Your Gmail address.
   - `GMAIL_PASS`: Your Gmail password or app-specific password.
   - `MAIL_FROM`: The email address from which notifications will be sent || 'no-reply@example.com'.
   - `CONTACT_EMAIL`: The email address that will receive emails is contact form.

3. **Verify SMTP Setup**  
   The mail configuration is defined in `src/config/mail.js`. When the server starts, it will verify the SMTP connection and log a message indicating whether the mail server is ready to send emails or if there's an error connecting.

4. **Testing the Mail Functionality**  
   To test your SMTP setup, you can use the following sample JSON payload to trigger a mail send via the contact endpoint:
   ```json
   {
     "name": "Alice Smith",
     "email": "alice@example.com",
     "subject": "Test Email from SMTP",
     "message": "Hello, this is a test email to verify the SMTP setup."
   }
   ```
   Use a tool like Postman or cURL to send this payload as a POST request to:
   ```
   http://localhost:7004/contact/send
   ```

---

## Environment Variables

Here are the important environment variables for this project:

| Variable           | Description                                                  |
|--------------------|--------------------------------------------------------------|
| `NODE_ENV`         | The environment mode (`development` or `production`).        |
| `PORT`             | Port on which the server will run (default: `7004`).         |
| `MONGO_URI`        | MongoDB connection string.                                   |
| `SESSION_SECRET`   | Secret key for session management.                           |
| `GMAIL_USER`       | Your Gmail address used to send OTP and other emails.        |
| `GMAIL_PASS`       | Your Gmail password or app-specific password for emails.     |
| `MAIL_FROM`        | Default sender email address for outgoing mail.              |
| `CONTACT_EMAIL`    | Recipient email address for contact form submissions.        |

---

## Usage

### Routes

Here’s a list of the main routes and their functions:

- **Authentication Routes**  
  - `GET /auth/login`: Render login page.
  - `POST /auth/login`: Handle login form submission.
  - `GET /auth/register`: Render registration page.
  - `POST /auth/register`: Handle user registration.
  - `GET /auth/forgot-password`: Render forgot password page.
  - `POST /auth/forgot-password`: Handle forgot password form submission.
  - `GET /auth/reset-password`: Render reset password page.
  - `POST /auth/reset-password`: Handle password reset using OTP.

- **Dashboard Routes**  
  - `GET /dashboard`: Render dashboard for logged-in users.

- **Content Management Routes**  
  - **Blogs**  
    - `GET /blogs`: Render the list of all blogs.
    - `POST /blogs`: Create a new blog.
    - `GET /blogs/:id`: View a specific blog.
    - `PUT /blogs/:id`: Update an existing blog.
    - `DELETE /blogs/:id`: Delete a blog.
  
  - **Similarly for Articles, Videos, and Galleries**.

- **Contact Route**  
  - `POST /contact/send`: Endpoint to send contact messages via SMTP.

---

## Public API

The project includes public API endpoints that allow external systems or third-party applications to retrieve published content in JSON format. This is useful for:

- **Mobile Applications:** Integrate the CMS content with a mobile app.
- **Third-Party Integrations:** Allow other platforms to fetch and display content.
- **Headless CMS Use Cases:** Serve as a backend for a decoupled frontend.
- **Content Syndication:** Share content with partners or across multiple sites.

### Available Endpoints

- **Blogs API**
  - `GET /api/blogs`: Retrieves a list of all published blogs.
  - `GET /api/blogs/:id`: Retrieves a specific blog by its ID.

- **Articles API**
  - `GET /api/articles`: Retrieves a list of all published articles.
  - `GET /api/articles/:id`: Retrieves a specific article by its ID.

- **Galleries API**
  - `GET /api/galleries`: Retrieves a list of all published gallery images.
  - `GET /api/galleries/:id`: Retrieves a specific gallery image by its ID.

- **Videos API**
  - `GET /api/videos`: Retrieves a list of all published videos.
  - `GET /api/videos/:id`: Retrieves a specific video by its ID.

These endpoints are mounted under the `/api` prefix. For example, to fetch all blogs, you can use:
```
http://localhost:7004/api/blogs
```

---

## File Structure

Here’s an overview of the file structure for this project:

```
backend-cms/
├── src/
│   ├── config/          # MongoDB connection, mail transporter and other configurations.
│   ├── controllers/     # Business logic for authentication and content management.
│   ├── models/          # Mongoose models for data.
│   ├── routes/          # Express routes for handling requests.
│   │   ├── auth.js
│   │   ├── blog.js
│   │   ├── article.js
│   │   ├── gallery.js
│   │   ├── video.js
│   │   ├── dashboard.js
│   │   └── publicRoutes.js   # Public API endpoints
│   ├── views/           # EJS views for rendering the UI.
│   ├── public/          # Static assets like CSS, JS, and images.
│   └── uploads/         # Folder for storing uploaded content.
├── .env                 # Environment configuration file (exclude from version control).
├── app.js               # Main entry point for the Express application.
├── package.json         # Node.js package manager file.
├── README.md            # Project documentation (this file).
└── nodemon.json         # Configuration file for Nodemon.
```

### Key Files and Directories

- **`app.js`**: Entry point of the Express server. All middlewares and routes are defined here.
- **`models/`**: Contains Mongoose schemas for database entities like users, blogs, etc.
- **`controllers/`**: Contains logic for handling requests and interacting with the database.
- **`routes/`**: Defines the application routes for authentication, content management, and public APIs.
- **`views/`**: Stores EJS templates for rendering HTML.
- **`public/`**: For static assets like stylesheets, JavaScript files, and images.

---

## Best Practices

### Session Management

- **Secure Cookies**: Session cookies are configured to be secure and set only over HTTPS in production mode.
- **MongoDB Store**: Sessions are stored in MongoDB for persistence, making it more reliable.
- **Session Secret**: Always use a strong and random session secret key.

### Password Handling

- **Hashing**: Passwords are hashed using **bcryptjs** before being stored in the database to ensure security.
- **Password Reset**: OTP-based password reset functionality is implemented, ensuring users can reset their passwords securely.

### Flash Messages

- **Flash Notifications**: Used to show messages like errors, success, and validation messages across different routes (login, registration, password reset, etc.).

### Mail/SMTP Functionality

- **Nodemailer Setup**: The application uses Nodemailer with Gmail’s SMTP server to send automated emails (for OTP verification, password reset, and contact messages).
- **Environment Security**: Ensure your email credentials are stored securely in the `.env` file and not committed to version control.

---

Made with ❤️ by **51D2ham**
```