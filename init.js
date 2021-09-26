const express = require('express');
const cors = require('cors');

exports.init = () => {
    const app = express();

    if (app.get('env') === 'production') {
    };

    app.use(cors());
    app.use(express.json());

    return app;
};