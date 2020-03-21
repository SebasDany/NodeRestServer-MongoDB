const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express();
const path =require('path')

const multer=require('multer')
 
let storage=multer.diskStorage({
    destination:( req, file,cb)=>{
        cb(null,'../subidas')

    },
    filename:(req,file,cb)=>{
        console.log(file)
cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));

    }

})
const upload=multer({storage})

app.post('/subir',upload.single('file'),(req,res)=>{
    //console.log( `Storage ${req.hostname}/${req.file.path}`)
    //console.log(req.file)
    
})

// metodo get que permite obtener los datos de la db
app.get('/obtener-usuario', function(req, res) {
//validacion, cuando se realic la consulata nos muestre todos los datos desde un determinado rango 
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
// definimos que cuando se realice la busqueda en el db solo nos arrollecom respuesta solo los campos que estan declarados
    Usuario.find({}, 'nombre email role  cedula')
        .limit(limite)
        .skip(desde)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //Usuario.count({}, (err, conteo) => {
                res.json(
                   // ok: true,
                    //cuantos: conteo,
                    usuarios

                );
           // });
        });
});
//metodo que nos permite obtener los adtos de una pagina e insertarlo en la db
app.post('/insertar-usuario', function(req, res) {

    let body = req.body;//permite obtener todos los valores del body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),//uso del bcrypt para encryptar laas contraseñas
        role: body.role,
        cedula: body.cedula
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json(
           
            usuario
        );

    });


});
//metodo que permite actualizar los datos de una base de datos
app.put('/actualizar-usuario/:id', function(req, res) {
    let id = req.params.id//permite tomar el parametro y mandarlo en la url
    let body = _.pick(req.body, ['nombre', 'email', 'cedula', 'role',]);

    /* Solucion no eficiente 
    delete body.password;
    delete body.goole;
    */
// permite actualizar la db en el id correspondiente y tambien hacemos uso del run validator como true
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: false }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});
//metodo que permite eliminar un usuario de una base de datos
app.delete('/eliminar-usuario/:id', function(req, res) {
    let id = req.params.id;
//uso del findByIdAndRemove para eliminar el danto segun el id
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
});

module.exports = app;