import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const errorHandler = (err: Error, _: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res.json({ error: err.message.startsWith('E11000') ? 'email address already exists' : err.message });
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId && req.path != '/auth/login' && req.path != '/auth/register')
    return res.status(401).json({ message: "unauthorized" });
  next();
};

export const validate = (schema: z.AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ error: (<z.ZodError>err).issues.map(issue => issue.message) });
  }
}