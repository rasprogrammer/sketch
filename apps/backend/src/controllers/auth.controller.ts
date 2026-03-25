import type { Request, Response } from "express";
import { HttpStatus } from "../utils/HttpStatus";
import { hashPassword } from "../utils/bcrypt";
import { CreateUserSchema, SigninSchema } from "@repo/types";
import { createUser, getUserByEmail } from "@repo/database";

export const signup = async (req: Request, res: Response) => {
    try {
        const parsedData = CreateUserSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                error: parsedData.error,
            });
            return;
        }

        const { name, email, password } = parsedData.data;

        // check if user exits already or not 
        const userExist = await getUserByEmail(email);
        if (userExist) {
            res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                error: "User already exists"
            });
            return;
        }

        // hashed password 
        const hashedPassword = await hashPassword(password);

        // create user
        const newUser = await createUser(email, password, name);
        res.status(HttpStatus.CREATED).json({
            success: true,
            message: "User created successfully",
            user: newUser
        });

    } catch (error) {
        console.error("Signup Error:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: "Internal server error" });
    return;
    }
}


export const signin = async (req: Request, res: Response) => {
    
}


export const me = async (req: Request, res: Response) => {
    
}