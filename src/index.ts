import 'module-alias/register';
import express, { Application } from "express";
import mongoose, { Types } from "mongoose";
import dotenv from "dotenv";
import { default as authRouter } from "./routes/auth.routes";
import { default as userRouter } from './routes/user.routes';
import { errorHandler } from "./middleware";
import session from "express-session";
import { corsOptions, sessionOptions } from "./config";
import cors from "cors";

declare module "express-session" {
  interface Session {
    userId: Types.ObjectId;
  }
}

dotenv.config();

const app: Application = express();
const PORT: string | number = process.env.PORT || 3000;
const mongoString = process.env.DATABASE_URL;

app.set('trust proxy', 1); 

app.use(express.json());
app.use(session(sessionOptions));
app.use(cors(corsOptions));

app.use(authRouter);
app.use(userRouter); 

app.use(errorHandler);

mongoose.connect(mongoString!);
mongoose.connection.on('error', err => console.log(err));
mongoose.connection.once('connected', () => console.log('database connected'));

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`)
});