/**
 * User.js
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
        if (!data._id) {
          db.collection('user').find({
            uuid: data.uuid
          }).toArray(function (err, data2) {
            if (err) {
              console.log(err);
              callback({
                value: false,
                comment: "Error"
              });
              db.close();
            } else if (data2 && data2.length > 0) {
              db.collection('user').update({
                _id: sails.ObjectID(data2[0]._id)
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
                } else if (updated) {
                  callback({
                    value: false,
                    id: data2[0]._id
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
            } else {
              data._id = sails.ObjectID();
              db.collection('user').insert(data, function (err, created) {
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
          var user = sails.ObjectID(data._id);
          delete data._id;
          db.collection('user').update({
            _id: user
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
              data.id = user;
              callback({
                value: true,
                data: data
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
    var newreturns = {};
    newreturns.data = [];
    var check = new RegExp(data.search, "i");
    var accesslevel = data.accesslevel;
    var pagesize = parseInt(data.pagesize);
    var pagenumber = parseInt(data.pagenumber);
    var sortnum = parseInt(data.sort);
    var sort = {};
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("user").count({
          name: {
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
          db.collection("user").find({
            name: {
              '$regex': check
            }
          }, {
            password: 0,
            forgotpassword: 0
          }, {
            name: 1
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
    });
  },
  find: function (data, callback) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("user").find({}, {
          password: 0,
          forgotpassword: 0
        }).toArray(function (err, found) {
          if (err) {
            callback({
              value: false
            });
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
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("user").find({
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
      var cuser = db.collection('user').remove({
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
  },
  savenoti: function (data, callback) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("user").find({
          _id: sails.ObjectID(data._id)
        }).toArray(function (err, data2) {
          if (err) {
            console.log(err);
            callback({
              value: false
            });
            db.close();
          } else if (data2 && data2[0]) {
            if (data2[0].notification && data2[0].notification[0]) {
              var i = 0;
              var index = sails._.findIndex(data2[0].notification, function (chr) {
                return chr.notification.toString() == data.notification.toString();
              });
              if (index == -1) {
                var newdata = {};
                var notidata = {};
                notidata.click = 1;
                notidata.notification = data.notification;
                newdata.notification = [];
                newdata.notification = data2[0].notification;
                newdata.notification.push(notidata);
                var user = sails.ObjectID(data._id);
                delete data._id;
                db.collection('user').update({
                  _id: user
                }, {
                  $set: newdata
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
                  } else {
                    callback({
                      value: false,
                      comment: "No data found"
                    });
                    db.close();
                  }
                });
              } else {
                callback({
                  value: false,
                  comment: "Data already updated"
                });
                db.close();
              }
            } else {
              var newdata = {};
              var notidata = {};
              notidata.click = 1;
              notidata.notification = data.notification;
              newdata.notification = [];
              newdata.notification.push(notidata);
              var user = sails.ObjectID(data._id);
              delete data._id;
              db.collection('user').update({
                _id: user
              }, {
                $set: newdata
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
                } else {
                  callback({
                    value: false,
                    comment: "No data found"
                  });
                  db.close();
                }
              });
            }
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
  countnotify: function (data, callback) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: "false"
        });
      }
      if (db) {
        db.collection("notification").count({}, function (err, number) {
          if (number != null) {
            if (data.user) {
              User.findone(data, function (response) {
                if (response.notification && response.notification[0]) {
                  var num = number - response.notification.length;
                  if (num <= 0) {
                    callback(0);
                    db.close();
                  } else {
                    callback(num);
                    db.close();
                  }
                } else {
                  callback(number);
                  db.close();
                }
              });
            } else {
              Donor.findone(data, function (response) {
                if (response.notification && response.notification[0]) {
                  var num = number - response.notification.length;
                  if (num <= 0) {
                    callback(0);
                    db.close();
                  } else {
                    callback(num);
                    db.close();
                  }
                } else {
                  callback(number);
                  db.close();
                }
              });
            }
          } else if (err) {
            callback({
              value: "false",
              comment: "Error"
            });
            db.close();
          } else {
            callback({
              value: "false",
              comment: "No data found"
            });
            db.close();
          }
        });
      }
    });
  },
  saveApp: function (data, callback) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false,
          comment: "Error"
        });
      }
      if (db) {
        User.findone({
          _id: sails.ObjectID(data._id)
        }, function (respo) {
          if (respo.value != false) {
            data.userid = respo._id;
            delete data._id;
            data.notification = respo.notification;
            data.uuid = respo.uuid;
            data.deviceid = respo.deviceid;
            data.platform = respo.platform;
            if (data.lastname && data.lastname != "") {
              data.donationcount = 0;
              data.history = [];
              data.oldbottle = [];
              data.name = data.lastname + " " + data.firstname + " " + data.middlename;
              var splitname = data.lastname.substring(0, 1);
              var letter = splitname;
              splitname = "^" + splitname + "[0-9]";
              var checkname = new RegExp(splitname, "i");
              data._id = sails.ObjectID();
              db.collection('donor').find({
                donorid: {
                  $regex: checkname
                }
              }).sort({
                donorid: -1
              }).limit(1).toArray(function (err, data2) {
                if (err) {
                  console.log(err);
                  callback({
                    value: false,
                    comment: "Error"
                  });
                } else if (data2 && data2[0]) {
                  var regsplit = data2[0].donorid.split(letter);
                  regsplit[1] = parseInt(regsplit[1]);
                  data.donorid = regsplit[1] + 1;
                  data.donorid = data.donorid.toString();
                  if (data.donorid.length == 1) {
                    data.donorid = letter + "0000" + data.donorid;
                  } else if (data.donorid.length == 2) {
                    data.donorid = letter + "000" + data.donorid;
                  } else if (data.donorid.length == 3) {
                    data.donorid = letter + "00" + data.donorid;
                  } else if (data.donorid.length == 4) {
                    data.donorid = letter + "0" + data.donorid;
                  } else {
                    data.donorid = letter + data.donorid;
                  }
                  insertid(data);
                } else {
                  data.donorid = letter + "00001";
                  insertid(data);
                }
              });

              function insertid(data) {
                delete data.bottle;
                db.collection('donor').insert(data, function (err, created) {
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
            } else {
              var donor = sails.ObjectID(data.donor);
              delete data.donor;
              delete data.donationcount;
              delete data.oldbottle;
              delete data.history;
              db.collection('donor').update({
                _id: donor
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
                } else if (updated) {
                  data._id = donor;
                  callback({
                    value: true,
                    id: data._id
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
          } else {
            callback({
              value: false,
              comment: "No data found"
            });
          }
        });
      }
    });
  },
  updateforapp: function (data, callback) {
    if (data.birthdate && data.birthdate != "") {
      data.birthdate = new Date(data.birthdate);
    }
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false,
          comment: "Error"
        });
      } else {
        delete data.donationcount;
        delete data.history;
        delete data.oldbottle;
        var donor = sails.ObjectID(data._id);
        delete data._id;
        db.collection('donor').update({
          _id: donor
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
          } else if (updated) {
            data._id = donor;
            callback({
              value: true
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
    });
  }
};
