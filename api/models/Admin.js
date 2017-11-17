module.exports = {
  adminlogin: function (data, callback) {
    if (data.password) {
      data.password = sails.md5(data.password);
    }
    var isWebLogin = true;
    var matchobj = {
      email: data.email,
      password: data.password,
      accesslevel: data.accesslevel,
      $or: [{campnumber:'All'}, {
        camp: data.camp,
        campnumber: data.campnumber
      }],

      status: "enable"
    };

    sails.query(function (err, db) {
      if (err) {
        console.log("error", err);
        callback({
          value: false
        });
      } else if (db) {
        db.collection('admin').find(matchobj, {
          password: 0,
          forgotpassword: 0
        }).toArray(function (err, found) {
          if (err) {
            callback({
              value: false
            });
            console.log(err);
            db.close();
          } else if (found && found[0]) {
            found[0].camp = data.camp;
            found[0].campnumber = data.campnumber;
            callback(found[0]);
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
  save: function (data, callback) {
    if (data.password) {
      data.password = sails.md5(data.password);
    }
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        if (!data._id) {
          db.collection("user").find({
            email: data.email,
            camp: data.camp
          }).toArray(function (err, data2) {
            if (err) {
              console.log(err);
              callback({
                value: false,
                comment: "Error"
              });
              db.close();
            } else if (data2 && data2[0]) {
              callback({
                value: false,
                comment: "User already exists"
              });
              db.close();
            } else {
              data._id = sails.ObjectID();
              db.collection('admin').insert(data, function (err, created) {
                if (err) {
                  console.log(err);
                  callback({
                    value: false,
                    comment: "Error"
                  });
                  db.close();
                } else if (created) {
                  callback({
                    value: true,
                    id: data._id
                  });
                  db.close();
                } else {
                  callback({
                    value: false,
                    comment: "Not created"
                  });
                  db.close();
                }
              });
            }
          });
        } else {
          var admin = sails.ObjectID(data._id);
          delete data._id
          db.collection('admin').update({
            _id: admin
          }, {
            $set: data
          }, function (err, updated) {
            if (err) {
              console.log(err);
              callback({
                value: false,
                comment: "Error"
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
                comment: "Data updated"
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
  find: function (data, callback) {
    if (data.campnumber) {
      var matchobj = {
        campnumber: data.campnumber
      };
    } else {
      var matchobj = {};
    }
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("admin").find(matchobj, {
          password: 0,
          forgotpassword: 0
        }).toArray(function (err, found) {
          if (err) {
            callback({
              value: false
            });
            db.close();
          } else if (found && found[0]) {
            delete found[0].password;
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
  //Findlimited
  findlimited: function (data, callback) {
    var newreturns = {};
    newreturns.data = [];
    var check = new RegExp(data.search, "i");
    var pagesize = parseInt(data.pagesize);
    var pagenumber = parseInt(data.pagenumber);
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        callbackfunc1();

        function callbackfunc1() {
          db.collection("admin").count({
            email: {
              '$regex': check
            }
          }, function (err, number) {
            if (number && number != "") {
              newreturns.total = number;
              newreturns.totalpages = Math.ceil(number / data.pagesize);
              callbackfunc();
            } else if (err) {
              console.log(err);
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
            db.collection("admin").find({
              email: {
                '$regex': check
              }
            }, {
              password: 0,
              forgotpassword: 0
            }).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function (err, found) {
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
      }
    });
  },
  //Findlimited
  findone: function (data, callback) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("admin").find({
          _id: sails.ObjectID(data._id)
        }, {
          password: 0,
          forgotpassword: 0
        }).toArray(function (err, data2) {
          if (err) {
            console.log(err);
            callback({
              value: false
            });
            db.close();
          } else if (data2 && data2[0]) {
            delete data2[0].password;
            callback(data2[0]);
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
  delete: function (data, callback) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      db.collection('admin').remove({
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
