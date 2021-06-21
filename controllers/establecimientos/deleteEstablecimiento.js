const getDB = require('../../bbdd/db');

const {
    deletePhoto,
    generateRandomString,
    formatDate,
} = require('../../helpers');

const deleteEstablecimiento = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idEstablecimiento } = req.params;

        if (Number(idEstablecimiento) === 1) {
            const error = new Error(
                'El administrador principal no puede ser eliminado'
            );
            error.httpStatus = 403;
            throw error;
        }

        if (
            req.userAuth.idEstablecimiento !== Number(idEstablecimiento) &&
            req.userAuth.role !== 'admin'
        ) {
            const error = new Error(
                'No tienes permisos para eliminar este establecimiento'
            );
            error.httpStatus = 401;
            throw error;
        }

        const [establecimiento] = await connection.query(
            `SELECT avatar FROM establecimientos WHERE id = ?;`,
            [idEstablecimiento]
        );

        if (establecimiento[0].avatar) {
            await deletePhoto(establecimiento[0].avatar);
        }

        // Hacemos un update en la tabla de usuarios.
        await connection.query(
            `
                UPDATE establecimiento
                SET password = ?, name = "[deleted]", avatar = NULL, active = 0, deleted = 1, modifiedAt = ? 
                WHERE id = ?;
            `,
            [generateRandomString(40), formatDate(new Date()), idEstablecimiento]
        );

        res.send({
            status: 'ok',
            message: 'Establecimiento eliminado',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = deleteEstablecimiento;

