const getDB = require('../../ddbb/db');
const { PUBLIC_HOST } = process.env;

const getAllUsers = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const [usuario] = await connection.query(
			`SELECT *  FROM usuarios;`,
			[]
		);

		let usersInfo = [];
		for (let i = 0; i < usuario.length; i++) {
			if (usuario[i].deleted !== 1) {
				usersInfo.push({
					name: usuario[i].nombre,
					nickname: usuario[i].nickname,
					fotoperfil: `${PUBLIC_HOST}/uploads/${usuario[i].fotoperfil}`,
				});
			}
			console.log(usersInfo);

			return res.send({
				status: 'ok',
				usuario: usuario,
			});
		}
		if (usuario.length === 0) {
			res.send({
				status: 'Deleted',
				data: 'No hay usuarios en la base de datos',
			});
		}
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = getAllUsers;
// fotoperfil, nickname, name
