import DepositModel from "@models/deposit.model";
import WithdrawalModel from "@models/withdrawal.model";
import { NextFunction, Request, Response, Router } from "express";

const router = Router(); 

router.route('/balance').get(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deposits = await DepositModel.find({ by: req.session.userId, status: 'confirmed' }).select("amount"); 
    const withdrawals = await WithdrawalModel.find({ by: req.session.userId, status: 'confirmed' }).select('amount'); 
    const balance = deposits.map(d => d.amount).reduce((a, b) => a + b, 0) - 
      withdrawals.map(w => w.amount).reduce((a, b) => a + b, 0); 
    res.json({ value: balance }); 
  } catch (err) {
    next(err); 
  }
});

export default router; 