const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const allowCrossOriginRequests = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
};

module.exports = function () {
    const app = express();
    app.rootUrl = '/api/v1';

    // MIDDLEWARE
    app.use(allowCrossOriginRequests);
    app.use(bodyParser.json());
    app.use(bodyParser.raw({ type: 'text/plain' }));  // for the /executeSql endpoint
    app.use(bodyParser.raw({ type: 'image/png' }));
    app.use(bodyParser.raw({ type: 'image/jpeg' }));
    app.use(multer().single('photo'));

    // ROUTES
    require('../app/routes/backdoor.routes')(app);
    require('../app/routes/user.server.routes')(app);
    require('../app/routes/venues.server.routes')(app);
    require('../app/routes/reviews.server.routes')(app);
    require('../app/routes/user.server.photos.routes')(app);
    require('../app/routes/venues.server.photos.routes')(app);

    // DEBUG (you can remove this)
    app.get('/', function (req, res) {
        res.send({ 'message': 'Hello World!' })
    });

    return app;
};
