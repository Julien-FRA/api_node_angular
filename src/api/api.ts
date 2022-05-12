import Express from "express";
import { ROUTES_USER } from './middleware/user';
import handleError from './middleware/error-handler'
import { json } from 'body-parser';

// Récupérer le port des variables d'environnement ou préciser une valeur par défaut
const PORT = process.env.PORT || 5050;

// Créer l'objet Express
const app = Express();

// L'appli parse le corps du message entrant comme du json
app.use(json());

app.use('/user', ROUTES_USER);

app.use(handleError);

// Lancer le serveur
try {
  app.listen(PORT, () => {
    console.info("API Listening on port " + PORT);
  });
} catch (err) {
  console.log(err);
}