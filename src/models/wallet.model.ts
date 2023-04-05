import { Schema, model } from "mongoose";
import { Wallet } from "@schema/wallet.schema";

const WalletSchema = new Schema<Wallet>({
  owner: {
    type: Schema.Types.ObjectId, 
    required: true, 
  }, 
  btc: { type: String, trim: true }, 
  ltc: { type: String, trim: true }, 
  eth: { type: String, trim: true }, 
  bch: { type: String, trim: true }, 
  usdt: { type: String, trim: true }, 
  usdc: { type: String, trim: true }, 
}, { timestamps: true });
const WalletModel = model<Wallet>('wallet', WalletSchema);

export default WalletModel;