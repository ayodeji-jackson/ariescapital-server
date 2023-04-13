import { z } from "zod";

export const UserSchema = z.object({
  firstName: z.string({ required_error: "first name is required" }), 
  lastName: z.string({ required_error: "last name is required" }), 
  email: z.string({ 
    required_error: "email address is required", 
    invalid_type_error: "invalid email" 
  }).email(), 
  phone: z.string({ required_error: "phone number is required" }), 
  referrer: z.string({ description: "referrer id"}).optional().default(""), 
  country: z.string({ required_error: "country is required" }), 
  password: z.string({ required_error: "password is required" }), 
  profit: z.number({ description: 'user profit' }).optional().default(0), 
  target: z.union([z.literal(0), z.literal(30), z.literal(50), z.literal(100), z.literal(200)]).optional().default(0), 
  role: z.enum(["user", "admin"]).optional().default("user")
});

export const UserLoginSchema = z.object({
  email: z.string({ required_error: "email address is required" }).email(), 
  password: z.string({ required_error: "password is required" })
})

export type User = z.infer<typeof UserSchema>;