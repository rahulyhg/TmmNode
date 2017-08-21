/**
 * mobilebanner.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
  save: function (data, callback) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else if (db) {
        // console.log("db 16: ", db);
        if (!data._id) {
          data._id = sails.ObjectID();
          db.collection('mobilebanner').insert(data, function (err, created) {
            if (err) {
              console.log(err);
              callback({
                value: false
              });
              db.close();
            } else if (created) {
              callback({
                value: true
              });
              db.close();
            } else {
              callback({
                value: false,
                comment: "Not Created"
              });
              db.close();
            }
          });
        } else {
          var mobilebanner = sails.ObjectID(data._id);
          delete data._id;
          db.collection('mobilebanner').update({
            _id: mobilebanner
          }, {
            $set: data
          }, function (err, updated) {
            if (err) {
              console.log(err);
              callback({
                value: false
              });
              db.close();
            } else if (updated.result.nModified != 0 && updated.result.n != 0) {
              if (data.status == 'Accepted') {
                console.log("in update count", data)
                Donor.findoneAndUpdate(data, callback)
                // console.log("******in update donation count", data, db.collection);
                // db.collection('donor').udpate({
                //   donorid: data.donorid
                // }, {
                //   $inc: {
                //     donationcount: 1
                //   }
                // }).exec(function (err, response) {
                //   console.log("donation count update: ", err, response);
                //   callback(err, response);
                // });

              } else {
                callback({
                  value: true
                });
              }
              db.close();
            } else if (updated.result.nModified == 0 && updated.result.n != 0) {
              callback({
                value: true,
                comment: "Data already updated"
              });
              db.close();
            } else {
              callback({
                value: false,
                comment: "No data found"
              });
              db.close();
            }
          });
        }
      }
    });
  },
  saveAndUpdate: function (data, callback) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else if (db) {
        if (!data._id) {
          data._id = sails.ObjectID();
          db.collection('mobilebanner').insert(data, function (err, created) {
            if (err) {
              console.log(err);
              callback({
                value: false
              });
              db.close();
            } else if (created) {
              callback({
                value: true
              });
              db.close();
            } else {
              callback({
                value: false,
                comment: "Not Created"
              });
              db.close();
            }
          });
        } else {
          var mobilebanner = sails.ObjectID(data._id);
          delete data._id;
          db.collection('mobilebanner').update({
            _id: mobilebanner
          }, {
            $set: data
          }, function (err, updated) {
            if (err) {
              console.log(err);
              callback({
                value: false
              });
              db.close();
            } else if (updated.result.nModified != 0 && updated.result.n != 0) {
              callback({
                value: true
              });
              db.close();
            } else if (updated.result.nModified == 0 && updated.result.n != 0) {
              callback({
                value: true,
                comment: "Data already updated"
              });
              db.close();
            } else {
              callback({
                value: false,
                comment: "No data found"
              });
              db.close();
            }
          });
        }
      }
    });
  },
  findlimited: function (data, callback) {
    var newcallback = 0;
    var newreturns = {};
    newreturns.data = [];
    var check = new RegExp(data.search, "i");
    var pagesize = data.pagesize;
    var pagenumber = data.pagenumber;
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("mobilebanner").count({
          title: {
            '$regex': check
          }
        }, function (err, number) {
          if (number) {
            newreturns.total = number;
            newreturns.totalpages = Math.ceil(number / data.pagesize);
            callbackfunc();
          } else if (err) {
            callback({
              value: false
            });
            db.close();
          } else {
            callback({
              value: false,
              comment: "Count of null"
            });
            db.close();
          }
        });

        function callbackfunc() {
          db.collection("mobilebanner").find({
            title: {
              '$regex': check
            }
          }, {}).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function (err, found) {
            if (err) {
              callback({
                value: false
              });
              console.log(err);
              db.close();
            } else if (found && found[0]) {
              newreturns.data = found;
              callback(newreturns);
              db.close();
            } else {
              callback({
                value: false,
                comment: "No data found"
              });
              db.close();
            }
          });
        }
      }
    });
  },
  find: function (data, callback) {
    var returns = [];
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("mobilebanner").find({}, {}).toArray(function (err, found) {
          if (err) {
            callback({
              value: false
            });
            console.log(err);
            db.close();
          } else if (found && found[0]) {
            callback(found);
            db.close();
          } else {
            callback({
              value: false,
              comment: "No data found"
            });
            db.close();
          }
        });
      }
    });
  },
  findone: function (data, callback) {
    console.log("data in findOne", data)
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("mobilebanner").find({
          "_id": sails.ObjectID(data._id)
        }, {}).toArray(function (err, found) {
          if (err) {
            callback({
              value: false
            });
            console.log(err);
            db.close();
          } else if (found && found[0]) {
            callback(found[0]);
            db.close()
          } else {
            callback({
              value: false,
              comment: "No data found"
            });
            db.close();
          }
        });
      }
    });
  },
  delete: function (data, callback) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      db.collection('mobilebanner').remove({
        _id: sails.ObjectID(data._id)
      }, function (err, deleted) {
        if (deleted) {
          callback({
            value: true
          });
          db.close();
        } else if (err) {
          console.log(err);
          callback({
            value: false
          });
          db.close();
        } else {
          callback({
            value: false,
            comment: "No data found"
          });
          db.close();
        }
      });
    });
  }
};
