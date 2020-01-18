const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-beautiful-unique-validation');

let rolesValidos = {
    values: ['Docente', "Estudiante"],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es requerido']
    },
    cedula: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'Estudiante',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    goole: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;

}


usuarioSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Usuario', usuarioSchema);