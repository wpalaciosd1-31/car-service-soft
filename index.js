const express = require('express');
const cors = require('cors');
const CitaTallerManager = require('./CitaTallerModel');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint POST para registrar la cita usando Programación Orientada a Objetos
app.post('/api/citas', async (req, res) => {
    try {
        const datosCita = req.body;
        
        // Creamos una instancia de nuestra Clase de POO
        const citaManager = new CitaTallerManager(datosCita);
        
        // Ejecutamos el método de la clase para guardar en Oracle respetando la 4FN
        const resultado = await citaManager.guardarEnBaseDeDatos();

        if (resultado.exito) {
            res.status(200).json(resultado);
        } else {
            res.status(400).json(resultado);
        }
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ exito: false, error: error.message });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor del taller corriendo en http://localhost:${PORT}`);
});