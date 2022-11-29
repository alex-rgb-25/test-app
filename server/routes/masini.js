module.exports = app => {
    'use strict';
    const express         = require('express');
    const masiniCtrl = require('../controllers/masiniCtrl')(app.locals.db);
    const router          = express.Router();
  
    router.post('/', masiniCtrl.create);
    router.put('/', masiniCtrl.update);
    router.get('/', masiniCtrl.findAll);
    router.get('/:id', masiniCtrl.find);
    router.delete('/:id', masiniCtrl.destroy);
  
    return router;
  };
  