const express = require('express');
const app = express()

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { checkErr } = require('../funts')
const User = require('../models/user')

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


app.post('/login', (req, res) => {
    let body = req.body
    User.findOne({ email: body.email }, (err, userdb) => {
        checkErr(res, err)

        if (!userdb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "usuario o contraseña incorrectos"
                }
            })
        }

        if (!bcrypt.compareSync(body.password, userdb.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o contraseña incorrectos"
                }
            })
        }

        let token = jwt.sign({
            usuario: userdb
        }, process.env.SEED, { expiresIn: 60 * 60 * 24 * 30 })

        res.json({
            ok: true,
            usuario: userdb,
            token
        })
    })
})


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
        // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
    }

}


app.post('/google', async(req, res) => {
    let token = req.body.idtoken

    let googleUser = await verify(token)
        .catch(e => {
            res.status(403).json({
                ok: false,
                err: e
            })
        })

    Usuario.findOne({ email: googleUser.email }, (err, usuariodb) => {
        checkErr(res, err)

        if (usuariodb) {
            if (usuariodb.google === false) {
                return res.status(400).json({ ok: false, err: { message: 'debe de usar la autenticacion normal' } })
            } else {
                let token = jwt.sign({
                    usuario: usuariodb
                }, process.env.SEED, { expiresIn: 60 * 60 * 24 * 30 })

                res.json({
                    ok: true,
                    usuario: usuariodb,
                    token
                })
            }
        } else {
            let usuario = new Usuario()

            usuario.nombre = googleUser.nombre
            usuario.email = googleUser.email
            usuario.img = googleUser.img
            usuario.google = true
            usuario.password = ':)'

            usuario.save((err, usuariodb) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                let token = jwt.sign({
                    usuario: usuariodb
                }, process.env.SEED, { expiresIn: 60 * 60 * 24 * 30 })

                res.json({
                    ok: true,
                    usuario: usuariodb,
                    token
                })
            })


        }
    })


})
module.exports = app
