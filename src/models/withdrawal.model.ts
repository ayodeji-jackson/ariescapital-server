import { model, Schema } from "mongoose";
import { Withdrawal } from "@schema/withdrawal.schema";

const WithdrawalSchema = new Schema<Withdrawal>({
  by: {
    type: Schema.Types.ObjectId, 
    ref: 'user', 
    required: true, 
  }, 
  amount: {
    type: Number, 
    required: true, 
  }, 
  walletAddress: {
    type: String, 
    required: true
  }, 
  status: { 
    type: String, 
    enum: ["pending", "confirmed"], 
    default: 'pending'
  }, 
}, { timestamps: { createdAt: "requestDate" } });
const WithdrawalModel = model<Withdrawal>('withdrawal', WithdrawalSchema); 

export default WithdrawalModel; 