const getDB = require('../../ddbb/db');

const getUsuario = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idUsuario } = req.params;

		const [usuario] = await connection.query(
			`SELECT id, nombre, nickname, fotoperfil, email, fechaCreacion, modificadoEn FROM usuarios WHERE id = ?;`,
			[idUsuario]
		);

		if (usuario[0].deleted === 0) {
			const usuarioInfo = {
				name: usuario[0].nombre,
				nickname: usuario[0].nickname,
				fotoperfil: usuario[0].fotoperfil,
			};

			if (req.authEntity.idUsuario === Number(idUsuario)) {
				usuarioInfo.email = usuario[0].email;
				usuarioInfo.modifiedAt = usuario[0].modificadoEn;
				usuarioInfo.createdAt = usuario[0].fechaCreacion;
			}

			res.send({
				status: 'ok',
				data: usuarioInfo,
			});
		} else {
			res.send({
				status: 'Deleted',
				data: 'Usuario eliminado de la base de datos',
			});
		}
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = getUsuario;
