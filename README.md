# Social Media Platform

A full-stack social media application built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

- **User Authentication**: Register, login with JWT authentication
- **User Profiles**: Customizable profiles with avatar, bio, followers/following
- **Posts**: Create, edit, delete posts with image uploads
- **Interactions**: Like posts and comments, follow/unfollow users
- **Comments**: Comment on posts
- **Tags**: Categorize posts with tags
- **Feed**: View posts from all users
- **Search**: Search for users

## Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **express-validator** - Input validation
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **express-mongo-sanitize** - NoSQL injection protection

### Frontend
- **HTML5**, **CSS3**, **JavaScript (ES6+)**
- **Fetch API** - HTTP requests

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CodeAlpha_Social-Media-Platform-main
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Update the `.env` file with your configuration:
     ```env
     PORT=5002
     MONGODB_URI=mongodb://localhost:27017/socialmedia
     JWT_SECRET=your_strong_random_secret_key_here
     CORS_ORIGIN=http://localhost:5501,http://127.0.0.1:5501
     ```
   - **Important**: Generate a strong JWT secret using:
     ```bash
     node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
     ```

4. **Start MongoDB**
   - If using local MongoDB:
     ```bash
     mongod
     ```
   - Or ensure your MongoDB Atlas connection string is in `.env`

5. **Seed the database with tags (optional)**
   ```bash
   npm run seed-tags
   # or
   node scripts/seedTags.js
   ```

6. **Start the backend server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

7. **Open the frontend**
   - Open `frontend/index.html` in a browser
   - Or use a local server like Live Server in VS Code
   - Make sure the port matches the CORS_ORIGIN in your `.env`

## Project Structure

```
CodeAlpha_Social-Media-Platform-main/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── commentController.js # Comment operations
│   │   ├── postController.js    # Post operations
│   │   └── userController.js    # User operations
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── Comment.js           # Comment schema
│   │   ├── Post.js              # Post schema
│   │   ├── Tag.js               # Tag schema
│   │   └── User.js              # User schema
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── comments.js          # Comment routes
│   │   ├── posts.js             # Post routes
│   │   ├── tags.js              # Tag routes
│   │   └── users.js             # User routes
│   ├── scripts/
│   │   └── seedTags.js          # Database seeding script
│   ├── uploads/                 # Uploaded images
│   ├── .env                     # Environment variables (create from .env.example)
│   ├── .env.example             # Example environment variables
│   ├── .gitignore               # Git ignore file
│   ├── package.json             # Dependencies
│   └── server.js                # Main server file
└── frontend/
    ├── css/
    │   └── style.css            # Styles
    ├── js/
    │   ├── api.js               # API calls
    │   ├── app.js               # Main app logic
    │   └── auth.js              # Auth UI logic
    ├── pages/
    │   ├── create-post.html     # Create post page
    │   ├── login.html           # Login page
    │   ├── profile.html         # User profile page
    │   ├── register.html        # Registration page
    │   └── user-profile.html    # Other user profile page
    └── index.html               # Home page
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/profile/:id` - Get user profile by ID
- `PUT /api/users/profile` - Update profile
- `POST /api/users/avatar` - Upload avatar
- `POST /api/users/follow/:id` - Follow user
- `POST /api/users/unfollow/:id` - Unfollow user
- `GET /api/users/search?query=` - Search users

### Posts
- `GET /api/posts/feed` - Get feed posts
- `GET /api/posts/all` - Get all posts (public)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (with optional image)
- `PUT /api/posts/:id` - Edit post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/unlike post

### Comments
- `GET /api/comments/post/:postId` - Get post comments
- `POST /api/comments/post/:postId` - Create comment
- `POST /api/comments/:id/like` - Like/unlike comment
- `DELETE /api/comments/:id` - Delete comment

### Tags
- `GET /api/tags` - Get all tags

## Security Features

✅ **JWT Authentication** - Secure token-based authentication  
✅ **Password Hashing** - bcrypt with salt rounds  
✅ **Rate Limiting** - Prevents brute force attacks  
✅ **Input Sanitization** - XSS protection  
✅ **NoSQL Injection Protection** - Sanitizes MongoDB queries  
✅ **File Upload Validation** - Type and size restrictions  
✅ **Security Headers** - Helmet middleware  
✅ **CORS Configuration** - Controlled cross-origin requests  
✅ **Environment Variables** - Sensitive data protection  

## Development

### Running in Development Mode
```bash
cd backend
npm run dev
```

### Seeding Tags
```bash
cd backend
node scripts/seedTags.js
```

### Package Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Common Issues & Solutions

### Port Already in Use
If port 5002 is already in use, change the PORT in `.env` file and update the API_BASE in `frontend/js/api.js` and `frontend/js/app.js`.

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check your MONGODB_URI in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### CORS Errors
- Ensure the frontend port matches CORS_ORIGIN in `.env`
- Check that the API_BASE in frontend matches the backend URL

### JWT Token Issues
- Clear localStorage in browser dev tools
- Ensure JWT_SECRET is set in `.env`
- Check token expiration (default: 30 days)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

CodeAlpha Internship Project

## Acknowledgments

- Built as part of CodeAlpha Web Development Internship
- Thanks to the open-source community for the amazing packages