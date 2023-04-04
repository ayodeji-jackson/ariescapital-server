import { model, Schema } from "mongoose";
import { Deposit } from "@schema/deposit.schema";

const DepositSchema = new Schema<Deposit>({
  by: {
    type: Schema.Types.ObjectId, 
    ref: 'user', 
    required: true, 
  }, 
  amount: {
    type: Number, 
    required: true, 
  }, 
  method: { type: String },
  status: { 
    type: String, 
    enum: ["pending", "confirmed"]
  }, 
  plan: { type: String }
}, { timestamps: { createdAt: "requestDate" } });
const DepositModel = model<Deposit>('deposit', DepositSchema); 

export default DepositModel; 