import UserModel from "@models/user.model";
import WithdrawalModel from "@models/withdrawal.model";
import { WithdrawalSchema } from "@schema/withdrawal.schema";
import { NextFunction, Request, Response, Router } from "express";
import { validate } from "../middleware";

const router = Router(); 

router.route('/withdrawals').post(validate(WithdrawalSchema.omit({ by: true })), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const withdrawal = await WithdrawalModel.create({
      by: req.session.userId, ...req.body
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
          walletAddress: withdrawal.walletAddress,
          requestDate: withdrawal.requestDate, 
          firstName: userDetails[i]?.firstName, 
          lastName: userDetails[i]?.lastName, 
          email: userDetails[i]?.email, 
          status: withdrawal.status
        }; 
      })); 
    } 

    const confirmedWithdrawals = WithdrawalModel.find({ by: req.session.userId, status: 'confirmed' }); 
    if (req.query.field == 'amount') {
      if (req.session.userRole == 'user') return res.json(await confirmedWithdrawals.select('amount')); 
      return res.json(await WithdrawalModel.find({ status: 'confirmed' }).select('amount')); 
    }
    else if (req.query.status == 'confirmed') 
      return res.json(await confirmedWithdrawals); 
    res.json(await WithdrawalModel.find({ by: req.session.userId }).select('amount requestDate walletAddress status')); 
  } catch(err) {
    next(err); 
  }
});

router.route('/withdrawals/:id').put(validate(WithdrawalSchema.partial()), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await WithdrawalModel.findByIdAndUpdate(req.params.id, req.body); 
    res.status(204).json({ });
  } catch (err) {
    next(err); 
  }
});

router.route('/withdrawals/:id').delete(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await WithdrawalModel.findByIdAndDelete(req.params.id); 
    res.status(204).json({ }); 
  } catch (err) {
    next(err); 
  }
});

export default router; 