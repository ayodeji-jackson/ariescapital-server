import { isValidObjectId, Types } from "mongoose";
import { DEPOSIT_METHOD, PLANS } from "../constants";
import { z } from "zod";

export const DepositSchema = z.object({
  by: z.custom<Types.ObjectId>(
    (val) => isValidObjectId(val), { message: "payer id not found" }
  ), 
  amount: z.number({
    required_error: "deposit amount is required"
  }).min(10, "deposit at least 10 dollars")
  .max(250000, "cannot deposit beyond $250,000"), 
  method: z.enum(DEPOSIT_METHOD, {
    description: "deposit method", 
    invalid_type_error: "invalid deposit method"
  }), 
  requestDate: z.date().optional().default(new Date()), 
  status: z.enum(['pending', 'confirmed'], { 
    description: "deposit status", 
    invalid_type_error: "invalid status"
  }).optional().default('pending'), 
  plan: z.enum(PLANS, {
    invalid_type_error: "invalid plan"
  })
});
export const NoUserDepositSchema = DepositSchema.omit({ by: true }); 

export type Deposit = z.infer<typeof DepositSchema>;
export type NoUserDeposit = z.infer<typeof NoUserDepositSchema>