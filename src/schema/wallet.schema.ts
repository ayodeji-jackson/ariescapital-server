import { DEPOSIT_METHOD } from "../constants";
import { z } from "zod";

export const WalletSchema = z.object({
  type: z.enum(DEPOSIT_METHOD, {
    invalid_type_error: "invalid wallet type"
  }), 
  address: z.string({
    description: "crypto wallet address"
  })
});

export type Wallet = z.infer<typeof WalletSchema>;