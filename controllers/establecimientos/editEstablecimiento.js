const { id } = require('date-fns/locale');
const getDB = require('../../bbdd/db');
const { savePhoto, deletePhoto, formatDate } = require('../../helpers');

const editEstablecimiento = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idEstablecimiento } = req.params;
        const { name, email } = req.body;

        if (req.userAuth.idEstablecimiento !== Number(idEstablecimiento)) {
            const error = new Error(
                'No tienes permisos para editar este establecimiento'
            );
            error.httpStatus = 403;
            throw error;
        }

        if (!name && !email && !(req.files && req.files.avatar)) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        const [establecimiento] = await connection.query(
            `SELECT email, avatar FROM establecimientos WHERE id = ?`,
            [idEstablecimiento]
        );

        const now = new Date();


        if (req.files && req.files.avatar) {

            if (establecimiento[0].avatar) {
                await deletePhoto(establecimiento[0].avatar);
            }

            const avatarName = await savePhoto(req.files.avatar);

            await connection.query(
                `UPDATE establecimientos SET avatar = ?, modifiedAt = ? WHERE id = ?;`,
                [avatarName, formatDate(now), idEstablecimiento]
            );
        }

        if (email && email !== establecimiento[0].email) {

            const [existingEmail] = await connection.query(
                `SELECT id FROM establecimientos WHERE email = ?;`,
                [email]
            );

            if (existingEmail.length > 0) {
                const error = new Error(
                    'Ya existe un establecimiento con el email proporcionado en la base de datos'
                );
                error.httpStatus = 409;
                throw error;
            }

            await connection.query(
                `UPDATE establecimientos SET email = ?, modifiedAt = ? WHERE id = ?`,
                [email, formatDate(now), idEstablecimiento]
            );
        }

        if (name && establecimiento[0].name !== name) {
            await connection.query(
                `UPDATE establecimientos SET name = ?, modifiedAt = ? WHERE id = ?`,
                [name, formatDate(now), idEstablecimiento]
            );
        }

        res.send({
            status: 'ok',
            message: 'Datos de establecimiento actualizados',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editEstablecimiento;

