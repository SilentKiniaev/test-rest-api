const express = require('express');
const app = express();
const { Sequelize } = require('sequelize');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const sequelize = new Sequelize(config.database);
const User = require('./src/models/user')(sequelize);
const File = require('./src/models/file')(sequelize);
const Token = require('./src/models/token')(sequelize);
const routes = require('./src/routes');

User.hasMany(File);
File.belongsTo(User);

const adapter = {
    sequelize,
    User,
    File,
    Token
};

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use((req, __, next) => {
    req.adapter = adapter;
    next();
});
app.use('/', routes);

(async () => {
    try {
        await sequelize.authenticate()
        .then(async () => { 
            await sequelize.sync({alter: true});
            console.log('Connected to database');
        });
        
        app.listen(config.server.port, () => {
            console.log(`Server ready on port ${config.server.port}`);
        });
    } catch (e) {
        console.log('Server error:', e);
        process.exit(1);
    }
})();