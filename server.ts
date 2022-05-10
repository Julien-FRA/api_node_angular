import Express, { NextFunction, Request, Response } from "express";
import { join } from 'path';
import { json } from "body-parser";

// Récupérer le port des variables d'environnement ou préciser une valeur par défaut
const PORT = process.env.PORT || 5050;

// Créer l'objet Express
const app = Express();

// L'appli parse de façon global le corps du message entrant comme du json
app.use(json());

// Créer un endpoint GET
app.get('/helo', 
  (request: Request, response: Response, next: NextFunction) => {
    response.send("<h1>Hello world!</h1>");
  }
);

// Server des fichiers statiques
app.use('/public', Express.static(join(__dirname, '..', 'media')));


// Lancer le serveur
app.listen(PORT,
  () => {
    console.info("API Listening on port " + PORT);
  }
);
