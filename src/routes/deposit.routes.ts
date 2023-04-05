import { NextFunction, Request, Response, Router } from "express";
import DepositModel from "@models/deposit.model";
import { validate } from "../middleware";
import { NoUserDeposit, NoUserDepositSchema } from "@schema/deposit.schema";
import UserModel from "@models/user.model";

const router: Router = Router(); 

router.route('/deposits').post(validate(NoUserDepositSchema), async (req: Request, res: Response, next: NextFunction) => {
  const { plan, method, amount }: NoUserDeposit = req.body; 
  try {
    const deposit = await DepositModel.create({ 
      by: req.session.userId, 
      amount, method, plan, status: "pending", 
    });
    res.status(201).json({ id: deposit.id }); 
  } catch (err) {
    next(err); 
  }
});

router.route('/deposits/:id').get(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deposit = await DepositModel.findById(req.params.id); 
    if (!deposit) 
      return res.status(404).json({ error: 'invoice not found' }); 
    res.json({ 
      amount: deposit.amount, 
      method: deposit.method
    }); 
  } catch (err) {
    next(err); 
  }
});

router.route('/deposits').get(async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.session.userRole == "admin" && req.query.all) {
      const deposits = await DepositModel.find().select('by amount plan requestDate method status'); 
      const userDetails = await Promise.all(deposits.map(deposit => UserModel.findById(deposit.by).select('firstName lastName email'))); 
      return res.json(deposits.map((deposit, i) => {
        return {
          id: deposit.id, 
          amount: deposit.amount, 
          requestDate: deposit.requestDate, 
          firstName: userDetails[i]?.firstName, 
          lastName: userDetails[i]?.lastName, 
          email: userDetails[i]?.email, 
          status: deposit.status
        }; 
      })); 
    } 

    const confirmedDeposits = DepositModel.find({ by: req.session.userId, status: 'confirmed' }); 
    if (req.query.field == 'amount') {
      if (req.session.userRole == 'user') return res.json(await confirmedDeposits.select('amount')); 
      return res.json(await DepositModel.find({ status: 'confirmed' }).select('amount')); 
    }
    else if (req.query.status == 'confirmed') 
      return res.json(await confirmedDeposits); 
    res.json(await DepositModel.find({ by: req.session.userId }).select('amount plan requestDate method status')); 
  } catch(err) {
    next(err); 
  }
});

router.route('/deposits/:id').put(validate(NoUserDepositSchema.partial()), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await DepositModel.findByIdAndUpdate(req.params.id, req.body); 
    res.status(204).json({ });
  } catch (err) {
    next(err); 
  }
});

export default router; 