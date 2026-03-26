import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

export const generateToken = (id: string): string => {
    return jwt.sign(
        {
            id
        },
        JWT_SECRET as string,
        {
            expiresIn: "1d"
        }
    )
};

export const decodeToken = (token: string) => {
    return jwt.decode(token);
}