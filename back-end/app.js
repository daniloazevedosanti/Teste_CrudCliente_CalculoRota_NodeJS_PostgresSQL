const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const clientesRouter = require('./routes/cliente.routes');
const calcularRotaRouter = require('./routes/rota.routes');

const app = express();
const port = process.env.APP_PORT || 3001;

app.use(bodyParser.json());

if (process.env.NODE_ENV === 'dev') {
    app.use(cors());
    console.log('CORS ativado');
}

app.use('/clientes', clientesRouter);
app.use('/calcular-rota', calcularRotaRouter);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
