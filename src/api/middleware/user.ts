import { application, NextFunction, Request, Response, Router } from "express";
import { OkPacket, RowDataPacket } from 'mysql2';
import { DB } from '../classes/DB';
import { ICreateResponse } from '../interface/ICreateResponse';
import { IIndexQuery, IIndexResponse, IIndexResponseId } from '../interface/IIndexQuery';
import { ITableCount } from '../interface/ITableCount';
import { IUser, IUserRO } from '../interface/IUser';
import { IParams } from '../interface/IParams';


const routerIndex = Router({ mergeParams: true });

routerIndex.post<{}, ICreateResponse, IUser>('/',
  async (request, response, next: NextFunction) => {

    try {
      const user = request.body;


      // ATTENTION ! Et si les données dans user ne sont pas valables ?
      // - colonnes qui n'existent pas ?
      // - données pas en bon format ?

      const db = DB.Connection;
      const data = await db.query<OkPacket>("insert into user set ?", user);

      response.json({
        id: data[0].insertId
      });

    } catch (err: any) {
      next(err);
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
      const page = parseInt(request.query.page || "0") || 0;
      const limit = parseInt(request.query.limit || "10") || 0;
      const offset = page * limit;

      // D'abord, récupérer le nombre total
      const count = await db.query<ITableCount[] & RowDataPacket[]>("select count(*) as total from user");

      // Récupérer les lignes
      const data = await db.query<IUserRO[] & RowDataPacket[]>("select userId, familyName, givenName, email from user limit ? offset ?", [limit, offset]);

      // Construire la réponse
      const res: IIndexResponse<IUserRO> = {
        page,
        limit,
        total: count[0][0].total,
        rows: data[0]
      }

      response.json(res);

    } catch (err: any) {
      next(err);
    }

  }
);

// Récupération d'un user spécific grâce à son id

routerIndex.get<IParams, IIndexResponseId<IUserRO>, {}, IIndexQuery>('/:id',
  async (request, response, next: NextFunction) => {
    try {

      const db = DB.Connection;
      
      const userId = request.params.id;

      const data = await db.query<IUserRO[] & RowDataPacket[]>(`select userId, familyName, givenName, email from user where userId=?`, [userId]);

      const res: IIndexResponseId<IUserRO> = {
        id: userId,
        rows: data[0]
      }

      response.json(res);

    } catch (err: any) {
      next(err);
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

      const data = await db.query<IUserRO[] & RowDataPacket[]>("update user set ? where userId=?", [user, userId]);

      const res: IIndexResponseId<IUserRO> = {
        id: userId,
        rows: data[0]
      }

      response.json(res);

    } catch (err: any) {
      next(err);
    }
  }
)

// Suppression d'un user grâce à son id

routerIndex.delete<IParams, {}, {}, {}>('/:id',
  async (request, response, next: NextFunction) => {
    try {

      const db = DB.Connection;
      
      const userId = request.params.id;

      const data = await db.query(`delete from user where userId=?`, [userId]);

      response.json(data);

    } catch (err: any) {
      next(err);
    }
  }
)


// Regroupé

const routerUser = Router({ mergeParams: true });
routerUser.use(routerIndex);

export const ROUTES_USER = routerUser;