/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import { envVars } from './app/config/env';
import { speedSuperAdmin } from './app/utils/speedSuperAdmin';

let server: Server;


const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)
        console.log('DB connected successfully!!!');

        server = app.listen(envVars.PORT, () => {
            console.log(`Tour Management server is running on ${envVars.PORT}`);
        })
    } catch (error) {
        console.log(`error =>,`, error);
    }
}

(
    async () => {
        await startServer()
        await speedSuperAdmin()
    }
)()

process.on("unhandledRejection", (error) => {
    console.log("Unhandled rejecttion detected... server is shutting down...", error);
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on("uncaughtException", (error) => {
    console.log(`Uncaught Exception detected... server is shutting down...`, error);
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

// Promise.reject(new Error("Unhandled Promise Rejection"))
// throw new Error("Unhadled Exception")