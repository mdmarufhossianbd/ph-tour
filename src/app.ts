import cors from "cors";
import express, { Request, Response } from "express";

import { globalErrorHandlers } from "./app/middlewares/globalErrorHandlers";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/router";

const app = express();

app.use(express.json())
app.use(cors())

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to Tour Management Backend");
})


app.use(globalErrorHandlers)

app.use(notFound)

export default app