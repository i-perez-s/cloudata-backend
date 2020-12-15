const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema

let usuarioSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'el nombre es necesarop']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'el correo es necesarop']
    },
    password: {
        type: String,
        required: [true, 'la contraseña es necesara']
    },
    img: {
        type: String,
        required: false
    },
    google: {
        type: Boolean,
        required: false,
        default: false
    },
})


usuarioSchema.methods.toJSON = function() {
    let user = this
    let userObject = user.toObject()
    delete userObject.password

    return userObject
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' })

module.exports = mongoose.model('User', usuarioSchema)
