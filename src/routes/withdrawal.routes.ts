import UserModel from "@models/user.model";
import WithdrawalModel from "@models/withdrawal.model";
import { NoUserWithdrawal, NoUserWithdrawalSchema } from "@schema/withdrawal.schema";
import { NextFunction, Request, Response, Router } from "express";
import { validate } from "../middleware";

const router = Router(); 

router.route('/withdrawals').post(validate(NoUserWithdrawalSchema), async (req: Request, res: Response, next: NextFunction) => {
  const { amount, walletAddress }: NoUserWithdrawal = req.body; 
  try {
    const withdrawal = await WithdrawalModel.create({
      by: req.session.userId, amount, walletAddress, 
      status: 'pending'
    }); 
    res.status(201).json({ id: withdrawal.id }); 
  } catch (err) {
    next(err); 
  }
});

router.route('/withdrawals').get(async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.session.userRole == "admin" && req.query.all) {
      const withdrawals = await WithdrawalModel.find().select('by amount walletAddress requestDate status'); 
      const userDetails = await Promise.all(withdrawals.map(withdrawal => UserModel.findById(withdrawal.by).select('firstName lastName email'))); 
      return res.json(withdrawals.map((withdrawal, i) => {
        return {
          id: withdrawal.id, 
          amount: withdrawal.amount, 
          requestDate: withdrawal.requestDate, 
          firstName: userDetails[i]?.firstName, 
          lastName: userDetails[i]?.lastName, 
          email: userDetails[i]?.email, 
          status: withdrawal.status
        }; 
      })); 
    } 

    const confirmedWithdrawals = WithdrawalModel.find({ by: req.session.userId, status: 'confirmed' }); 
    if (req.query.field == 'amount')
      return res.json(await confirmedWithdrawals.select('amount')); 
    else if (req.query.status == 'confirmed') 
      return res.json(await confirmedWithdrawals); 
    res.json(await WithdrawalModel.find({ by: req.session.userId }).select('amount requestDate walletAddress status')); 
  } catch(err) {
    next(err); 
  }
});

export default router; 