const getDB = require('../../bbdd/db');

const { savePhoto, formatDate } = require('../../helpers');

const addPhoto = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idEntry } = req.params;

        const [newPhoto] = await connection.query(
            `SELECT id FROM imagenes WHERE id = ?;`,
            [idEntry]
        );

        if (newPhoto.length >= 4) {
            const error = new Error('Solo puedes subir 4 fotos por post');
            error.httpStatus = 403;
            throw error;
        }

        let photoName;

        if (req.files && req.files.photo) {
            // Guardamos la foto en el servidor y obtenemos el nombre con el que la guardamos.
            photoName = await savePhoto(req.files.photo);

            // Guardamos la foto.
            await connection.query(
                `INSERT INTO imagenes (descripcion, id, likes, idUsuario,fechasubida VALUES (?, ?, ?, ?, ?);`,
                [photoName, idEntry, likes, idUser, formatDate(new Date())]
            );
        }

        res.send({
            status: 'ok',
            data: {
                photo: photoName,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = addPhoto;
