import { verifyToken } from "@repo/backend-common";
import { logger } from "../utils/logger"
import { JWT_SECRET } from "../config";

export const authenticateWebsocket = (token: string) => {
    try {
        if (!token) {
            logger.error('[authenticateWebSocket] Token not found');
            return null;
        }

        const decoded = verifyToken(token, JWT_SECRET as string);
        if (!decoded || !decoded.id) {
            logger.error('[authenticateWebSocket] Invalid token');
            return null;
        }

        logger.info('[authenticateWebSocket] User authenticated');
        return decoded;
    } catch (error) {
        logger.error("[authenticateWebSocket] JWT verification failed", error);
        return null;
    } 
}