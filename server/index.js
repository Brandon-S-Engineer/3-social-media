import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import { register } from './controllers/auth.js';
import { createPost } from './controllers/posts.js';
import { verifyToken } from './middleware/auth.js';
import User from './models/User.js';
import Post from './models/Post.js';
import { users, posts } from './data/index.js';

/* ----------------------------- Configurations ----------------------------- */
// Set up and configure the Express application

// Resolve current module file path and directory for static asset handling
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env
dotenv.config();

// Initialize an Express application
const app = express();

// Middleware configurations for security and request handling
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

// Updated CORS Configuration
const allowedOrigins = [
  'https://3-social-media-z7ma.vercel.app/', // Frontend deployed URL
  'https://3-social-media.vercel.app/', // Backend deployed URL
  'http://localhost:3000/', // For local development
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies or auth headers if needed
  })
);

// Static file serving (consider different storage for production)
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

/* ------------------------------ File Storage ------------------------------ */
// Configure storage for uploaded files using multer
const storage = multer.diskStorage({
  // Set destination to store uploaded files
  destination: function (req, file, cb) {
    cb(null, 'public/assets');
  },
  // Set the filename to keep the original name of the file
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
// Create a multer instance with the specified storage configuration to handle file uploads
const upload = multer({ storage });

/* ---------------------------- Routes with files --------------------------- */
// User registration with image upload
app.post('/auth/register', upload.single('picture'), register);
// Create post with image upload after token verification
app.post('/posts', verifyToken, upload.single('picture'), createPost);

/* --------------------------------- Routes --------------------------------- */
// Mount Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

/* ------------------------------- Mongo Setup ------------------------------ */
// Setting server port
const PORT = process.env.PORT || 6001;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    // Start the server on successful database connection and log
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    //! Add Data One Time
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
