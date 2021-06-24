const { errorMonitor } = require('events');
const getDB = require('../../bbdd/db');

const { formatDate } = require('../../helpers');

const editPhoto = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idEntry } = req.params;
        let { description, place } = req.body;

        if (!description && !place) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        const [entry] = await connection.query(
            `SELECT id FROM imagenes WHERE id = ?`,
            [idEntry]
        );

        // Si recibimos "place" o "description" nos quedamos con ese valor,
        // de lo contrario volvemos a asignarles el valor que tenían.
        place = place || entry[0].place;
        description = description || entry[0].description;

        // Fecha de modificación.
        const now = new Date();

        // Actualizamos la entrada.
        await connection.query(
            `UPDATE imagenes SET descripcion = ?, fechaModificacion = ?, puntaje = ?, idUsuario = ? WHERE id = ?;`,
            [description, formatDate(now), rating, idUser, idEntry]
        );

        res.send({
            status: 'ok',
            data: {
                id: idEntry,
                place,
                description,
                modifiedAt: now,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editPhoto;
