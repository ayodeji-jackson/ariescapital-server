export const PLANS = ["standard", "advanced", "nfp", "btc"] as const; 
type PlansTuple = typeof PLANS; 
export type Plans = PlansTuple[number]; 

export const DEPOSIT_METHOD = ["btc", "ltc", "eth", "bch", "usdt", "usdc"] as const; 
type DepositMethodTuple = typeof DEPOSIT_METHOD; 
export type DepositMethod = DepositMethodTuple[number];

export const ROLES = ["admin", "user"]