import UserModel from "@models/user.model";
import { NextFunction, Request, Response, Router } from "express";
import { validate } from "../middleware";
import { isValidObjectId } from "mongoose";
import { UserSchema } from "@schema/user.schema";

const router = Router(); 

router.route('/users/:id').get(async (req: Request, res: Response, next: NextFunction) => {
  if (!isValidObjectId(req.params.id)) 
    return res.json({ error: "invalid user id" }); 
  try {
    const user = await UserModel.findById(req.params.id);
    if (user) res.json({ 
      id: user.id, 
      firstName: user.firstName, 
      lastName: user.lastName, 
      email: user.email
     }); 
    else res.json({ error: "user does not exist" });
  } catch (err) {
    next(err); 
  }
}); 

router.route('/users').get(async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.session.userRole == 'admin') 
      return res.json(await UserModel.find({ role: 'user' })); 
    else return res.status(401).json({ message: "unauthorized" }); 
  } catch (err) {
    next(err); 
  }
}); 

router.route('/users/:id/profit').put(validate(UserSchema.partial()), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await UserModel.findByIdAndUpdate(req.params.id, { $inc: { profit: req.body.profit }}); 
    res.status(204).json({ });
  } catch (err) {
    next(err); 
  }
}); 

export default router; 