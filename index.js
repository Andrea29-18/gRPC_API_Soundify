const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

//Entender json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Soporte cors
var corsOptions = {
    origin: ["http://localhost:3001", "http://localhost:8080"],
    methods: "GET,PUT,POST,DELETE",
};
app.use(cors(corsOptions)); 

//Rutas
app.use("/api/audios", require('./routes/audios.routes'))
app.use("/api/images", require('./routes/images.routes'))
app.get('*', (req,res) => {res.status(404).send() });

//Iniciar servidor
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Aplicación escuchando en puerto ${process.env.SERVER_PORT}`);
})
