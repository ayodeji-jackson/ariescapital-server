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
      email: user.email, 
      target: user.target, 
     }); 
    else res.json({ error: "user does not exist" });
  } catch (err) {
    next(err); 
  }
}); 

router.route('/users').get(async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.session.userRole == 'admin') {
      const user = await UserModel.find({ role: 'user' })
      return res.json(user.map(user => {
        return user.profit == undefined ? { ...user, profit: 0 } : user
      })); 
    }
    else return res.status(401).json({ message: "unauthorized" }); 
  } catch (err) {
    next(err); 
  }
}); 

router.route('/users/:id').put(validate(UserSchema.partial()), async (req: Request, res: Response, next: NextFunction) => {
  try {
    switch (req.query.field) {
      case 'profit': 
        await UserModel.findByIdAndUpdate(req.params.id, { $inc: { profit: req.body.profit }}); 
        break; 
      default: 
        await UserModel.findByIdAndUpdate(req.params.id, req.body); 
        break; 
    }
    res.status(204).json({ });
  } catch (err) {
    next(err); 
  }
}); 

export default router; 