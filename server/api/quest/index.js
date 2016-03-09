'use strict';

var express = require('express');
var controller = require('./quest.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();
router.get('/', controller.index);
router.get('/all', auth.isAuthenticated(), controller.getCompletions);
router.get('/:id', auth.isAuthenticated(), controller.getCompletions);
router.post('/', controller.create);
router.put('/:id', auth.isAuthenticated(), controller.complete);
router.patch('/:id', auth.isAuthenticated(), controller.complete);
router.delete('/:id', auth.isAuthenticated(), controller.cancel);

module.exports = router;
