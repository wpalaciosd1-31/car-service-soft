const oracledb = require('oracledb');

const dbConfig = {
    user: "carservice_db",
    password: "taller2026",
    connectionString: "localhost:1521/xepdb1" // ¡Asegúrate de que tenga /xepdb1 y no /xe!
};

async function conectarDB() {
    try {
        let connection = await oracledb.getConnection(dbConfig);
        console.log("¡Conexión exitosa a la Base de Datos Oracle!");
        return connection;
    } catch (err) {
        console.error("Error al conectar:", err);
        throw err;
    }
}

module.exports = { conectarDB };