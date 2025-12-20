import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
    name: z
        .string({ error: "Name must be string" })
        .min(2, { message: "Name too short. Minimum 2 charector long" })
        .max(50, { message: "Name too long. Maximum 50 charector long" }),
    email: z
        .string({ error: "Email must be string" })
        .email({ message: "Invalid email address" }),
    password: z
        .string({ error: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, { message: "Password must contain at least 1 uppercase letter." })
        .regex(/^(?=.*[!@#$%^&*])/, { message: "Password must contain at least 1 special character." })
        .regex(/^(?=.*\d)/, { message: "Password must contain at least 1 number." }),
    phone: z
        .string({ error: "Phone number must be string" })
        .regex(/^(?:\+880\d{9})$/, { message: "Phone number must be valid for bangladesh e.g +8801XXXXXXXXX" })
        .optional(),
    address: z
        .string({ error: "Address must be string" })
        .max(200, { message: "Address too long. Maximum 100 charector long" })
        .optional(),
})

export const updateUserZodSchema = z.object({
    name: z
        .string({ error: "Name must be string" })
        .min(2, { message: "Name too short. Minimum 2 charector long" })
        .max(50, { message: "Name too long. Maximum 50 charector long" }),
    password: z
        .string({ error: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, { message: "Password must contain at least 1 uppercase letter." })
        .regex(/^(?=.*[!@#$%^&*])/, { message: "Password must contain at least 1 special character." })
        .regex(/^(?=.*\d)/, { message: "Password must contain at least 1 number." }),
    phone: z.
        string().regex(/^(?:\+880\d{9})$/, { message: "Phone number must be valid for bangladesh e.g +8801XXXXXXXXX" })
        .optional(),
    address: z
        .string({ error: "Address must be string" })
        .max(200, { message: "Address too long. Maximum 100 charector long" })
        .optional(),
    role: z
        .enum(Object.values(Role) as [string])
        .optional(),
    isActive: z
        .enum(Object.values(IsActive) as [string])
        .optional(),
    isDeleted: z
        .boolean({ error: "isDeleted must be boolean" })
        .optional(),
    isVerified: z
        .boolean({ error: "isVerified must be boolean" })
        .optional(),

})