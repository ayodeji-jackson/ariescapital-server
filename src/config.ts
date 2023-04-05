import { SessionOptions } from "express-session";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";
import { CorsOptions } from "cors";

dotenv.config();

export const corsOptions: CorsOptions = {
  origin: process.env.CLIENT_URL, 
  credentials: true, 
}

export const sessionOptions: SessionOptions = {
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false, 
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24, 
    sameSite: `${process.env.NODE_ENV === "development" ? "lax" : "none"}`,
    secure: process.env.NODE_ENV === "development" ? false : true, 
  }, 
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE_URL
  })
};