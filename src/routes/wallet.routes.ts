import { NextFunction, Request, Response, Router } from "express";
import WalletModel from "@models/wallet.model";
import { validate } from "../middleware";
import { WalletSchema } from "@schema/wallet.schema";

const router = Router(); 

router.route('/wallets/:type').put(validate(WalletSchema.omit({ type: true })), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!await WalletModel.findOne({ type: req.params.type })) {
      await WalletModel.create({ type: req.params.type, address: req.body.address }); 
      res.status(200).json({ });
    } else {
      await WalletModel.updateOne({ type: req.params.type }, { address: req.body.address }); 
      res.status(204).json({ }); 
    }
  } catch (err) {
    next(err); 
  }
});

router.route('/wallets/:type').get(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wallet = await WalletModel.findOne({ type: req.params.type });
    if (!wallet) return res.status(200).json({ address: '' }); 
    res.status(200).json(wallet); 
  } catch (err) {
    next(err); 
  }
});

export default router; 