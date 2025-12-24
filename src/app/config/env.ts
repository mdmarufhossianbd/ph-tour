import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
    PORT: string,
    DB_URL: string,
    NODE_ENV: "development" | "production",
    JWT_SECRET: string,
    JWT_EXPIRES_IN: string,
    BCRYPT_SALT_ROUND: string,
    SUPER_ADMIN_EMAIL: string,
    SUPER_ADMIN_PASSWORD: string,
}

const loadEnvVar = (): EnvConfig => {
    const requiredVars = ["PORT", "DB_URL", "NODE_ENV", "JWT_SECRET", "JWT_EXPIRES_IN", "BCRYPT_SALT_ROUND", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD"];
    requiredVars.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Environment variable ${key} is missing in .env file`);
        }
    })
    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        JWT_SECRET: process.env.JWT_SECRET as string,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    }
}

export const envVars = loadEnvVar()