import { application, NextFunction, Request, Response, Router } from "express";
import { CustomError } from "../classes/CustomError";
import { IAuth } from '../interface/IAuth';

const routerIndex = Router({ mergeParams: true });

routerIndex.post<{}, {}, IAuth>('/login',
    async (request, response, next) => {
        try {
            const auth = request.body;
            console.log(auth);

            response.json({
                auth
            })
        } catch (err: any) {
            next(new CustomError(`Erreur d'authentification`, 400, err.message));
        }
    }
);

const routerAuth = Router({ mergeParams: true });
routerAuth.use(routerIndex);

export const ROUTES_AUTH = routerAuth;