import { z } from "zod";
import { isValidObjectId, Types } from "mongoose";

export const WalletSchema = z.object({
  owner: z.custom<Types.ObjectId>((val) => isValidObjectId(val), {
    message: "invalid owner id",
  }).optional(), 
  btc: z.string({description: "BTC wallet address"}).optional().default(''), 
  ltc: z.string({description: "LTC wallet address"}).optional().default(''), 
  eth: z.string({description: "ETH wallet address"}).optional().default(''), 
  bch: z.string({description: "BCH wallet address"}).optional().default(''), 
  usdt: z.string({description: "USDT wallet address"}).optional().default(''), 
  usdc: z.string({description: "USDC wallet address"}).optional().default(''), 
});

export type Wallet = z.infer<typeof WalletSchema>;