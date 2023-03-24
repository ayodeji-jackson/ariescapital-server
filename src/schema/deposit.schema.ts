import { isValidObjectId, Types } from "mongoose";
import { z } from "zod";

export const DepositSchema = z.object({
  by: z.custom<Types.ObjectId>(
    (val) => isValidObjectId(val), { message: "payer id not found" }
  ), 
  amount: z.number({
    description: "deposit amount in us dollars", 
    required_error: "deposit amount is required"
  }).min(10, "deposit at least 10 dollars")
  .max(250000, "cannot deposit beyond $250,000"), 
  depositMethod: z.string({
    description: "deposit method"
  }).optional().default(""), 
  requestDate: z.date().optional().default(new Date()), 
  status: z.string({ 
    description: "deposit status"
  }).optional().default("")
});

export type Deposit = z.infer<typeof DepositSchema>;