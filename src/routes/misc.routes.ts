import DepositModel from "@models/deposit.model";
import UserModel from "@models/user.model";
import WithdrawalModel from "@models/withdrawal.model";
import { NextFunction, Request, Response, Router } from "express";

const router = Router(); 

router.route('/').get((_: Request, res: Response) => {
  res.json({ message: 'alive' });
});

router.route('/balance').get(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [deposits, withdrawals, user] = await Promise.all([
      DepositModel.find({ by: req.session.userId, status: 'confirmed' }).select("amount"), 
      WithdrawalModel.find({ by: req.session.userId, status: 'confirmed' }).select('amount'), 
      UserModel.findById(req.session.userId).select('profit')
    ]); 

    const balance = deposits.map(d => d.amount).reduce((a, b) => a + b, 0) - 
      withdrawals.map(w => w.amount).reduce((a, b) => a + b, 0); 
    res.json({ value: balance + (user?.profit || 0) }); 
  } catch (err) {
    next(err); 
  }
});

router.route('/investors').get(async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!(req.session.userRole == 'admin')) return res.status(401).json({ message: 'unauthorized' }); 
    const [users, confirmedWithdrawals, confirmedDeposits] = await Promise.all([
      UserModel.find().select('firstName lastName email phone profit'), 
      WithdrawalModel.find({ status: 'confirmed' }).select('by amount'), 
      await DepositModel.find({ status: 'confirmed' }).select('by amount')
    ]);
    
    res.json(users.map(user => {
      return {
        id: user.id, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        email: user.email, 
        phone: user.phone,  
        totalDeposits: confirmedDeposits.filter(d => user.id == d.by).map(d => d.amount).reduce((a, b) => a + b, 0), 
        totalWithdrawals: confirmedWithdrawals.filter(w => user.id == w.by).map(w => w.amount).reduce((a, b) => a + b, 0), 
        profit: user.profit
      }
    }).filter(investor => investor.totalDeposits > 0));
  } catch (err) {
    next(err); 
  }
});

export default router; 