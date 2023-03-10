import express from 'express';
import bodyParser from 'body-parser';
import {routes} from './network/routes.js';
import cors from 'cors';

let app = express();
app.use(bodyParser.json());
app.use(cors());
routes(app);

app.listen(3000);
console.log('La app esta escuchando en http://localhost:3000');
