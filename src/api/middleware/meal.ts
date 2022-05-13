import { application, NextFunction, Request, Response, Router } from "express";
import { OkPacket, RowDataPacket } from 'mysql2';
import { DB } from '../classes/DB';
import { ICreateResponse } from '../interface/ICreateResponse';
import { IIndexQuery, IIndexResponse, IIndexResponseId } from '../interface/IIndexQuery';
import { ITableCount } from '../interface/ITableCount';
import { IMeal, IMealRO } from '../interface/IMeal';
import { IParams } from '../interface/IParams';
import { CustomError } from "../classes/CustomError";


const routerIndex = Router({ mergeParams: true });

routerIndex.post<{}, ICreateResponse, IMeal>('/',
  async (request, response, next: NextFunction) => {

    try {
      const meal = request.body;

      const db = DB.Connection;
      const data = await db.query<OkPacket>("insert into meal set ?", meal);

      response.json({
        id: data[0].insertId
      });

    } catch (err: any) {
      next(new CustomError(`Erreur d'insertion des données`, 400, err.message));
    }

  }
);


routerIndex.get<{}, IIndexResponse<IMealRO>, {}, IIndexQuery>('/',
  async (request, response, next: NextFunction) => {

    try {

      const db = DB.Connection;

      // On suppose que le params query sont en format string, et potentiellement
      // non-numérique, ou corrompu
      const page: number = parseInt(request.query.page || "0") || 0;
      const limit: number = parseInt(request.query.limit || "10") || 0;
      const offset = page * limit;

      // D'abord, récupérer le nombre total
      const count = await db.query<ITableCount[] & RowDataPacket[]>("select count(*) as total from meal");

      // Récupérer les lignes
      const data = await db.query<IMealRO[] & RowDataPacket[]>("select mealId, name, type from meal limit ? offset ?", [limit, offset]);

      // Construire la réponse
      const res: IIndexResponse<IMealRO> = {
        page,
        limit,
        total: count[0][0].total,
        rows: data[0]
      }

      const [ rowResult ] = res.rows;

      if(!rowResult) {
        throw new CustomError(`Erreur dans la requête`, 404, 'Unknown meal');
      }

      response.json(res);

    } catch (err: any) {
      next(new CustomError(err.message, 404, err));
    }

  }
);

routerIndex.get<IParams, IIndexResponseId<IMealRO>, {}, IIndexQuery>('/:id',
  async (request, response, next: NextFunction) => {
    try {

      const db = DB.Connection;

      const mealId = request.params.id;

      const data = await db.query<IMealRO[] & RowDataPacket[]>(`select mealId, name, type from meal where mealId=?`, [mealId]);

      const res: IIndexResponseId<IMealRO> = {
        id: mealId,
        rows: data[0]
      }

      const [ rowResult ] = res.rows;

      if(!rowResult) {
        throw new CustomError(`mealId not found`, 404, 'Unknown meal');
      }

      response.json(res);

    } catch (err: any) {
      next(new CustomError(err.message, 404, err));
    }
  }
);

routerIndex.put<IParams, IIndexResponseId<IMealRO>, {}, IIndexQuery>('/:id',
  async (request, response, next: NextFunction) => {
    try {

      const mealId = request.params.id;

      const meal = request.body;

      const db = DB.Connection;

      const data = await db.query<OkPacket>("update meal set ? where mealId=?", [meal, mealId]);

      const affectedRows = data[0].affectedRows;

      if (!affectedRows) {
        throw new CustomError(`Repas introuvable`, 404, 'Unknown meal');
      }

      response.sendStatus(200);

    } catch (err: any) {
      next(new CustomError(err.message, 404, err));
    }
  }
);

routerIndex.delete<IParams, {}, {}, {}>('/:id',
  async (request, response, next: NextFunction) => {
    try {

      const db = DB.Connection;

      const mealId = request.params.id;

      const data = await db.query<OkPacket>(`delete from meal where mealId=?`, [mealId]);

      const affectedRows = data[0].affectedRows;

      if (!affectedRows) {
        throw new CustomError(`Repas introuvable`, 404, 'Unknown meal');
      }

      response.sendStatus(200);

    } catch (err: any) {
      next(new CustomError(err.message, 404, err));
    }
  }
)

// Regroupé

const routerMeal = Router({ mergeParams: true });
routerMeal.use(routerIndex);

export const ROUTES_MEAL = routerMeal;