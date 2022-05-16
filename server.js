const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const routes = require('./src/routes');
const { sequelize } = require('./src/models');

app.use(express.json());
app.use(helmet());
app.use(cors());
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