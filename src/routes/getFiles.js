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
const User = require("../models/user");

const fs = require("fs");
const path = require("path");

app.get("/getMediaFile/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  File.findById(id, (err, filedb) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    console.log(filedb);
    if (!filedb) {
      return res.status(500).json({
        ok: false,
        err: { message: "no existe el archivo solicitado" },
      });
    }

    let pathFile = filedb.path;
    if (fs.existsSync(pathFile)) {
      res.sendFile(pathFile + "/" + filedb.nombre);
    }
  });
});

app.get("/getTextFile/:id", (req, res) => {
  let id = req.params.id;

  File.findById(id, (err, filedb) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    let pathFile = filedb.path;
    if (fs.existsSync(pathFile)) {
      fs.readFile(pathFile + "/" + filedb.nombre, "utf8", (err, data) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        } else {
          console.log(data);
          res.send({
            data: data,
          });
        }
      });
    }
  });
});

module.exports = app;
