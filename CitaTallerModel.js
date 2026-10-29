const { conectarDB } = require('./database');

class CitaTallerManager {
    constructor(datosCita) {
        this.nombres = datosCita.nombres;
        this.apellidos = datosCita.apellidos;
        this.telefono = datosCita.telefono;
        this.correo = datosCita.correo;
        this.placa = datosCita.placa;
        this.idAgencia = datosCita.idAgencia;
        this.tipoServicio = datosCita.tipoServicio;
        this.fecha = datosCita.fecha;
        this.hora = datosCita.hora;
        this.kilometraje = datosCita.kilometraje;
    }

    // Método orientado a objetos para guardar todo en cascada respetando la 4FN
    async guardarEnBaseDeDatos() {
        let conexion;
        try {
            conexion = await conectarDB();

            // 1. Insertar o verificar el Cliente
            const sqlCliente = `INSERT INTO CLIENTE (Nombres_Contacto, Apellidos_Contacto, Telefono, Correo_Electronico) 
                                VALUES (:nombres, :apellidos, :telefono, :correo)`;
            await conexion.execute(sqlCliente, {
                nombres: this.nombres,
                apellidos: this.apellidos,
                telefono: this.telefono,
                correo: this.correo
            }, { autoCommit: true });

            // Obtenemos el ID del cliente recién creado
            const resCliente = await conexion.execute(
                `SELECT ID_Cliente FROM CLIENTE WHERE Telefono = :telefono`, 
                { telefono: this.telefono }
            );
            const idCliente = resCliente.rows[0][0];

            // 2. Insertar el Vehículo (asociado al cliente)
            // Usamos un bloque try/catch interno por si la placa ya existe en el taller
            try {
                const sqlVehiculo = `INSERT INTO VEHICULO (Placa, ID_Cliente) VALUES (:placa, :idCliente)`;
                await conexion.execute(sqlVehiculo, { placa: this.placa, idCliente: idCliente }, { autoCommit: true });
            } catch (e) {
                // Si el vehículo ya existe, continúa sin detener el proceso
                console.log("El vehículo ya estaba registrado, asociando nueva cita...");
            }

            // 3. Insertar la Cita de Taller transaccional
            const sqlCita = `INSERT INTO CITA_TALLER (Placa, ID_Agencia, Tipo_Servicio, Fecha_Cita, Hora_Cita, Kilometraje) 
                             VALUES (:placa, :idAgencia, :tipoServicio, :fecha, :hora, :kilometraje)`;
            await conexion.execute(sqlCita, {
                placa: this.placa,
                idAgencia: this.idAgencia,
                tipoServicio: this.tipoServicio,
                fecha: this.fecha,
                hora: this.hora,
                kilometraje: this.kilometraje
            }, { autoCommit: true });

            return { exito: true, mensaje: "¡Cita de taller guardada exitosamente en Oracle!" };

        } catch (error) {
            console.error("Error en la clase CitaTallerManager:", error);
            return { exito: false, error: error.message };
        } finally {
            if (conexion) {
                try {
                    await conexion.close(); // Cerramos la conexión por seguridad
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }
}

module.exports = CitaTallerManager;