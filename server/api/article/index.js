'use strict';

var express = require('express');
var controller = require('./article.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/summary', controller.indexOnlyTitle);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), auth.hasRole('admin'), controller.create);
router.put('/:id', auth.isAuthenticated(), auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.isAuthenticated(), auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.isAuthenticated(), auth.hasRole('admin'), controller.destroy);

module.exports = router;
