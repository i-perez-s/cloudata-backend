const fs = require("fs");
const path = require("path");
const Dir = require("./models/dir");
const File = require("./models/file");

function checkErr(res, err) {
  if (err) {
    return res.status(500).json({
      ok: false,
      err,
    });
  }
}

function borrarImagen(pathFile) {
  let pathData = pathFile;
  if (fs.existsSync(pathData)) {
    console.log("exists");
    fs.unlinkSync(pathData);
  }
}

async function checkErrAndDelete(res, err, pathFile) {
  if (err) {
    await borrarImagen(pathFile);
    return res.status(500).json({
      ok: false,
      err,
    });
  }
}

function correctPath(initalPath) {
  if (initalPath == "home") {
    initalPath = "";
  }
  initalPath = initalPath.replace(/-/g, "/");
  return initalPath;
}

function borrarArchivo(id) {
  File.findByIdAndDelete(id, (err, filedb) => {
    checkErr(res, err);

    try {
      borrarImagen(path.resolve(filedb.path, filedb.nombre));
    } catch (err) {
      return res.json({
        ok: false,
        err,
      });
    }

    return res.json({
      ok: true,
      archivoBorrado: filedb,
    });
  });
}

function deleteDir(res, id) {
  Dir.findById(id, async (err, dirdb) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    } else {
      let pathData = path.resolve(
        dirdb.path.toString(),
        dirdb.nombre.toString()
      );

      var data = { files: [], dirs: [] };

      await Dir.find((err, dirsdb) => {
        checkErr(res, err);

        dirsdb.forEach((dir) => {
          if (dir.path.includes(pathData) == true) {
            data.dirs.push(dir);
          }
        });
      });
      await File.find((err, filesdb) => {
        checkErr(res, err);

        filesdb.forEach((file) => {
          if (file.path.includes(pathData) == true) {
            data.files.push(file);
          }
        });
      });

      console.log(data);

      data.files.forEach((element) => {
        File.findByIdAndDelete(element._id, (err, filedb) => {
          checkErr(res, err);
        });
      });

      data.dirs.forEach((element) => {
        Dir.findByIdAndDelete(element._id, (err, dirdb) => {
          checkErr(res, err);
        });
      });

      Dir.findByIdAndDelete(id, (err, dirDeletedDb) => {
        checkErr(res, err);

        fs.rmdir(
          pathData,
          {
            recursive: true,
          },
          (error) => {
            if (error) {
              return res.status(500).json({
                ok: false,
                error,
              });
            } else {
              return res.json({
                ok: true,
                carpetaBorrada: dirDeletedDb,
              });
            }
          }
        );
      });
    }
  });
}

async function findData(res, pathDir) {
  var data = { files: [], dirs: [] };

  await Dir.find({ path: pathDir }, (err, dirsdb) => {
    checkErr(res, err);
      data.dirs = dirsdb
  });
  await File.find({ path: pathDir }, (err, filesdb) => {
    checkErr(res, err);
      data.files = filesdb
  });


  setTimeout(function () {
    return res.json({
      ok: true,
      carpetas: data.dirs,
      archivos: data.files,
    });
  }, 50);
}


module.exports = {
  checkErr,
  borrarImagen,
  checkErrAndDelete,
  correctPath,
  borrarArchivo,
  deleteDir,
  findData,
};
