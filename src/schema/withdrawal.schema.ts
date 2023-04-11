import { Types, isValidObjectId } from "mongoose";
import { z } from "zod";

export const WithdrawalSchema = z.object({
  by: z.custom<Types.ObjectId>(
    (val) => isValidObjectId(val), { message: "invalid withdrawer id" }
  ), 
  amount: z.number({
    required_error: "deposit amount is required"
  }).min(10, "deposit at least 10 dollars")
  .max(250000, "cannot deposit beyond $250,000"),
  requestDate: z.date().optional().default(new Date()), 
  walletAddress: z.string({
    required_error: "wallet address is required"
  }), 
  status: z.enum(['pending', 'confirmed'], { 
    description: "deposit status", 
    invalid_type_error: "invalid status"
  }).optional().default('pending'), 
});

export type Withdrawal = z.infer<typeof WithdrawalSchema>; 