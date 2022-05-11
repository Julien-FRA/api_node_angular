import Express from "express";
import { json } from 'body-parser';
import { USER_ROUTES } from './routes/user';
import { AUTH_MIDDLEWARE } from './middleware/authorisation';
import { Router } from 'express';

const PORT = process.env.PORT || 5050;

const app = Express();

app.use(json());

const auth_routes = Router();
auth_routes.use(AUTH_MIDDLEWARE("normal"));
auth_routes.use('/user', USER_ROUTES);

const admin_routes = Router();
auth_routes.use(AUTH_MIDDLEWARE("admin"));
auth_routes.use('/user', USER_ROUTES);

app.use('/auth', auth_routes);
app.use('/admin', admin_routes);

try {
    app.listen(PORT, () => {
        console.info("API Listening on port " + PORT);
    });
} catch (err) {
    console.log(err);
}