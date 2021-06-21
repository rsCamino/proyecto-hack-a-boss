const getDB = require('../../bbdd/db');

const { formatDate } = require('../../helpers');

const editEstablecimientoPass = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idEstablecimiento } = req.params;
        const { oldPassword, newPassword } = req.body;

        if (req.userAuth.idEstablecimiento !== Number(idEstablecimiento)) {
            const error = new Error(
                'No tienes permisos para editar este establecimiento'
            );
            error.httpStatus = 403;
            throw error;
        }

        // Comprobamos que la contraseña tenga al menos 8 caracteres,
        // de lo contrario...
        if (newPassword.length < 8) {
            const error = new Error(
                'La nueva contraseña debe tener un mínimo de 8 caracteres'
            );
            error.httpStatus = 400;
            throw error;
        }

        // Comprobamos si la contraseña antigua es correcta.
        const [establecimiento] = await connection.query(
            `SELECT id FROM establecimientos WHERE id = ? AND password = SHA2(?, 512);`,
            [idEstablecimiento, oldPassword]
        );

        if (establecimiento.length < 1) {
            const error = new Error('Contraseña incorrecta');
            error.httpStatus = 401;
            throw error;
        }

        // Guardamos la nueva contraseña.
        await connection.query(
            `UPDATE establecimientos SET password = SHA2(?, 512), modifiedAt = ? WHERE id = ?;`,
            [newPassword, formatDate(new Date()), idEstablecimiento]
        );

        res.send({
            status: 'ok',
            message: 'Contraseña actualizada',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editEstablecimientoPass;

