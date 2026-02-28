import express,{urlencoded} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));

app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(cookieParser());

// import routes

// import userRoutes from './routes/user.routes.js'

// app.use('/api/v1/users',userRoutes)

export default app;