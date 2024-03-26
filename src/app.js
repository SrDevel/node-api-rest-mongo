const express = require('express');
const { cofig, config } = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
config();


const bookRoutes = require('../src/routes/book.routes')

// Servidor de express lo usamos para los MIDDLEWARES
const app = express();
app.use(bodyParser.json());

// Conexión a la base de datos
const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME})

const db = mongoose.connection;

app.use('/books', bookRoutes);

app.listen(port, () => {
    console.log(`Servido iniciado en el puerto ${port}`);
})