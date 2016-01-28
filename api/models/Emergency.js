/**
 * emergency.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
  save: function(data, callback) {
    if (data.userid && data.userid != "") {
      data.userid = sails.ObjectID(data.userid);
    }
    if (data.requestid && data.requestid != "") {
      data.requestid = sails.ObjectID(data.requestid);
    }
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else if (db) {
        if (!data._id) {
          data._id = sails.ObjectID();
          db.collection('emergency').insert(data, function(err, created) {
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
          Request.findone({
            _id: sails.ObjectID(data.requestid)
          }, function(respo) {
            if (respo.value != false) {
              console.log(respo.status);
              if (respo.status != "Completed") {
                var emergency = sails.ObjectID(data._id);
                delete data._id;
                db.collection('emergency').update({
                  _id: emergency
                }, {
                  $set: data
                }, function(err, updated) {
                  if (err) {
                    console.log(err);
                    callback({
                      value: false
                    });
                    db.close();
                  } else if (updated) {
                    respo.count = respo.count + 1;
                    var array = [];
                    if (respo.users && respo.users.length > 0) {
                      array = respo.users;
                      array.push(data.userid);
                    } else {
                      array.push(data.userid);
                    }
                    if (respo.nob == respo.count) {
                      respo.status = "Completed";
                      Request.save({
                        _id: sails.ObjectID(respo._id),
                        status: respo.status,
                        count: respo.count,
                        users: array
                      }, function(reqRes) {
                        if (reqRes.value != false) {
                          Donor.getbyid(respo, function(doRespo) {
                            if (doRespo.value != false) {
                              var message = new sails.gcm.Message();
                              var title = "Blood Bank";
                              var body = "Minimum requests accepted";
                              message.addNotification('title', title);
                              message.addNotification('body', body);
                              message.addNotification('sound', true);
                              var reci = [];
                              reci.push(doRespo.deviceid);
                              var sender = new sails.gcm.Sender('AIzaSyDphhd4bathBzXJckCNZRvESUtnjdMuWxo');
                              sender.send(message, {
                                registrationTokens: reci
                              }, function(err, response) {
                                if (err) {
                                  console.log(err);
                                  callback({
                                    value: false,
                                    comment: "Some Error"
                                  });
                                  db.close();
                                } else {
                                  callback({
                                    value: true,
                                    comment: "Request updated"
                                  });
                                  db.close();
                                }
                              });
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
                            comment: "Some Error"
                          });
                          db.close();
                        }
                      });
                    } else {
                      Request.save({
                        _id: sails.ObjectID(respo._id),
                        count: respo.count,
                        users: array
                      }, function(reqRes) {
                        if (reqRes.value != false) {
                          callback({
                            value: true,
                            comment: "Request updated"
                          });
                          db.close();
                        } else {
                          callback({
                            value: false,
                            comment: "Some Error"
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
              } else {
                callback({
                  value: false,
                  comment: "Request Completed"
                });
                db.close();
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
      }
    });
  },
  findlimited: function(data, callback) {
    var newcallback = 0;
    var newreturns = {};
    newreturns.data = [];
    var check = new RegExp(data.search, "i");
    var pagesize = data.pagesize;
    var pagenumber = data.pagenumber;
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("emergency").count({
          title: {
            '$regex': check
          }
        }, function(err, number) {
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
          db.collection("emergency").find({
            title: {
              '$regex': check
            }
          }, {}).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
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
  find: function(data, callback) {
    var returns = [];
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("emergency").find({}, {}).toArray(function(err, found) {
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
  count: function(data, callback) {
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("emergency").count({
          userid: sails.ObjectID(data._id),
          accepted: false
        }, {}, function(err, number) {
          if (number != null) {
            callback(number);
            db.close();
          } else if (number == null) {
            callback(0);
            db.close();
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
  findone: function(data, callback) {
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("emergency").find({
          "_id": sails.ObjectID(data._id)
        }, {}).toArray(function(err, found) {
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
  findByUser: function(data, callback) {
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("emergency").find({
          userid: sails.ObjectID(data.user)
        }, {}).toArray(function(err, found) {
          if (err) {
            callback({
              value: false
            });
            console.log(err);
            db.close();
          } else if (found && found[0]) {
            callback(found);
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
  delete: function(data, callback) {
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      db.collection('emergency').remove({
        _id: sails.ObjectID(data._id)
      }, function(err, deleted) {
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
