export type Crypto =  "btc" | "ltc" | "eth" | "bch" | "usdt" | "usdc";

export type RequestBody = {
  plan: "standard" | "advanced" | "nfp" | "btc"; 
  type: Crypto
  amount: number; 
}