const express = require("express");
const app = express();

const {
    checkErr,
    correctPath,
    borrarImagen,
    borrarArchivo,
    deleteDir,
    findData,
} = require("../funts");
const { verificaToken } = require("../middelwares/authentication");

const Dir = require("../models/dir");
const File = require("../models/file");

const fs = require("fs");
const path = require("path");

const fileUpload = require("express-fileupload");
const { findByIdAndDelete } = require("../models/dir");
const file = require("../models/file");
app.use(fileUpload());

app.post("/upload/:path", verificaToken, async(req, res) => {
    if (!req.files) {
        return res.json({
            ok: false,
            err: { message: "sube un archivo" },
        });
    }

    let file = req.files.avatar;
    let pathFileFolder = correctPath(req.params.path);

    var fileName = file.name;
    const pathFile = path.resolve(
        __dirname,
        "../../uploads/",
        req.user._id.toString(),
        pathFileFolder
    );
    if (fs.existsSync(pathFile + "\\" + fileName)) {
        let num = 0;

        do {
            num += 1;

            let ext = fileName.split(".");
            let a = ext.length - 1;
            let extension = ext[a];
            ext.pop();
            ext.push(num.toString());

            var nameWExt = "";
            ext.forEach((element) => {
                console.log(element);
                nameWExt = nameWExt.concat(element.toString());
            });
            nameWExt = nameWExt.concat(".", extension);
            fileName = nameWExt;
        } while (fs.existsSync(pathFile + "\\" + fileName));

        console.log(fileName);
    }
    console.log(pathFile + fileName);
    file.mv(pathFile + "\\" + fileName, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        } else {
            var file = new File({
                nombre: fileName,
                path: pathFile,
                creator: req.user._id,
            });

            file.save((err, filedb) => {
                //checkErrAndDelete(res, err, `${req.user._id.toString()}/${pathFileFolder}/${fileName}`)

                if (err) {
                    borrarImagen(
                        `${req.user._id.toString()}/${pathFileFolder}/${fileName}`
                    );
                    return res.status(500).json({
                        ok: false,
                        err,
                    });
                }

                return res.json({
                    ok: true,
                    archivo: filedb,
                });
            });
        }
    });
});
app.post("/dir/:path/:nameDir", verificaToken, (req, res) => {
    let pathDirFolder = correctPath(req.params.path);
    let pathName = req.params.nameDir.replace("-", "/");
    let name = pathName.split("/");
    name = name[name.length - 1];

    const pathDir = path.resolve(
        __dirname,
        "../../uploads/",
        req.user._id.toString(),
        pathDirFolder,
        pathName
    );
    let pathDb = path.resolve(
        __dirname,
        "../../uploads/",
        req.user._id.toString(),
        pathDirFolder
    );

    fs.mkdir(pathDir, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        } else {
            console.log(pathName);
            var dir = new Dir({
                nombre: name,
                path: pathDb,
                creator: req.user._id,
            });

            dir.save((err, dirdb) => {
                checkErr(res, err);

                return res.json({
                    ok: true,
                    archivo: dirdb,
                });
            });
        }
    });
});

app.get("/getData/:path", verificaToken, async(req, res) => {
    let pathToGet = correctPath(req.params.path);
    let pathDir = path.resolve(
        __dirname,
        "../../uploads",
        req.user._id.toString(),
        pathToGet
    );
    findData(res, pathDir);
});

app.delete("/file/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    borrarArchivo(id);
});

app.delete("/dir/:id", verificaToken, (req, res) => {
    let id = req.params.id;

    deleteDir(res, id);
});

module.exports = app;
