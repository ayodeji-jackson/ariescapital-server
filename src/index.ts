import { addAliases } from 'module-alias';
addAliases({
  "@src": __dirname, 
  "@models": __dirname + '/models', 
  "@routes": __dirname + "/routes", 
  "@schema": __dirname + "/schema"
},)
import express, { Application } from "express";
import mongoose, { Types } from "mongoose";
import dotenv from "dotenv";
import { default as authRouter } from "./routes/auth.routes";
import { default as userRouter } from './routes/user.routes';
import { default as depositRouter } from './routes/deposit.routes'; 
import { default as withdrawalRouter } from './routes/withdrawal.routes'; 
import { default as walletRouter } from './routes/wallet.routes'; 
import { default as miscRouter } from './routes/misc.routes'; 
import { auth, errorHandler } from "./middleware";
import session from "express-session";
import { corsOptions, sessionOptions } from "./config";
import cors from "cors";

declare module "express-session" {
  interface Session {
    userId: Types.ObjectId; 
    userRole: "admin" | "user"; 
    userIsVerified: boolean; 
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
app.use(auth);

app.use(authRouter);
app.use(userRouter); 
app.use(depositRouter);
app.use(withdrawalRouter); 
app.use(walletRouter); 
app.use(miscRouter); 

app.use(errorHandler);

mongoose.connect(mongoString!);
mongoose.connection.on('error', err => console.log(err));
mongoose.connection.once('connected', () => console.log('database connected'));

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`)
});