const express = require('express');
const router = express.Router();
const routerUser = require('./user.router')
const routerPost = require('./post.router')
// colocar las rutas aquí

router.use('/users', routerUser)

router.use('/posts', routerPost)

module.exports = router;