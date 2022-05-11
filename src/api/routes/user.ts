import { Router } from "express";
import { OkPacket } from "mysql2";
import { DB } from "../classes/DB";
import { IUser } from '../interfaces/IUser';
import { ICreateResponse } from '../interfaces/ICreateResponse';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        // Await REQUEST
        res.json({
            op: "index"
        });
    } catch(err) {
        next(err);
    }
});

router.post<{}, ICreateResponse, IUser>('/', async (req, res, next) => {
    try {

        const update = req.body;
        console.log(update);

        const record = await DB.Connection.query<OkPacket>("insert into user set ?", update);

        console.log(record);
        // Await REQUEST
        res.json({
            id: record[0].insertId
        });
    } catch(err) {
        next(err);
    }
});

export const USER_ROUTES = router;