import express , { type Request, type Response } from "express";
import cors from "cors";
import { PORT } from "./config/env";

import authRouter from "./routes/auth.routes";
import roomRouter from "./routes/room.routes";
import canvasRouter from "./routes/canvas.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    return res.status(200).json({
        success: true,
        message: "Welcome to SKETCH! -",
    });
})

app.use("/auth", authRouter);
app.use("/room", roomRouter);
app.use("/canvas", canvasRouter);

app.listen(PORT, () => {
    console.log(`[ server ] is listening on : http://localhost:${PORT}`);
})