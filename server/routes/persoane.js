module.exports = app => {
    'use strict';
    const express         = require('express');
    const persoaneCtrl = require('../controllers/persoaneCtrl')(app.locals.db);
    const router          = express.Router();
  
    router.post('/', persoaneCtrl.create);
    router.put('/', persoaneCtrl.update);
    router.get('/', persoaneCtrl.findAll);
    router.get('/:id', persoaneCtrl.find);
    router.delete('/:id', persoaneCtrl.destroy);
  
    return router;
  };
  