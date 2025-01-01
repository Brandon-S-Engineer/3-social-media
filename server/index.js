import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Mount the auth routes
app.use('/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running!' });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

export default app;

//? Working Version
// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import multer from 'multer';

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// // In-Memory Multer Configuration
// const upload = multer({ storage: multer.memoryStorage() });

// app.post('/auth/register', upload.single('picture'), (req, res) => {
//   try {
//     console.log('Uploaded File:', req.file); // Logs uploaded file
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: 'Missing required fields.' });
//     }

//     // Simulate user creation
//     const newUser = {
//       email,
//       password,
//       picturePath: req.file ? req.file.originalname : 'default.jpg', // Placeholder logic
//     };

//     res.status(201).json({ message: 'User registered successfully.', newUser });
//   } catch (err) {
//     console.error('Error in /auth/register:', err.message);
//     res.status(500).json({ message: 'Error in /auth/register', error: err.message });
//   }
// });

// // Test Route
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Server is running with in-memory uploads!' });
// });

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err.message));

// export default app;

//? Original
// import express from 'express';
// import bodyParser from 'body-parser';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import multer from 'multer';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import authRoutes from './routes/auth.js';
// import userRoutes from './routes/users.js';
// import postRoutes from './routes/posts.js';
// import { register } from './controllers/auth.js';
// import { createPost } from './controllers/posts.js';
// import { verifyToken } from './middleware/auth.js';
// import User from './models/User.js';
// import Post from './models/Post.js';
// import { users, posts } from './data/index.js';

// import cors from 'cors';

// /* ----------------------------- Configurations ----------------------------- */
// // Set up and configure the Express application

// // Resolve current module file path and directory for static asset handling
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load environment variables from .env
// dotenv.config();

// // Initialize an Express application
// const app = express();

// /* ----------------------------- Single CORS Call --------------------------- */
// app.use(
//   cors({
//     // Restrict to known front-end deployments (and localhost for dev)
//     origin: ['https://3-social-media-z7ma.vercel.app', 'https://3-social-media.vercel.app', 'http://localhost:3000'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     credentials: true,
//   })
// );

// // Middleware configurations for security and request handling
// app.use(express.json());
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
// app.use(morgan('common'));
// app.use(bodyParser.json({ limit: '30mb', extended: true }));
// app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

// // Static file serving (consider different storage for production)
// app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// /* ------------------------------ File Storage ------------------------------ */
// // Configure storage for uploaded files using multer
// const storage = multer.diskStorage({
//   // Set destination to store uploaded files
//   destination: function (req, file, cb) {
//     cb(null, 'public/assets');
//   },
//   // Set the filename to keep the original name of the file
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// // Create a multer instance with the specified storage configuration to handle file uploads
// const upload = multer({ storage });

// /* ---------------------------- Routes with files --------------------------- */
// // User registration with image upload
// app.post('/auth/register', upload.single('picture'), register);
// // Create post with image upload after token verification
// app.post('/posts', verifyToken, upload.single('picture'), createPost);

// /* --------------------------------- Routes --------------------------------- */
// // Mount Routes
// app.use('/auth', authRoutes);
// app.use('/users', userRoutes);
// app.use('/posts', postRoutes);

// /* ------------------------------- Mongo Setup ------------------------------ */
// // Setting server port
// const PORT = process.env.PORT || 6001;

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => {
//     // Start the server on successful database connection and log
//     // app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

//     //! Add Data One Time to the data base
//     // User.insertMany(users);
//     // Post.insertMany(posts);
//     console.log('Connected to MongoDB');
//   })
//   .catch((error) => console.log(`Mongo connection error: ${error} from /index.js`));

// export default app;
