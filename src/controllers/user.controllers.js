const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt') // Importar Bycryp
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');

const getAll = catchError(async (req, res) => {
    const results = await User.findAll({include:[Post]});
    return res.json(results);
});

const create = catchError(async (req, res) => {
   
    const hasshedPassword = await bcrypt.hash(req.body.password, 10)
    const result = await User.create({ ...req.body, password: hasshedPassword });
    return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
    const { id } = req.params;
    const result = await User.findByPk(id, {include:[Post]});
    if (!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async (req, res) => {
    const { id } = req.params;
    const result = await User.destroy({ where: { id } });
    if (!result) return res.sendStatus(404);
    return res.sendStatus(204);
});


const update = catchError(async (req, res) => {
    const { id } = req.params;
    delete req.body.password
    delete req.body.email

    const result = await User.update(
        req.body,
        { where: { id }, returning: true }
    );
    if (result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

const login = catchError(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" })

    const isValid = await bcrypt.compareSync(password, user.password)
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    delete user.dataValues.password

    const jwt = require('jsonwebtoken');

    const token = jwt.sign(
        { user }, // payload
        process.env.TOKEN_SECRET, // clave secreta
        { expiresIn: '1d' } // OPCIONAL: Tiempo en el que expira el token
    )

    return res.status(201).json({user, token});
})

const getMe = catchError(async (req, res) => {
    const user = req.user
    return res.json(user)

})

const setPost = catchError(async(req, res) =>{
    const {id} = req.params

    
    //ubicar un usuario
    const user = await User.findByPk(id)
    if(!user) return res.sendstatus(404)
    await user.setPost(req.body)

    const post = user.getPost

    // retornar vista
    return res.json(post)
})






module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    login,
    getMe,
    setPost
}