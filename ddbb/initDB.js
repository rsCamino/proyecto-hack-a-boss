require('dotenv').config();
const { formatDate } = require('../helpers');

const faker = require('faker/locale/es');

const getDB = require('./db');

let connection;

const main = async () => {
	try {
		connection = await getDB();

		await connection.query('DROP TABLE IF EXISTS usuarios');
		await connection.query('DROP TABLES IF EXISTS establecimientos');
		await connection.query('DROP TABLES IF EXISTS imagenes');
		await connection.query(`DROP TABLES IF EXISTS valoraciones`);
		await connection.query(`DROP TABLES IF EXISTS usuarios_imagenes`);
		console.log('tablas eliminadas');

		await connection.query(`
        CREATE TABLE usuarios(
                id INT PRIMARY KEY AUTO_INCREMENT,
                nombre VARCHAR(70) NOT NULL,
                nickname VARCHAR(70) NOT NULL,
                fotoperfil VARCHAR(150), 
                email VARCHAR(50) UNIQUE,
                fechaCreacion DATETIME NOT NULL,
                modificadoEn DATETIME,
                contraseña VARCHAR(512) NOT NULL,
                activo BOOLEAN DEFAULT false,
                deleted BOOLEAN DEFAULT false,
                role ENUM ("admin","normal") DEFAULT "normal" NOT NULL,
                codigoRegistro VARCHAR(100),
                codigoRecuperacion VARCHAR(100)
                );
                                                
        `);

		console.log('tabla1');
		await connection.query(`
            CREATE TABLE establecimientos(
                id INT PRIMARY KEY AUTO_INCREMENT,
                nombre VARCHAR(70) NOT NULL,
                email VARCHAR(50) UNIQUE,
                contraseña VARCHAR(512) NOT NULL,
                fechaCreacion DATETIME NOT NULL,
                modificadoEn DATETIME,
                deleted BOOLEAN DEFAULT false,
                activo BOOLEAN DEFAULT false,
                descripcion TEXT,
                direccion VARCHAR(100) NOT NULL,
                avatar VARCHAR(50),
                codigoRegistro VARCHAR(100),
                codigoRecuperacion VARCHAR(100)
        );
        `);
		console.log('tabla2');
		await connection.query(`
            CREATE TABLE imagenes(
                id INT PRIMARY KEY AUTO_INCREMENT,
                imagen VARCHAR(50) UNIQUE,
                fechasubida DATETIME NOT NULL,
                descripcion TEXT,
                likes INT DEFAULT 0,
                idEstablecimiento INT,
                idUsuario INT,
                deleted BOOLEAN DEFAULT false 
                
            );
            `);
		console.log('tabla3');
		await connection.query(`
            CREATE TABLE valoraciones(
                id INT PRIMARY KEY AUTO_INCREMENT,
                imagen VARCHAR(50),
                fechavaloracion DATETIME NOT NULL,
                comentario TEXT,
                puntaje VARCHAR(1) NOT NULL,
                idUsuario INT NOT NULL,
                idEstablecimiento INT NOT NULL,
                deleted BOOLEAN DEFAULT false 

            );
            `);

		console.log('tabla4');

		await connection.query(`
        CREATE TABLE usuarios_imagenes(
            id INT PRIMARY KEY AUTO_INCREMENT,
            likes BOOLEAN,
            comentario TEXT,
            fechaCreacion DATETIME NOT NULL,
            idUsuario INT NOT NULL,
            idImagen INT NOT NULL,
            deleted BOOLEAN DEFAULT false 
            );
            `);

		console.log('tabla5');
		console.log('tablas creadas');

		await connection.query(`
        INSERT INTO usuarios (email, contraseña, nombre, nickname, fechaCreacion, activo, role)
        VALUES ("kndy_1987@hotmail.com",
        SHA2("${process.env.ADMIN_PASSWORD}", 512), 
        "Candido Pazos",
        "kandy1987", 
        "${formatDate(new Date())}", 
        true, 
        "admin");
        `);
		console.log('Admin insertado');
		// const usuarios = 10;
		// for (let i = 0; i < usuarios; i++) {
		// 	const now = formatDate(new Date());
		// 	const email = faker.internet.email();
		// 	const contraseña = faker.internet.password();
		// 	const nombre = faker.name.findName();
		// 	const nickname = faker.name.firstName();

		// 	const fechaCreacion = now;
		// 	await connection.query(`
		//     INSERT INTO usuarios(
		//          email, contraseña, nombre, nickname, fechaCreacion,  activo
		//     )
		//     VALUES (
		//         "${email}",
		//         SHA2("${contraseña}", 512),
		//         "${nombre}",
		//         "${nickname}",
		//         "${fechaCreacion}",

		//         true
		//     );`);
		// }
		console.log('usuarios insertados');

		const establecimientos = 5;
		for (let i = 0; i < establecimientos; i++) {
			const now = formatDate(new Date());
			const email = faker.internet.email();
			const contraseña = faker.internet.password();
			const nombre = faker.company.companyName();
			const fechaCreacion = now;
			const direccion = faker.address.cityName();

			await connection.query(`
            INSERT INTO establecimientos(
                email, contraseña, nombre, direccion, fechaCreacion, activo)
                VALUES (
                    "${email}", SHA2("${contraseña}", 512), "${nombre}", "${direccion}", "${fechaCreacion}", true);`);
		}
		console.log('establecimientos insertados');
	} catch (error) {
		console.error(error);
	} finally {
		if (connection) connection.release();
	}
};
main();
