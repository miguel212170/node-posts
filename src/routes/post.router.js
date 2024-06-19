const { getAll, create, getOne, remove, update } = require('../controllers/post.controllers');
const express = require('express');
const {verifyJWT} = require('../utils/verifyJWT')

const routerName = express.Router();

routerName.route('/')
    .get(getAll)
    .post(verifyJWT, create);



routerName.route('/:id')
    .get(getOne)
    .delete(verifyJWT, remove)
    .put(verifyJWT, update);

module.exports = routerName;