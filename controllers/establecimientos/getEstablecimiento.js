const getDB = require('../../bbdd/db');

const getEstablecimiento = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idEstablecimiento } = req.params;
        const { idCurrentEstablecimiento } = req.body;

        const [establecimiento] = await connection.query(
            `SELECT id, name, email, avatar, role, createdAt FROM establecimientos WHERE id = ?;`,
            [idEstablecimiento]
        );

        const establecimientoInfo = {
            name: establecimiento[0].name,
            avatar: establecimiento[0].avatar,
        };

        if (
            establecimiento[0].id === req.userAuth.idEstablecimiento ||
            req.userAuth.role === 'admin'
        ) {
            userInfo.email = establecimiento[0].email;
            userInfo.role = establecimiento[0].role;
            userInfo.createdAt = establecimiento[0].createdAt;
        }

        res.send({
            status: 'ok',
            data: userInfo,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = getEstablecimiento;

