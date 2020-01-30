const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-beautiful-unique-validation');
//validacion de los roles, si no son esos datos no permitira ingresar en la base de datos
let rolesValidos = {
    values: ['Docente', "Estudiante"],
    message: '{VALUE} no es un rol válido'
};
// creacion del esquema para definir un objeto 
let Schema = mongoose.Schema;
//creacion de los atributos que tendra nuestra usuarios haciendo uso del schema
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true // validacion para que nuestro correo sea unico
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
        default: true //por defaul nos mandara el valor true
    },
    goole: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() {
// validacion para la contraseña 
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;

}

//hecemos que nuestro objeto con atributos se aplique la validacionnmediante el uso de mdulo
usuarioSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Usuario', usuarioSchema);