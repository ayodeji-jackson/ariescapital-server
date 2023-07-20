import { NextFunction, Request, Response, Router } from "express";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import { validate } from "../middleware";
import { EmailSchema, UserLoginSchema, UserSchema } from "@schema/user.schema";
import nodemailer, { SendMailOptions } from "nodemailer"; 
import TokenModel from "@models/token.model";
import crypto from "crypto"; 

const router = Router(); 

router.route('/auth/register').post(validate(UserSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.create({ 
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 10) 
    });
    
    res.status(201).json({ id: user.id, role: user.role });
  } catch (err) {
    return next(err); 
  }
});

router.route('/auth/login').get(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) return res.status(403).json({ error: "you're not logged in" });
  try {
    const user = await UserModel.findById(req.session.userId); 
    // TODO: check if user is verified and send unauthorized
    if (user) 
      return res.json({ id: req.session.userId, role: req.session.userRole }); 
  } catch (err) {
    return next(err); 
  }
}); 

router.route('/auth/login').post(validate(UserLoginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body; 
    
    const user = await UserModel.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) 
      return res.status(400).json({ error: "invalid credentials" });
    else if (req.session.userId && req.session.userId === user.id) 
      return res.status(200).json({ id: user.id, role: user.role });
    else if (user.isVerified == false) 
      return res.status(401).json({ error: "your account is not verified" });

    req.session.userId = user.id; 
    req.session.userRole = user.role; 
    req.session.userIsVerified = user.isVerified; 
    res.status(200).json({ id: user.id, role: user.role });
  } catch (err) {
    return next(err);
  }
});

router.route('/auth/logout').get((req: Request, res: Response, next: NextFunction) => {
  try { req.session.destroy(() => {}); } 
  catch (err) { next(err); }
  return res.status(201).json({ }); 
}); 

router.route('/auth/verify').post(validate(EmailSchema), async (req: Request, res: Response, next: NextFunction) => {
  const token = crypto.randomUUID()
  try {
    const user = await UserModel.findOne({ email: req.body.email }); 
    if (!user) return res.status(400).json({ error: "user doesn't exist"}); 
    await TokenModel.create({ user: user.id, token }); 
  
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, 
      port: 465, secure: true, 
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    const mailOptions: SendMailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: req.body.email,
      subject: 'Aries Capital Email Verification', 
      text: `go to ${process.env.CLIENT_URL}/verify/${user.id}/${token} to verify your account`, 
      html: `<html>click <a href='${process.env.CLIENT_URL}/verify/${user.id}/${token}'>here</a> to verify your account</html>` 
    };
    const mail = await transporter.sendMail(mailOptions); 

    return res.json({ id: mail.messageId }); 
  } catch (err) {
    next(err); 
  }
});

router.route('/auth/verify/:userId/:token').get(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await TokenModel.findOne({ token: req.params.token }); 
    const user = await UserModel.findById(req.params.userId); 
    if (!token || token.user != user?.id) 
      return res.status(404).json({ error: 'token does not exist' }); 
    else if (user?.isVerified) return res.json(400).json({ error: 'user is already verified' }); 
    await UserModel.findByIdAndUpdate(user?.id, { isVerified: true }); 
    res.status(201).json({ }); 
  } catch (err) {
    next(err); 
  }
});

export default router;