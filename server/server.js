const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors()); // Esto permite todas las conexiones CORS

let gpsData = {}; // Variable para almacenar los datos GPS

app.post('/api/gps', (req, res) => {
  gpsData = req.body;
  res.send('Datos recibidos');
});

app.get('/api/gps', (req, res) => {
  res.json(gpsData);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));