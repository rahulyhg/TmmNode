/**
 * config.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {

  uploadFile: function (filename, callback) {
    var id = mongoose.Types.ObjectId();
    var extension = filename.split(".").pop();
    extension = extension.toLowerCase();
    if (extension == "jpeg") {
      extension = "jpg";
    }
    var newFilename = id + "." + extension;

    var writestream = gfs.createWriteStream({
      filename: newFilename
    });
    writestream.on('finish', function () {
      callback(null, {
        name: newFilename
      });
      fs.unlink(filename);
    });

    var imageStream = fs.createReadStream(filename);

    if (extension == "png" || extension == "jpg" || extension == "gif") {
      Jimp.read(filename, function (err, image) {
        if (err) {
          callback(err, null);
        } else {
          if (image.bitmap.width > MaxImageSize || image.bitmap.height > MaxImageSize) {
            image.scaleToFit(MaxImageSize, MaxImageSize).getBuffer(Jimp.AUTO, function (err, imageBuf) {
              var bufferStream = new stream.PassThrough();
              bufferStream.end(imageBuf);
              bufferStream.pipe(writestream);
            });
          } else {
            image.getBuffer(Jimp.AUTO, function (err, imageBuf) {
              var bufferStream = new stream.PassThrough();
              bufferStream.end(imageBuf);
              bufferStream.pipe(writestream);
            });
          }

        }

      });
    } else {
      imageStream.pipe(writestream);
    }


  },
  readUploaded: function (filename, width, height, style, res) {
    res.set({
      'Cache-Control': 'public, max-age=31557600',
      'Expires': new Date(Date.now() + 345600000).toUTCString()
    });
    var readstream = gfs.createReadStream({
      filename: filename
    });
    readstream.on('error', function (err) {
      res.json({
        value: false,
        error: err
      });
    });
    var buf;
    var newNameExtire;
    var bufs = [];
    var proceedI = 0;
    var wi;
    var he;
    readstream.on('data', function (d) {
      bufs.push(d);
    });
    readstream.on('end', function () {
      buf = Buffer.concat(bufs);
      proceed();
    });


    function proceed() {
      proceedI++;
      if (proceedI === 2) {
        Jimp.read(buf, function (err, image) {
          if (err) {
            callback(err, null);
          } else {
            if (style === "contain" && width && height) {
              image.contain(width, height).getBuffer(Jimp.AUTO, writer2);
            } else if (style === "cover" && (width && width > 0) && (height && height > 0)) {
              image.cover(width, height).getBuffer(Jimp.AUTO, writer2);
            } else if ((width && width > 0) && (height && height > 0)) {
              image.resize(width, height).getBuffer(Jimp.AUTO, writer2);
            } else if ((width && width > 0) && !(height && height > 0)) {
              image.resize(width, Jimp.AUTO).getBuffer(Jimp.AUTO, writer2);
            } else {
              image.resize(Jimp.AUTO, height).getBuffer(Jimp.AUTO, writer2);
            }
          }
        });
      }
    }

    function writer2(err, imageBuf) {
      var writestream2 = gfs.createWriteStream({
        filename: newNameExtire,
      });
      var bufferStream = new stream.PassThrough();
      bufferStream.end(imageBuf);
      bufferStream.pipe(writestream2);
      res.send(imageBuf);
    }

    function read2(filename2) {
      var readstream2 = gfs.createReadStream({
        filename: filename2
      });
      readstream2.on('error', function (err) {
        res.json({
          value: false,
          error: err
        });
      });
      readstream2.pipe(res);
    }
    var onlyName = filename.split(".")[0];
    var extension = filename.split(".").pop();
    if ((extension == "jpg" || extension == "png" || extension == "gif") && ((width && width > 0) || (height && height > 0))) {
      //attempt to get same size image and serve
      var newName = onlyName;
      if (width > 0) {
        newName += "-" + width;
      } else {
        newName += "-" + 0;
      }
      if (height) {
        newName += "-" + height;
      } else {
        newName += "-" + 0;
      }
      if (style && (style == "contain" || style == "cover")) {
        newName += "-" + style;
      } else {
        newName += "-" + 0;
      }
      newNameExtire = newName + "." + extension;
      gfs.exist({
        filename: newNameExtire
      }, function (err, found) {
        if (err) {
          res.json({
            value: false,
            error: err
          });
        }
        if (found) {
          read2(newNameExtire);
        } else {
          proceed();
        }
      });
      //else create a resized image and serve
    } else {
      readstream.pipe(res);
    }
    //error handling, e.g. file does not exist
  }
}
