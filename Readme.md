# Final Proyect by Alfredo Lozano

## De Beers

### Descripcion

De Beers es una aplicacion web diseñada dentro del Bootcamp de ISDI coders Madrid, en la promocion Q4 2023; su diseño y cometido se basa en una redsocial que gira entorno de las cervezas, tanto para crearlas y subirlas a la base de datos, como para añadir las ya existentes a tu base de datos privada y llevar un seguimiento de las cervezas probadas

### Funcionalidades Principales

-Registro de los usuarios y Login de los mismos

La aplicación proporciona un sistema de registro y login para que los usuarios gestionen sus cuentas.

-Listado de Cervezas

Los usuarios acceden a todas las cervezas subidas por la comunidad, donde podran seleccionar la que han probado

-Detalles del producto

Clicando en la imagen los usuarios acederan a los detalles de la misma con una mejor disposicion de los datos y los botones que le permiten agregar la cerveza a su cuenta

### Tecnologia Empleada

- MERN Stack:

  MongoDB con Mongoose (Backend)
  Express (Backend)
  React (Frontend)
  Node (Backend)

-Pruebas:

Todas las funcionalidades están testadas con Jest hasta niveles optimos de produccion.

### Instrucciones de Ejecución

Antes de ejecutar el backend de la aplicación, asegúrese de tener instaladas las siguientes dependencias:

- Node.js: Descargar e instalar Node.js.
- MongoDB: Descargar e instalar MongoDB.

Configuración del Frontend:

1º Clone el repositorio:

`https://github.com/isdi-coders-2023/Alfredo-Lozano-Final-Project-front-202309-mad.git`

2º Navegue al directorio del proyecto:

`cd Alfredo-Lozano-Final-Project-front-202309-mad`

3º Instale las dependencias:

`npm install`

4º Inicie el servidor

`npm run build`
`npm run start:dev`

Con estos pasos, el frontend estará configurado y en ejecución.

### Usuarios

| Método | URL              | Descripción                                                                    |
| ------ | ---------------- | ------------------------------------------------------------------------------ |
| POST   | /users/register  | Registrar un nuevo usuario con campos obligatorios.                            |
| POST   | /users/login     | Autenticar un usuario con nombre de usuario o correo electrónico y contraseña. |
| GET    | /users/:id       | Obtener un usuario por su ID. (Solo puede realizarlo el administrador)         |
| PATCH  | user/addBeer/:id | añade una cerveza a tu array de cervezas probadas                              |
| PATCH  | user/delBeer/:id | elimina una cerveza de tu array de cervezas probadas                           |

### Beer

| Método | URL       | Descripción                                                                      |
| ------ | --------- | -------------------------------------------------------------------------------- |
| GET    | /beer     | Obtener la lista de cervezas disponibles.                                        |
| GET    | /beer/:id | Obtener información detallada sobre una cerveza específica.                      |
| POST   | /beer/:id | Agregar una nueva cerveza a la colección.                                        |
| PATCH  | /beer/:id | Actualizar detalles de una prenda existente. Requiere derechos de administrador. |
|  |
