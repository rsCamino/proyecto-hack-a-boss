const getDB = require('../../ddbb/db');
const { PUBLIC_HOST } = process.env;

const getUsuario = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idUsuario } = req.params;

		const [usuario] = await connection.query(
			`SELECT id, nombre, nickname, fotoperfil, email, fechaCreacion, modificadoEn FROM usuarios WHERE id = ?;`,
			[idUsuario]
		);

		if (usuario[0].deleted !== 0) {
			const usuarioInfo = {
				name: usuario[0].nombre,
				nickname: usuario[0].nickname,
				fotoperfil: usuario[0].fotoperfil,
			};

			if (req.idUsuario === Number(idUsuario)) {
				usuarioInfo.email = usuario[0].email;
				usuarioInfo.modifiedAt = usuario[0].modificadoEn;
				usuarioInfo.createdAt = usuario[0].fechaCreacion;
			}

			const [photoInfo] = await connection.query(
				`SELECT id, imagen, fechasubida, descripcion, likes
				FROM imagenes
				WHERE deleted != 1 AND idUsuario = ?
				ORDER BY fechasubida `,
				[idUsuario]
			);

			for (let i = 0; i < photoInfo.length; i++) {
				photoInfo[
					i
				].url = `${PUBLIC_HOST}/uploads/${photoInfo[i].imagen}`;
			}

			res.send({
				status: 'ok',
				informacion: usuarioInfo,
				Fotos: photoInfo,
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
