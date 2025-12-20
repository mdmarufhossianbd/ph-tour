import { NextFunction, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import AppError from "../../errorHandler/AppError";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { Role } from "./user.interface";
import { createUserZodSchema } from "./user.validation";


const router = Router();

router.post('/register',
    validateRequest(createUserZodSchema)
    , UserController.createUser)
router.get('/all-users', (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new AppError(403, "No Access Token Provided")
        }
        const verifiedToken = jwt.verify(accessToken as string, "secretKey");

        if ((verifiedToken as jwt.JwtPayload).role !== Role.ADMIN || Role.SUPER_ADMIN) {
            throw new AppError(403, "You are not authorized to access this resource")
        }
        next();
    } catch (error) {
        next(error)
    }
}, UserController.getAllUsers)

export const UserRoutes = router;

export { router };

