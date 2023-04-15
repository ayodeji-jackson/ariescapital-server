import { Token } from "@schema/token.schema";
import { Schema, model } from "mongoose";

const TokenSchema = new Schema<Token>({
  user: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'user'
  }, 
  token: { type: String, required: true, }, 
  expireAt: {
    type: Date, 
    default: Date.now(), 
    index: { expires: 86400000 }
  }
}); 
const TokenModel = model<Token>('token', TokenSchema); 

export default TokenModel; 