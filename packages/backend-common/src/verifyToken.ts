import jwt from "jsonwebtoken";

export interface TokenPayload {
    id: string;
}

export const verifyToken = (token: string, JWT_SECRET: string): TokenPayload | null => {
    return jwt.verify(token, JWT_SECRET as string) as TokenPayload;
}