import { NextFunction, Request, Response, Router } from "express";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import { validate } from "../middleware";
import { UserLoginSchema, UserSchema } from "@schema/user.schema";

const router = Router(); 

router.route('/auth/register').post(validate(UserSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.create({ 
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 10) 
    });
    
    req.session.userId = user.id; 
    req.session.userRole = user.role; 
    res.status(201).json({ id: user.id, role: user.role });
  } catch (err) {
    return next(err); 
  }
});

router.route('/auth/login').get(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) return res.status(403).json({ error: "you're not logged in" });
  try {
    if (await UserModel.findById(req.session.userId)) 
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

    if (req.session.userId && req.session.userId === user.id) 
      return res.status(200).json({ id: user.id, role: user.role });

    req.session.userId = user.id; 
    req.session.userRole = user.role; 
    res.status(200).json({ id: user.id, role: user.role });
  } catch (err) {
    return next(err);
  }
});

router.route('/auth/logout').get((req: Request, res: Response, _: NextFunction) => {
  req.session.destroy(() => {}); 
  return res.status(201).json({ }); 
})

export default router;