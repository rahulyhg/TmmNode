module.exports = {
  upload: function (req, res) {
    var Jimp = require("jimp");
    // var lwip = require("lwip");
    res.connection.setTimeout(20000000);
    req.connection.setTimeout(20000000);
    req.file("file").upload(function (err, uploadedFiles) {
      if (err) return res.send(500, err);
      _.each(uploadedFiles, function (n) {
        var oldpath = n.fd;
        var source = sails.fs.createReadStream(n.fd);
        n.fd = n.fd.split('\\').pop().split('/').pop();
        var split = n.fd.split('.');
        n.fd = split[0] + "." + split[1].toLowerCase();

        Jimp.read(oldpath, function (err, image) {
          image.resize(1345, Jimp.AUTO).quality(60).write('./bloodimg/' + n.fd);
          sails.fs.unlink(oldpath, function (data) {});
        }).catch(function (err) {
          console.error(err);
        });

        // sails.lwip.open(oldpath, function (err, image) {
        //   if (err) {
        //     console.log(err);
        //   } else {
        //     var dimensions = {};
        //     var height = "";
        //     dimensions.width = image.width();
        //     dimensions.height = image.height();
        //     height = dimensions.height / dimensions.width * 1345;
        //     image.resize(1345, height, "lanczos", function (err, image) {
        //       if (err) {
        //         console.log(err);
        //       } else {
        //         image.toBuffer('jpg', {
        //           quality: 100
        //         }, function (err, buffer) {
        //           if (err) {
        //             console.log(err);
        //           } else {
        //             var dest = sails.fs.createWriteStream('./bloodimg/' + n.fd);
        //             sails.fs.writeFile(dest.path, buffer, function (respo) {
        //               sails.fs.unlink(oldpath, function (data) {});
        //             });
        //           }
        //         });
        //       }
        //     });
        //   }
        // });
        // var dest = sails.fs.createWriteStream('./bloodimg/' + n.fd);
        // source.pipe(dest);
        // source.on('end', function() {
        //     sails.fs.unlink(oldpath, function(data) {
        //         console.log(data);
        //     });
        // });
        // source.on('error', function(err) {
        //     console.log(err);
        // });
      });
      return res.json({
        message: uploadedFiles.length + ' file(s) uploaded successfully!',
        files: uploadedFiles

      });
    });
  },
  upload2: function (req, res) {
    res.connection.setTimeout(20000000);
    req.connection.setTimeout(20000000);
    req.file("file").upload(function (err, uploadedFiles) {
      if (err) return res.send(500, err);
      _.each(uploadedFiles, function (n) {
        var oldpath = n.fd;
        var source = sails.fs.createReadStream(n.fd);
        n.fd = n.fd.split('\\').pop().split('/').pop();
        var split = n.fd.split('.');
        n.fd = split[0] + "." + split[1].toLowerCase();
        sails.lwip.open(oldpath, function (err, image) {
          if (err) {
            console.log(err);
          } else {
            image.resize(1345, 461, "lanczos", function (err, image) {
              if (err) {
                console.log(err);
              } else {
                image.toBuffer('jpg', {
                  quality: 100
                }, function (err, buffer) {
                  if (err) {
                    console.log(err);
                  } else {
                    var dest = sails.fs.createWriteStream('./bloodimg/' + n.fd);
                    sails.fs.writeFile(dest.path, buffer, function (respo) {
                      sails.fs.unlink(oldpath, function (data) {});
                    });
                  }
                });
              }
            });
          }
        });
      });
      return res.json({
        message: uploadedFiles.length + ' file(s) uploaded successfully!',
        files: uploadedFiles

      });
    });
  },
  readFile: function (req, res) {
    if (req.query.file) {
      var width;
      var height;
      if (req.query.width) {
        width = parseInt(req.query.width);
        if (_.isNaN(width)) {
          width = undefined;
        }
      }
      if (req.query.height) {
        height = parseInt(req.query.height);
        if (_.isNaN(height)) {
          height = undefined;
        }
      }
      Config.readUploaded(req.query.file, width, height, req.query.style, res);
    } else {
      res.callback("No Such File Found");
    }

  },
  uploadmob: function (req, res) {
    res.connection.setTimeout(20000000);
    req.connection.setTimeout(20000000);
    req.file("file").upload(function (err, uploadedFiles) {
      if (err) return res.send(500, err);
      _.each(uploadedFiles, function (n) {
        var oldpath = n.fd;
        var source = sails.fs.createReadStream(n.fd);
        n.fd = n.fd.split('\\').pop().split('/').pop();
        var split = n.fd.split('.');
        n.fd = split[0] + "." + split[1].toLowerCase();
        var dest = sails.fs.createWriteStream('./bloodimg/' + n.fd);
        source.pipe(dest);
        source.on('end', function () {
          sails.fs.unlink(oldpath, function (data) {
            console.log(data);
          });
        });
        source.on('error', function (err) {
          console.log(err);
        });
      });
      return res.json(uploadedFiles[0].fd);
    });
  },
  resize: function (req, res) {
    function showimage(path) {
      var image = sails.fs.readFileSync(path);
      var mimetype = sails.mime.lookup(path);
      res.set('Content-Type', mimetype);
      res.send(image);
    }

    function checknewfile(newfilepath, width, height) {
      width = parseInt(width);
      height = parseInt(height);
      newfilenamearr = newfilepath.split(".");
      extension = newfilenamearr.pop();
      var indexno = newfilepath.search("." + extension);
      var newfilestart = newfilepath.substr(0, indexno);
      var newfileend = newfilepath.substr(indexno, newfilepath.length);
      var newfilename = newfilestart + "_" + width + "_" + height + newfileend;
      var isfile2 = sails.fs.existsSync(newfilename);
      if (!isfile2) {
        console.log("in if");
        sails.lwip.open(newfilepath, function (err, image) {
          var dimensions = {};
          dimensions.width = image.width();
          dimensions.height = image.height();
          if (width == 0) {
            width = dimensions.width / dimensions.height * height;
          }
          if (height == 0) {
            height = dimensions.height / dimensions.width * width;
          }
          image.resize(width, height, "lanczos", function (err, image) {
            image.toBuffer(extension, function (err, buffer) {
              sails.fs.writeFileSync(newfilename, buffer);
              showimage(newfilename);
            });
          });
        });
      } else {
        console.log("in else");
        showimage(newfilename);
      }
    }

    var file = req.query.file;
    var filepath = './bloodimg/' + file;
    var newheight = req.query.height;
    var newwidth = req.query.width;
    var isfile = sails.fs.existsSync(filepath);
    if (isfile == false) {
      var path = './bloodimg/noimage.jpg';
      var split = path.substr(path.length - 3);
      var image = sails.fs.readFileSync(path);
      var mimetype = sails.mime.lookup(split);
      res.set('Content-Type', mimetype);
      res.send(image);
    } else {
      if (!newwidth && !newheight) {
        showimage(filepath);
      } else if (!newwidth && newheight) {
        newheight = parseInt(newheight);
        checknewfile(filepath, 0, newheight);
      } else if (newwidth && !newheight) {
        newwidth = parseInt(newwidth);
        checknewfile(filepath, newwidth, 0);
      } else {
        checknewfile(filepath, newwidth, newheight);
      }
    }
  }
};
