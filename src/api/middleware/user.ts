import { application, NextFunction, Request, Response, Router } from "express";
import { OkPacket, RowDataPacket } from 'mysql2';
import { DB } from '../classes/DB';
import { ICreateResponse } from '../interface/ICreateResponse';
import { IIndexQuery, IIndexResponse, IIndexResponseId } from '../interface/IIndexQuery';
import { ITableCount } from '../interface/ITableCount';
import { IUser, IUserRO } from '../interface/IUser';
import { IParams } from '../interface/IParams';
import { CustomError } from "../classes/CustomError";

const routerIndex = Router({ mergeParams: true });

const bcrypt = require('bcryptjs');

const jwt = require("jsonwebtoken");

routerIndex.post<{}, ICreateResponse, IUser>('/',
  async (request, response, next: NextFunction) => {

    try {
      const user = request.body;

      const password = user.password;

      const passwordHash = bcrypt.hashSync(password, 10);
      // const result = bcrypt.compareSync(password, hash);
      // console.log(result);

      const db = DB.Connection;

      const data = await db.query<OkPacket>("insert into user (familyName, givenName, email, password) values (?,?,?,?)", [user.familyName, user.givenName, user.email, passwordHash]);

      // Create token
      const token = jwt.sign(
        { id: user.userId, email: user.email },
        process.env.TOKEN_KEY, //// LE PROBLEME VIENT D'ICI !!!!!!!!!!
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;

      response.json({
        id: data[0].insertId
      });


    } catch (err: any) {
      next(new CustomError(`Erreur d'insertion des données`, 400, err.message));
    }

  }
);

// Récupération de la totalité des user

routerIndex.get<{}, IIndexResponse<IUserRO>, {}, IIndexQuery>('/',
  async (request, response, next: NextFunction) => {

    try {

      const db = DB.Connection;

      // On suppose que le params query sont en format string, et potentiellement
      // non-numérique, ou corrompu
      const page: number = parseInt(request.query.page || "0") || 0;
      const limit: number = parseInt(request.query.limit || "10") || 0;
      const offset = page * limit;

      // D'abord, récupérer le nombre total
      const count = await db.query<ITableCount[] & RowDataPacket[]>("select count(*) as total from user");

      // Récupérer les lignes
      const data = await db.query<IUserRO[] & RowDataPacket[]>("select userId, familyName, givenName, email, password from user limit ? offset ?", [limit, offset]);

      // Construire la réponse
      const res: IIndexResponse<IUserRO> = {
        page,
        limit,
        total: count[0][0].total,
        rows: data[0]
      }

      const [rowResult] = res.rows;

      if (!rowResult) {
        throw new CustomError(`Erreur dans la requête`, 404, 'Unknown user');
      }

      response.json(res);

    } catch (err: any) {
      next(new CustomError(err.message, 404, err));
    }

  }
);

// Récupération d'un user spécific grâce à son id

routerIndex.get<IParams, IIndexResponseId<IUserRO>, {}, IIndexQuery>('/:id',
  async (request, response, next: NextFunction) => {
    try {

      const db = DB.Connection;

      const userId = request.params.id;

      const data = await db.query<IUserRO[] & RowDataPacket[]>(`select userId, familyName, givenName, email, password from user where userId=?`, [userId]);

      const res: IIndexResponseId<IUserRO> = {
        id: userId,
        rows: data[0]
      }

      const [rowResult] = res.rows;

      if (!rowResult) {
        throw new CustomError(`userId not found`, 404, 'Unknown user');
      }

      response.json(res);

    } catch (err: any) {
      next(new CustomError(err.message, 404, err));
    }
  }
)

// Modification d'un user grâce a son id

routerIndex.put<IParams, IIndexResponseId<IUserRO>, {}, IIndexQuery>('/:id',
  async (request, response, next: NextFunction) => {
    try {

      const userId = request.params.id;

      const user = request.body;

      const db = DB.Connection;

      const data = await db.query<OkPacket>("update user set ? where userId=?", [user, userId]);

      const affectedRows = data[0].affectedRows;

      if (!affectedRows) {
        throw new CustomError(`Utilisateur introuvable`, 404, 'Unknown user');
      }

      response.sendStatus(200);

    } catch (err: any) {
      next(new CustomError(err.message, 404, err));
    }
  }
)

// Suppression d'un user grâce à son id

routerIndex.delete<IParams, {}, {}, {}>('/:id',
  async (request, response, next: NextFunction) => {
    try {

      const db = DB.Connection;

      const userId = request.params.id;

      const data = await db.query<OkPacket>(`delete from user where userId=?`, [userId]);

      const affectedRows = data[0].affectedRows;

      if (!affectedRows) {
        throw new CustomError(`Utilisateur introuvable`, 404, 'Unknown user');
      }

      response.sendStatus(200);

    } catch (err: any) {
      next(new CustomError(err.message, 404, err));
    }
  }
)


// Regroupé

const routerUser = Router({ mergeParams: true });
routerUser.use(routerIndex);

export const ROUTES_USER = routerUser;