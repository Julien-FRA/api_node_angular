import { Router } from "express";

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

router.post('/', async (req, res, next) => {
    try {
        // Await REQUEST
        res.json({
            op: "create"
        });
    } catch(err) {
        next(err);
    }
});

export const USER_ROUTES = router;