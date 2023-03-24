import { NextFunction, Request, Response, Router } from "express";
import DepositModel from "@models/deposit.model";
import { RequestBody } from "../types/deposit.types";

const router: Router = Router(); 

router.route('/deposit').post(async (req: Request, res: Response, next: NextFunction) => {
  const { plan, type, amount }: RequestBody = req.body; 
  try {
    const deposit = await DepositModel.create({ 
      by: req.session.userId,  
      amount, 
    });
    res.status(201).json({ id: deposit.id }); 
  } catch (err) {
    next(err); 
  }
})