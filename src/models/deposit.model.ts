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
  depositMethod: { type: String }, 
  requestDate: { type: Date }, 
  status: { type: String }
}, { timestamps: true });
const DepositModel = model<Deposit>('deposit', DepositSchema); 

export default DepositModel; 