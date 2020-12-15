const express = require('express');
const app = express()

const bcrypt = require('bcrypt');
const User = require('../models/user')

const { verificaToken } = require('../middelwares/authentication')
const { checkErr, correctPath, borrarImagen, borrarArchivo, deleteDir, findData, deleteDirByPath } = require('../funts')

const Dir = require('../models/dir')
const File = require('../models/file')

const fs = require('fs');
const path = require('path');

app.post('/user', (req, res) => {
    let body = req.body

    let user = new User({
	name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10)
    })

    user.save((err, userdb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        } else {
            let pathUserFolder = path.resolve(__dirname, '../../uploads/', userdb._id.toString())
            fs.mkdir(pathUserFolder, (err) => { checkErr(res, err) })
            return res.json({
                ok: true,
                usario: userdb
            })
        }


    })


})

app.get('/users', verificaToken, (req, res) => {
    User.find((err, usersdb) => {
        checkErr(res, err)

        return res.json({
            ok: true,
            usarios: usersdb
        })
    })
})


//lack add delte folders and file, db and fisic
app.delete('/user/:id', verificaToken, async(req, res) => {
    let id = req.params.id

    let pathData = path.resolve(__dirname, '../../uploads', id.toString())

    var data = { files: [], dirs: [] }

    await Dir.find((err, dirsdb) => {
        checkErr(res, err)

        dirsdb.forEach(dir => {
            if (dir.path.includes(pathData) == true) {
                data.dirs.push(dir)
            }
        })
    })
    await File.find((err, filesdb) => {
        checkErr(res, err)

        filesdb.forEach(file => {
            if (file.path.includes(pathData) == true) {
                data.files.push(file)
            }
        })
    })


    data.files.forEach(element => {
        File.findByIdAndDelete(element._id, (err, filedb) => {
            checkErr(res, err)
        })
    })

    data.dirs.forEach(element => {
        Dir.findByIdAndDelete(element._id, (err, dirdb) => {
            checkErr(res, err)
        })
    })

    User.findByIdAndDelete(id, (err, userDeletedDb) => {
        checkErr(res, err)

        fs.rmdir(pathData, {
            recursive: true,
        }, (error) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                })
            } else {
                return res.json({
                    ok: true,
                    usuarioBorrado: userDeletedDb
                })
            }
        });
    })

    res.json({
        ok: true,
        usuario: userDeletedDb
    })
})

module.exports = app
