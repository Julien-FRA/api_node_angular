import { Request, Response, NextFunction } from "express";
// import { readFileSync } from 'fs';

const middleware = (userType: 'normal' | 'admin' | 'auditeur') => {
    // Exemple chargé une seule fois une clé SSH.
    // const key = readFileSync();

    return async (req: Request, res: Response, next: NextFunction) => {
        // Exé"cuter l'authorisation de la requête
        try {
            if (req.headers.authorization) {
                switch (userType) {
                    case 'admin': console.log("Admin"); break;
                    case 'normal': console.log("Normal"); break;
                }
            } else {
                throw new Error("Not authorized");
            }
            next();
        } catch (err) {
            next(err);

        }
    }
}

export const AUTH_MIDDLEWARE = middleware;