# WepApp del camino de santiago.

-Se trata de una web dónde todos los usuarios registrados podrán compartir sus experiencias por medio de fotos, valoraciones y comentarios sobre la peregrinación del camino de santiago.

-Cada publicación va a contener una descripción
-Cada publicación podrá ser valorada y comentadada por otros usuarios.
-Cada publicación puede o no estar asociada a un sitio de interés.
-También se podrán agregar sitios de interés (hoteles, albergues, hitos, restaurantes, sitios de ocio, etc). Que contendrá una descripción, valoración y nombre del sitio.
-Cada sitio podrá ser valorado y comentado por usuarios.

## Endpoints de los sitios de interés/establecimientos.

-   POST - [/establecimientos] - Crea un establecimiento o punto de interés. ✅
-   GET - [/establecimientos/validate/:registrationCode] - Valida un lugar recién registrado. ✅
-   POST - [/establecimientos/login] - Log in de un lugar recién registrado.✅
-   POST - [/establecimientos/:idEstablecimiento/photos] - Agrega una foto a un lugar.
-   POST - [/establecimientos/:idEstablecimiento/photos/:idPhoto/comments] - Agrega una comentario a una foto de establecimiento.
-   GET - [/establecimientos/:idEstablecimiento/photos/:idPhoto] - Retorna la foto y los comentarios asociados a la foto.
-   DELETE - [/establecimientos/idEstablecimiento/photos/:idPhoto] - Elimina una foto.
-   GET - [/establecimientos/:idEstablecimiento] - Retorna informacion de un lugar concreto. ✅
-   PUT - [/establecimientos/:idEstablecimiento] - Edita (nombre, contacto (numero, email, pagina web), localización y/o foto de perfil) de un lugar.
-   PUT - [/establecimientos/:idEstablecimiento/password] - Edita la contraseña de un lugar.
-   PUT - [/establecimientos/password/recover] - Envia un correo con el codigo de recuperación de contraseña a un email.
-   PUT - [/establecimientos/password/reset] - Cambia la contraseña de un lugar.
-   DELETE - [/establecimientos/:idEstablecimiento] - Dar de baja a un lugar.

## Endpoints del usuario.

-   POST - [/users] - Crea un usuario pendiente de activar.
-   GET - [/users/validate/:registrationCode] - Valida un usuario recien registrado.
-   GET - [/users/:idUser] - Retorna informacion de un usuario concreto.
-   POST - [/users/login] - Logea a un usuario retornando un token.
-   POST - [/users/:idUser/photos] - Agrega una foto a un lugar.
-   POST - [/users/:idUser/photos/:idPhoto/comments] - Agrega un comentario a una foto.
-   GET - [/users/:idUser/photos/:idPhoto] - Retorna la foto y los comentarios asociados a la foto.
-   DELETE - [/users/idEstablecimiento/photos/:idPhoto] - Elimina una foto.
-   PUT - [/users/:idUser] - Edita (nombre, email y/o avatar) un usuario.
-   PUT - [/users/:idUser/password] - Edita la contraseña de un usuario.
-   PUT - [/users/password/recover] - Envia un correo con el codigo de recuperación de contraseña a un email.
-   PUT - [/users/password/reset] - Cambia la contraseña de un usuario.
-   DELETE - [/users/:idUser] - Dar de baja a un usuario.
