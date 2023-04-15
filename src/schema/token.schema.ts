import { Types, isValidObjectId } from "mongoose";
import { z } from "zod";

export const TokenSchema = z.object({
  user: z.custom<Types.ObjectId>((val) => isValidObjectId(val), {
    message: "invalid user id",
  }),
  token: z.string().uuid(), 
  expireAt: z.date().optional().default(new Date)
}); 

export type Token = z.infer<typeof TokenSchema>; 