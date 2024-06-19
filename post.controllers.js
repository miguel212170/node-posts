const catchError = require('../utils/catchError')
const Post = require('../models/Post')
const User = require('../models/User')

// 🌍 Public route
const getAll = catchError(async(req, res) => {
    const results = await Post.findAll({ include: [User] })
    return res.json(results)
})

// 🔐 Private Route
const create = catchError(async(req, res) => {

    const { id } = req.user

    const newPost = {
        ...req.body,
        userId: id
    }

    const result = await Post.create(newPost)
    return res.status(201).json(result)
})


// 🌎 PUBLIC ROUTE
const getOne = catchError(async(req, res) => {
    const { id } = req.params
    const result = await Post.findByPk(id, { include: [User] })
    if(!result) return res.sendStatus(404)
    return res.json(result)
})

// 🔐 Private Route
const remove = catchError(async(req, res) => {

    const { id } = req.params

    // Verify that the post belongs to the user TODO:
    const userId = req.user.id

    const post = await Post.findByPk(id)
    if(post.userId !== userId) {
        return res.sendStatus(401)
    }

    // Delete the post
    const result = await Post.destroy({ where: {id} })

    if(!result) return res.sendStatus(404)
    
    return res.sendStatus(204)
})

// 🔐 Private Route
const update = catchError(async(req, res) => {
    const { id } = req.params

    
    // Verify that the post belongs to the user  TODO:
    const userId = req.user.id

    const post = await Post.findByPk(id)
    if(post.userId !== userId) {
        return res.sendStatus(401)
    }

    // Update the post
    delete req.body.userId

    const result = await Post.update(
        req.body,
        { where: {id}, returning: true }
    )
    if(result[0] === 0) return res.sendStatus(404)
    return res.json(result[1][0])
})

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update
}