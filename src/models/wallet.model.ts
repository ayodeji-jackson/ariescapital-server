import { Schema, model } from "mongoose";
import { Wallet } from "@schema/wallet.schema";

const WalletSchema = new Schema<Wallet>({
  type: {
    type: String, 
    required: true, 
    unique: true
  }, 
  address: {
    type: String, 
    required: true, 
    trim: true, 
  }
}, { timestamps: true });
const WalletModel = model<Wallet>('wallet', WalletSchema);

export default WalletModel;