const { id } = require('date-fns/locale');
const getDB = require('../../bbdd/db');
const { savePhoto, deletePhoto, formatDate } = require('../../helpers');

const editUsuario = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUsuario } = req.params;
        const { name, nickname, email } = req.body;

        if (req.userAuth.idUsuario !== Number(idUsuario)) {
            const error = new Error(
                'No tienes permisos para editar este usuario'
            );
            error.httpStatus = 403;
            throw error;
        }

        if (!name && !nickname && !email && !(req.files && req.files.avatar)) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        const [usuario] = await connection.query(
            `SELECT email, avatar FROM usuarios WHERE id = ?`,
            [idUsuario]
        );

        const now = new Date();

        if (req.files && req.files.avatar) {
            if (usuario[0].avatar) {
                await deletePhoto(usuario[0].avatar);
            }

            const avatarName = await savePhoto(req.files.avatar);

            await connection.query(
                `UPDATE usuarios SET avatar = ?, modifiedAt = ? WHERE id = ?;`,
                [avatarName, formatDate(now), idUsuario]
            );
        }

        if (email && email !== usuario[0].email) {
            const [existingEmail] = await connection.query(
                `SELECT id FROM usuarios WHERE email = ?;`,
                [email]
            );

            if (existingEmail.length > 0) {
                const error = new Error(
                    'Ya existe un usuario con el email proporcionado en la base de datos'
                );
                error.httpStatus = 409;
                throw error;
            }

            await connection.query(
                `UPDATE usuarios SET email = ?, modifiedAt = ? WHERE id = ?`,
                [email, formatDate(now), idUsuario]
            );
        }
        // Pueden tener 2 usuarios el mismo nickname ?//
        if (nickname && nickname !== usuario[0].nickname) {
            await connection.query(
                `UPDATE usuarios SET nickname = ?, modifiedAt = ? WHERE id = ?`,
                [nickname, formatDate(now), idUsuario]
            );
        }

        if (name && usuario[0].name !== name) {
            await connection.query(
                `UPDATE usuarios SET name = ?, modifiedAt = ? WHERE id = ?`,
                [name, formatDate(now), idUsuario]
            );
        }

        res.send({
            status: 'ok',
            message: 'Datos de usuario actualizados',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editUsuario;
