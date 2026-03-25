import { prisma } from "../lib/prisma"

export const getUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: {
            email
        }
    });
}

export const createUser = async (
    email: string,
    hashedPassword: string,
    name: string
) => {
    return await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name
        }
    });
}

export const getUserById = async (userId: string) => {
    return await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
}