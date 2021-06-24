const getDB = require('../../bbdd/db');

const { deletePhoto } = require('../../helpers');

const deletePhotos = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idEntry, idPhoto } = req.params;

        const [photo] = await connection.query(
            `SELECT descripcion FROM imagenes WHERE id = ? AND idEntry = ?;`,
            [idPhoto, idEntry]
        );

        if (photo.length < 1) {
            const error = new Error('La foto no existe');
            error.httpStatus = 404;
            throw error;
        }

        // Borramos la foto del servidor.
        await deletePhoto(photo[0].name);

        // Borramos la foto de la base de datos.
        await connection.query(
            `DELETE FROM imagenes WHERE id = ? AND idEntry = ?;`,
            [idPhoto, idEntry]
        );

        res.send({
            status: 'ok',
            message: 'Foto eliminada',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = deletePhotos;
