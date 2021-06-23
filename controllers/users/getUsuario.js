const getDB = require('../../ddbb/db');

const getUsuario = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idUsuario } = req.params;

		const [usuario] = await connection.query(
			`SELECT id, nombre, avatar, direccion, email, descripcion, fechaCreacion, modificadoEn FROM establecimientos WHERE id = ?;`,
			[idUsuario]
		);

		if (!usuario[0].descripcion) {
			usuario[0].descripcion = 'No hay descripcion.';
		}
		if (!usuario[0].modificadoEn) {
			usuario[0].modificadoEn =
				'Este usuario nunca se ha editado';
		}

		const usuarioInfo = {
			name: usuario[0].nombre,
			avatar: usuario[0].avatar,
			description: usuario[0].descripcion,
			direction: usuario.direccion,
		};

		if (req.entityAuth.idEstablecimiento === Number(idUsuario)) {
			usuarioInfo.email = usuario[0].email;
			usuarioInfo.modifiedAt = usuario[0].modificadoEn;
			usuarioInfo.createdAt = usuario[0].fechaCreacion;
		}

		res.send({
			status: 'ok',
			data: usuarioInfo,
		});
	} catch (error) {
		console.log(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = getUsuario;
