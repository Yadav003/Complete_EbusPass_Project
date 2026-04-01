import express,{urlencoded} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApiError } from './utils/ApiError.js';

const app = express();

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
    credentials:true
}));

app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(cookieParser());

// import routes

import userRoutes from './routes/user.routes.js'
import applicationRoutes from './routes/application.routes.js'

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/applications', applicationRoutes)

// Global error handler
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: [],
  });
});

export default app;