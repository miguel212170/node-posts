const User = require('./User')
const Post = require('./Post')


//uno a muchos
Post.belongsTo(User)
User.hasMany(Post)



//muchos a muchos
User.belongsToMany(Post, {through: 'favorites'} )
Post.belongsToMany(User, {through: 'favorites'} )