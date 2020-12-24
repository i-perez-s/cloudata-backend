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

app.post("/shareFileToUser/:idFile/:idUser", verificaToken, (req, res) => {
  let idFile = req.params.idFile;
  let idUser = req.params.idUser;

  File.findByIdAndUpdate(
    idFile,
    { $push: { shared: idUser } },
    { new: true },
    (err, filedb) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!filedb) {
        return res.status(500).json({
          ok: false,
          err: {
            message: "archivo no existente",
          },
        });
      }

      return res.json({
        ok: true,
        filedb,
      });
    }
  );
});

app.post("/shareDirToUser/:idDir/:idUser", verificaToken, (req, res) => {
  let idDir = req.params.idDir;
  let idUser = req.params.idUser;

  console.log(idDir);
  console.log(idUser);
  Dir.findByIdAndUpdate(
    idDir,
    { $push: { shared: idUser } },
    { new: true },
    (err, filedb) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!filedb) {
        return res.status(500).json({
          ok: false,
          err: {
            message: "archivo no existente",
          },
        });
      }

      return res.json({
        ok: true,
        dirrShared: filedb,
      });
    }
  );
});

app.get("/whatIsShared", verificaToken, async (req, res) => {
  let id = req.user._id.toString();
  console.log(id);
  var data = { files: [], dirs: [] };

  await File.find({ shared: { $all: [id] } }, (err, filesdb) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    data.files = filesdb;
  });

  await Dir.find({ shared: { $all: [id] } }, (err, filesdb) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    data.dirs = filesdb;
  });

  setTimeout(function () {
    return res.json({
      ok: true,
      data,
    });
  }, 50);

});

app.get("/dataDirShared/:idDir", async (req, res) => {
  let idDir = req.params.idDir;

  Dir.findById(idDir, async (err, dirdb) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    findData(res,dirdb.path + '\\' + dirdb.nombre);
  });
});

module.exports = app;
