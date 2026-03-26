import { client } from "../lib/prisma"

export const getUserByEmail = async (email: string) => {
    return await client.user.findUnique({
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
    return await client.user.create({
        data: {
            email,
            password: hashedPassword,
            name
        }
    });
}

export const getUserById = async (userId: string) => {
    return await client.user.findUnique({
        where: {
            id: userId
        }
    });
}