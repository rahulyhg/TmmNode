module.exports = {
  save: function(data, callback) {
    if (data.nob && data.nob != "") {
      data.nob = parseInt(data.nob);
    }
    if (data.getid && data.getid != "") {
      data.getid = sails.ObjectID(data.getid);
    }
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        if (!data._id) {
          db.collection('donor').find({
            donorid: data.donorid
          }).toArray(function(err, data2) {
            if (err) {
              console.log(err);
              callback({
                value: false,
                comment: "Error"
              });
              db.close();
            } else if (data2 && data2.length > 0) {
              data._id = sails.ObjectID();
              data.count = 0;
              db.collection('request').insert(data, function(err, created) {
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
            } else {
              callback({
                value: false,
                comment: "No data found"
              });
              db.close();
            }
          });
        } else {
          var request = sails.ObjectID(data._id);
          delete data._id
          db.collection('request').update({
            _id: request
          }, {
            $set: data
          }, function(err, updated) {
            if (err) {
              console.log(err);
              callback({
                value: false,
                comment: "Error"
              });
              db.close();
            } else if (updated) {
              if (data.status && data.status == "Accept") {
                Donor.getbyid(data, function(respo) {
                  if (respo.value != false) {
                    if (respo.pincode) {
                      db.collection('donor').find({
                        donorid:{
                          $ne:data.donorid
                        },
                        bloodgroup: data.bloodgroup,
                        pincode: respo.pincode,
                        deviceid: {
                          $exists: true
                        }
                      }, {}).toArray(function(err, found) {
                        if (err) {
                          console.log(err);
                          callback({
                            value: false,
                            comment: "Error"
                          });
                          db.close();
                        } else if (found && found[0]) {
                          var abc = [];
                          var i = 0;
                          _.each(found, function(a) {
                            if (a.history && a.history.length > 0) {
                              var months;
                              var d2 = new Date();
                              var d1 = new Date(a.history[a.history.length - 1].date);
                              months = (d2.getFullYear() - d1.getFullYear()) * 12;
                              months -= d1.getMonth() + 1;
                              months += d2.getMonth();
                              var diff = months <= 0 ? 0 : months;
                              if (diff > 3) {
                                Emergency.save({
                                  accepted: false,
                                  requestid: request,
                                  userid: a._id,
                                  name: respo.name,
                                  image: respo.image,
                                  mobile: respo.mobile,
                                  address1: respo.address1,
                                  address2: respo.address2
                                }, function(emer) {});
                                abc.push(a.deviceid);
                                i++;
                              } else {
                                i++;
                              }
                            } else {
                              Emergency.save({
                                accepted: false,
                                requestid: request,
                                userid: a._id,
                                name: respo.name,
                                image: respo.image,
                                mobile: respo.mobile,
                                address1: respo.address1,
                                address2: respo.address2
                              }, function(emer) {});
                              abc.push(a.deviceid);
                              i++;
                            }
                          });
                          if (i == found.length) {
                            var title = "Need Blood";
                            var message = "Please provide blood.";
                            var response = callpush(abc, message, title);
                            if (response == 0) {
                              callback({
                                value: false,
                                comment: "Error in Pushwoosh"
                              });
                            } else {
                              callback({
                                value: true,
                                comment: "Emergency saved"
                              });
                            }
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
                        comment: "Invalid Pincode"
                      });
                      db.close();
                    }
                  } else {
                    callback({
                      value: false,
                      comment: "Donor not found"
                    });
                    db.close();
                  }
                });
              } else {
                callback({
                  value: true,
                  comment: "Request updated"
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
  find: function(data, callback) {
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("request").find().toArray(function(err, found) {
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
  findById: function(data, callback) {
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("request").find({
          getid: sails.ObjectID(data.getid)
        }).toArray(function(err, found) {
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
  //Findlimited
  findlimited: function(data, callback) {
    var newreturns = {};
    newreturns.data = [];
    var check = new RegExp(data.search, "i");
    var pagesize = parseInt(data.pagesize);
    var pagenumber = parseInt(data.pagenumber);
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        callbackfunc1();

        function callbackfunc1() {
          db.collection("request").count({
            pname: {
              '$regex': check
            }
          }, function(err, number) {
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
            db.collection("request").find({
              pname: {
                '$regex': check
              }
            }).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
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
  findone: function(data, callback) {
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("request").find({
          _id: sails.ObjectID(data._id)
        }).toArray(function(err, data2) {
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
  delete: function(data, callback) {
    sails.query(function(err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      db.collection('request').remove({
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

function callpush(reci, mes, title) {
  var message = new sails.gcm.Message();
  var title = title;
  var body = mes;
  message.addNotification('title', title);
  message.addNotification('body', body);
  message.addNotification('sound', true);
  var reg = reci;
  var sender = new sails.gcm.Sender('AIzaSyDphhd4bathBzXJckCNZRvESUtnjdMuWxo');
  sender.send(message, {
    registrationTokens: reg
  }, function(err, response) {
    if (err) {
      return 0;
    } else {
      return 1;
    }
  });
}
