require('dotenv').config();

module.exports = {
    database: {
        database: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        dialect: process.env.DB_DIALECT,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    },
    server: {
        port: process.env.SERVER_PORT
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        accessExpiresIn: 60 * 60,
        refreshExpiresIn: 60 * 60 * 24
    }
}