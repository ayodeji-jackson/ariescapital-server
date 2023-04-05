import { NextFunction, Request, Response, Router } from "express";
import WalletModel from "@models/wallet.model";
import { validate } from "../middleware";
import { WalletSchema } from "@schema/wallet.schema";

const router = Router(); 

router.route('/wallets').put(validate(WalletSchema.partial()), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!await WalletModel.findOne({ owner: req.session.userId })) {
      await WalletModel.create({ owner: req.session.userId, ...req.body}); 
      res.status(200).json({ });
    } else {
      await WalletModel.updateOne({ owner: req.session.userId }, req.body); 
      res.status(204).json({ }); 
    }
  } catch (err) {
    next(err); 
  }
});

router.route('/wallets').get(async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await WalletModel.findOne({ owner: req.session.userId }));
  } catch (err) {
    next(err); 
  }
});

export default router; 