import UserModel from "@models/user.model";
import { NextFunction, Request, Response, Router } from "express";
import { isValidObjectId } from "mongoose";

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

export default router; 