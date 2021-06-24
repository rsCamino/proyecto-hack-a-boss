const getDB = require('../../bbdd/db');

const { formatDate } = require('../../helpers');

const resetUsuarioPass = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { recoverCode, newPassword } = req.body;

        if (!recoverCode || !newPassword) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        const [usuario] = await connection.query(
            `SELECT id FROM usuarios WHERE recoverCode = ?;`,
            [recoverCode]
        );

        if (usuario.length < 1) {
            const error = new Error('Código de recuperación incorrecto');
            error.httpStatus = 404;
            throw error;
        }

        await connection.query(
            `UPDATE usuarios SET password = SHA2(?, 512), recoverCode = NULL, modifiedAt = ? WHERE id = ?;`,
            [newPassword, formatDate(new Date()), usuario[0].id]
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

module.exports = resetUsuarioPass;
