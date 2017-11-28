module.exports = {
  removeAck: function (data, callback) {
    // if (!(sails.ObjectID.isValid(DonorData.id) && DonorData.value == true)) {
    //   callback({
    //     value: false
    //   });
    // } else {
      // sails.query(function (err, db) {
      //   if (err) {
      //     console.log(err);
      //     callback({
      //       value: false
      //     });
      //   }
      //   var incobj = {
      //     pendingV: 1,
      //     verify: -1
      //   }
       // if (db) {
         donorid = data.donorid
        data = data.oldbottle;
        //console.log("inside donor fn");
          async.parallel([
            function (callback) {
              
              sails.query(function (err, db) {
            //   console.log("inside 1st parallel");
            //   console.log(data);
              if (err) {
              //  console.log(err);
                callback({
                  value: false
                });
              } else if (db) {
                var incobj = {
                  pendingV: 1,
                  verify: -1
                }
              db.collection('table').findAndModify({
                
                hospitalname: data.hospitalname,
                camp: data.camp,
                campnumber: data.campnumber
              }, {}, {
                $inc: incobj
              }, {
                upsert: true
              }, function (err, newTab) {
                if (err) {
                //  console.log(err);
                 // console.log(newTab);
                  callback({
                    value: false,
                    comment: "Error"
                  });
                } else if (newTab) {
                  //console.log(newTab);
                  Table.findCount(data, function (result) {
                    sails.sockets.blast(data.camp + "_" + data.campnumber, result);
                  });
                  var data2 = _.cloneDeep(data);
                  data2.camp = "All";
                  Table.findCount(data2, function (result) {
                    sails.sockets.blast(data2.camp + "_" + data2.campnumber, result);
                  });
                  callback(null, {
                    value: true,
                    id: donorid
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
            },
           function(callback){
           // var donor = sails.ObjectID(data._id);
            var matchObj = {
              _id: donorid,
              "oldbottle.campnumber":data.campnumber,
              "oldbottle.camp":data.camp,
              "oldbottle.hospitalname":data.hospitalname
            };
            sails.query(function (err, db) {
             // console.log("inside 2nd parallel");
            if (err) {
             // console.log(err);
              callback({
                value: false
              });
            } else if (db) {
             // console.log("inside ",donorid);
            db.collection("donor").find({donorid:donorid}).forEach( function(doc) {
             // console.log(doc);
              var arr = doc.oldbottle;
              var length = arr.length;
              delete doc.verified;
              for (var i = 0; i < length; i++) {
                if(arr[i]["campnumber"] == data.campnumber && arr[i]["camp"] == data.camp && arr[i]["hospitalname"]==data.hospitalname){
                      delete arr[i]["ackdate"];
                      delete arr[i]["verified"];
                      delete arr[i]["giftdone"];
                      
                      db.collection("donor").save(doc, function (data1) {
                       // console.log(data1);
                        callback(null, {
                          value: true,
                          id: donorid
                        });
                      });
                      
                      // z.ackdate = new Date();
                      // z.verified = true;
                }
                //delete arr[i]["withBase"];
              }
              
            });
          }
        });
           // delete data._id;
            //  console.log("inside editdata");
            // console.log(donor);
                            
           }],function (err, data) {
           // console.log("inside 3nd parallel");
            callback(err, data);
          }

          );
  //       }
  //     });
  // //  }
  },
  addDonor: function (data, callback) {
    console.log("inside addDonor");
    async.waterfall([
      function (wfcallback) {
        console.log("inside 1st save callback");
        Donor.save(data, wfcallback);
      },
      function (DonorData, wfcallback) {
        console.log("inside 2nd callback");
        //console.log(Donor);
        if (sails.ObjectID.isValid(DonorData.id) && DonorData.value == true) {
          // sails.query(function (err, db) {
          //   if (err) {
          //     console.log(err);
          //     callback({
          //       value: false
          //     });
          //   }
          //   if (db) {        
          console.log("before findone");
          console.log(data._id);
          Donor.findone({
              _id: DonorData.id
            },
            function (donorData) {
              console.log("inside donor data cond");
              console.log(donorData);
              Donor.acksave(donorData, wfcallback);
            });
          //}
          //});
        }
      },
      function (DonorData, wfcallback) {
        console.log("inside 3rd callback");
        console.log(DonorData);
        if (sails.ObjectID.isValid(DonorData.id) && DonorData.value == true) {

          Donor.findone({
              _id: DonorData.id
            },
            function (donorData) {
              donorData.giftdone = true;
              Donor.giftsave(donorData, wfcallback);
            });
          //   }
          // });
        }
      }

    ], function (err, data) {
      callback(err, data);
    });

  },

  save: function (data, callback) {
    // console.log("inside save function");
    // console.log(data._id);
    if (data.bottle && data.bottle != "") {
      data.bottle = parseInt(data.bottle);
    }
    if (data.oldbottle && data.oldbottle.length > 0) {
      _.each(data.oldbottle, function (y) {
        y.hospital = sails.ObjectID(y.hospital);
      });
    }
    var checknew = data.new;
    data.name = data.lastname + " " + data.firstname + " " + data.middlename;
    var hospitalID = data.hospital;
    if (data.hospital && data.hospital != "") {
      data.hospital = sails.ObjectID(data.hospital);
      var insert = {};
      insert._id = data.hospital;
      Hospital.findone(insert, function (respo) {
        if (respo != false) {

          // console.log("got hospital");
          data.hospitalname = respo.name;
          sails.query(function (err, db) {
            if (err) {
              console.log(err);
              callback({
                value: false
              });
            }
            if (db) {
              //   console.log(!_.isEmpty(data._id));
              console.log(!data._id);
              if (!data._id) {
            //     console.log("got data  id");
                
                check(data);

                function generate(data) {
                  var splitname = sails._.capitalize(data.lastname.substring(0, 1));
                  var letter = splitname;
                  splitname = "^" + splitname + "[0-9]";
                  var checkname = new RegExp(splitname, "i");
                  data.oldbottle = [];
                  var olddata = {};
                  olddata.bottle = data.bottle;
                  olddata.camp = data.camp;
                  olddata.hospital = sails.ObjectID(data.hospital);
                  olddata.hospitalname = data.hospitalname;
                  olddata.campnumber = data.campnumber;
                  data.oldbottle.push(olddata);
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
                }

                function insertid(data) {
                  data.donationcount = 0;
                  data.notexcel = 1;
                  db.collection('donor').insert(data, function (err, created) {
                    if (err) {
                      console.log(err);
                      callback({
                        value: false,
                        comment: "Error"
                      });
                      db.close();
                    } else if (created) {
                      var donor = sails.ObjectID(data._id);
                      blood(donor);
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
                var donor = sails.ObjectID(data._id);
              //  delete data._id;
                if (data.new == 1) {
                  editOldDonor(data);
                } else {
                  check(data);
                }
              }

              function editdonor(data) {
              //  console.log("inside editdonor");
              //  console.log(data._id);
                delete data.donationcount;
                if (data.oldbottle && data.oldbottle.length > 0) {
                  _.each(data.oldbottle, function (y) {
                    if (y.deletedcamp && y.deletedcamp != "" && y.deletedcamp == data.campnumber) {
                      delete y.deletedcamp;
                    }
                    y.hospital = sails.ObjectID(y.hospital);
                  });

                }
                var donor = sails.ObjectID(data._id);
                console.log(data._id);
                delete data._id;
                 console.log("inside editdata");
                 
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
                 //   console.log(updated);
                  } else if (updated.result.nModified != 0 && updated.result.n != 0) {
                    blood(donor);
                  } else if (updated.result.nModified == 0 && updated.result.n != 0) {
                    blood(donor);
                  } else {
                    callback({
                      value: false,
                      comment: "No data found or Some Error"
                    });
                    db.close();
                  }
                });
              }

              function editOldDonor(data) {
                delete data.donationcount;
                delete data.oldbottle;
                delete data.history;
                var donor = sails.ObjectID(data._id);
                //console.log(data._id);
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
                  } else if (updated.result.nModified != 0 && updated.result.n != 0) {
                    callback({
                      value: true,
                      id: donor
                    });
                    db.close();
                  } else if (updated.result.nModified == 0 && updated.result.n != 0) {
                    callback({
                      value: true,
                      id: donor
                    });
                    db.close();
                  } else {
                    callback({
                      value: false,
                      comment: "No data found or Some Error"
                    });
                    db.close();
                  }
                });
              }

              function blood(donor) {
                var bloodData = {};
                bloodData.camp = data.camp;
                bloodData.number = data.bottle;
                bloodData.campnumber = data.campnumber;
                bloodData.hospital = data.hospitalname;
                Blood.deleteBottle(bloodData, function (bloodrespo) {
                  var incobj = {};
                  if (checknew == 0) {
                    incobj = {
                      rejected: -1,
                      pendingV: 1
                    }
                  } else {
                    incobj = {
                      pendingV: 1
                    }
                  }
                  db.collection('table').findAndModify({
                    id: hospitalID.toString(),
                    hospitalname: data.hospitalname,
                    camp: data.camp,
                    campnumber: data.campnumber
                  }, {}, {
                    $inc: incobj
                  }, {
                    upsert: true
                  }, function (err, newTab) {
                    if (err) {
                      console.log(err);
                      callback({
                        value: false,
                        comment: "Error"
                      });
                    } else if (newTab) {
                      Table.findCount(data, function (result) {
                        sails.sockets.blast(data.camp + "_" + data.campnumber, result);
                      });
                      var data2 = _.cloneDeep(data);
                      data2.camp = "All";
                      Table.findCount(data2, function (result) {
                        sails.sockets.blast(data2.camp + "_" + data2.campnumber, result);
                      });
                      callback(null, {
                        value: true,
                        id: donor
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



              function check(data) {
            //     console.log("inside check");
                db.collection("donor").find({
                  campnumber: data.campnumber,
                  bottle: data.bottle,
                  camp: data.camp,
                  hospital: data.hospital
                }).toArray(function (err, data2) {
                  if (err) {
                    console.log(err);
                    callback({
                      value: false
                    });
                    db.close();
                  } else if (data2 && data2[0]) {
                    callback({
                      value: true,
                      comment: "Bottle already exists"
                    });
                    db.close();
                  } else {
                    data.new = 1;
                    console.log("inside check data");
                    console.log(data._id);
                    if (data.donorid) {
                      // console.log("inside data.donorid", data.donorid);
                      if (data.oldbottle && data.oldbottle.length > 0) {
                        var olddata = {};
                        var index = sails._.findIndex(data.oldbottle, {
                          'campnumber': data.campnumber
                        });
                        if (index != -1) {
                          data.oldbottle.splice(index, 1);
                        }
                        olddata.bottle = data.bottle;
                        olddata.camp = data.camp;
                        olddata.hospital = sails.ObjectID(data.hospital);
                        olddata.hospitalname = data.hospitalname;
                        olddata.campnumber = data.campnumber;
                        data.oldbottle.push(olddata);
                        //  console.log("before edit");
                        // console.log(data);
                        editdonor(data);
                      } else {
                        data.oldbottle = [];
                        var olddata = {};
                        olddata.bottle = data.bottle;
                        olddata.camp = data.camp;
                        olddata.hospital = sails.ObjectID(data.hospital);
                        olddata.hospitalname = data.hospitalname;
                        olddata.campnumber = data.campnumber;
                        data.oldbottle.push(olddata);
                        editdonor(data);
                      }
                    } else {
                      generate(data);
                    }
                  }
                });
              }
            }
          });
        } else {
          callback({
            value: false,
            comment: "Hospital id is incorrect"
          });
        }
      });
    } else {
      callback({
        value: false,
        comment: "Hospital id is incorrect"
      });
    }
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
        db.collection("donor").find({}, {
          password: 0
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
      } else if (db) {
        // console.log("inside findone");
        // console.log(data._id);
        db.collection("donor").find({
          _id: sails.ObjectID(data._id)
        }, {}).toArray(function (err, data2) {
          if (err) {
            console.log(err);
            callback({
              value: false
            });
            db.close();
          } else if (data2 && data2[0]) {
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
  findoneAndUpdate: function (data, callback) {
    console.log("in findoneand update", data);
    // var fullname={}
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else if (db) {

        // var newreturns = {};
        // newreturns.data = [];
        // var checklastname = "";
        // var checkmiddlename = "";
        // var checkfirstname = "";
        // if (data.name != "") {
        //   var splitname = data.fullname.split(" ");
        //   data.lastname = splitname[0];
        //   checklastname = new RegExp(data.lastname, "i");
        //   if (splitname[2] != "") {
        //     data.middlename = splitname[2];
        //     checkmiddlename = new RegExp(data.middlename, "i");
        //   }
        //   if (splitname[1] != "") {
        //     data.firstname = splitname[1];
        //     checkfirstname = new RegExp(data.firstname, "i");
        //   }
        // } else {
        //   data.firstname = data.firstname;
        //   data.middlename = data.middlename;
        //   data.lastname = data.lastname;
        //   checkfirstname = new RegExp(data.firstname, "i");
        //   checkmiddlename = new RegExp(data.middlename, "i");
        //   checklastname = new RegExp(data.lastname, "i");
        // }

        // console.log("**********checklastname", checklastname, "checkmiddlename", checkmiddlename, "checkfirstname", checkfirstname)

        // var matchobj = {
        //   firstname: checkfirstname,
        //   middlename: checkmiddlename,
        //   lastname: checklastname
        // };
        // console.log("machobj", matchobj)



        db.collection("donor").find({
          $or: [{
            donorid: data.donorid
          }, {
            // lastname: data.lastname,
            // firstname: data.firstname,
            // middlename: data.middlename,
            name: data.fullname
          }]
        }, {}).toArray(function (err, data2) {
          if (err) {
            console.log(err);
            callback({
              value: false
            });
            db.close();
          } else if (data2 && data2[0]) {
            console.log("in findoneandupdate", data2);
            console.log("in findoneandupdate", data2[0]);
            if (data2[0].history) {
              function paddy(n, p, c) {
                var pad_char = typeof c !== 'undefined' ? c : '0';
                var pad = new Array(1 + p).join(pad_char);
                return (pad + n).slice(-pad.length);
            }
              var arr = data2[0].history.length;
             // console.log(arr);
              var stringObj = data2[0].history[arr - 1].campnumber;
              //console.log(stringObj);
              var strVal = stringObj.split('_');
              var finalval = Number(strVal.pop()) + 1;
               var camp    =  paddy(finalval, 3, 0);
               var campnumberData ="App_Donation_" + camp;
              // console.log("Length", data2[0].history[0].date);
            } else {
              data2[0].history = [];
              var campnumberData ="App_Donation_001" ;
            }
            var updateQuery = {}; // query to inc/dec donationCount
            if (data.updateCount == 'inc') {
              data2[0].donationcount = parseInt(data2[0].donationcount) + 1;
              var newEle = {};
              newEle.date = new Date();
              newEle.campnumber = campnumberData;

              data2[0].history.push(newEle);
              updateQuery = {
                $set: data2[0]
              };
            } else if (data.updateCount == 'dec') {
              data2[0].donationcount = parseInt(data2[0].donationcount) - 1;
              delete data2[0].history;
              updateQuery = {
                $set: data2[0],
                $pop: {
                  'history': -1
                }
              }
            }
            console.log("&&&&&&&", data2[0].history);
            db.collection('donor').update({
              _id: data2[0]._id
            }, updateQuery, function (err, updated) {
              // console.log("****$$$$updated", updated)
              if (err) {
                console.log(err);
                callback({
                  value: false,
                  comment: "Error"
                });
                db.close();
              } else if (updated.result.nModified != 0 && updated.result.n != 0) {
                console.log("something happened 11");
                callback(data2[0]);

              } else if (updated.result.nModified == 0 && updated.result.n != 0) {
                console.log("something happened 22");
                callback(data2[0]);

              } else {
                // callback({
                //   value: false,
                //   comment: "No data found or Some Error"
                // });
                db.close();
              }
            });


            // callback(data2[0]);
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

  findoneAndUpdateForRejected: function (data, callback) {
    console.log("in findoneand update", data);
    // var fullname={}
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else if (db) {

        // var newreturns = {};
        // newreturns.data = [];
        // var checklastname = "";
        // var checkmiddlename = "";
        // var checkfirstname = "";
        // if (data.name != "") {
        //   var splitname = data.fullname.split(" ");
        //   data.lastname = splitname[0];
        //   checklastname = new RegExp(data.lastname, "i");
        //   if (splitname[2] != "") {
        //     data.middlename = splitname[2];
        //     checkmiddlename = new RegExp(data.middlename, "i");
        //   }
        //   if (splitname[1] != "") {
        //     data.firstname = splitname[1];
        //     checkfirstname = new RegExp(data.firstname, "i");
        //   }
        // } else {
        //   data.firstname = data.firstname;
        //   data.middlename = data.middlename;
        //   data.lastname = data.lastname;
        //   checkfirstname = new RegExp(data.firstname, "i");
        //   checkmiddlename = new RegExp(data.middlename, "i");
        //   checklastname = new RegExp(data.lastname, "i");
        // }

        // console.log("**********checklastname", checklastname, "checkmiddlename", checkmiddlename, "checkfirstname", checkfirstname)

        // var matchobj = {
        //   firstname: checkfirstname,
        //   middlename: checkmiddlename,
        //   lastname: checklastname
        // };
        // console.log("machobj", matchobj)



        db.collection("donor").find({
          $or: [{
            donorid: data.donorid
          }, {
            // lastname: data.lastname,
            // firstname: data.firstname,
            // middlename: data.middlename,
            name: data.fullname
          }]
        }, {}).toArray(function (err, data2) {
          if (err) {
            console.log(err);
            callback({
              value: false
            });
            db.close();
          } else if (data2 && data2[0]) {
            console.log("in findoneandupdate", data2);
            console.log("in findoneandupdate", data2[0]);
            var arr = (data2[0].history).length;
            console.log("Length", data2[0].history[0].date);
            data2[0].donationcount = parseInt(data2[0].donationcount) - 1;
            var newEle = {};
            newEle.date = new Date();
            newEle.campnumber = "App_Donation_001";
            data2[0].history.push(newEle)
            console.log("&&&&&&&", data2[0].history)
            db.collection('donor').update({
              _id: data2[0]._id
            }, {
              $set: data2[0]

            }, function (err, updated) {
              // console.log("****$$$$updated", updated)
              if (err) {
                console.log(err);
                callback({
                  value: false,
                  comment: "Error"
                });
                db.close();
              } else if (updated.result.nModified != 0 && updated.result.n != 0) {
                console.log("something happened 11");
                callback(data2[0]);

              } else if (updated.result.nModified == 0 && updated.result.n != 0) {
                console.log("something happened 22");
                callback(data2[0]);

              } else {
                // callback({
                //   value: false,
                //   comment: "No data found or Some Error"
                // });
                db.close();
              }
            });


            // callback(data2[0]);
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


  findlimited: function (data, callback) {
    var newreturns = {};
    newreturns.data = [];
    var checklastname = "";
    var checkmiddlename = "";
    var checkfirstname = "";
    if (data.name != "") {
      var splitname = data.name.split(" ");
      data.lastname = "^" + splitname[0];
      checklastname = new RegExp(data.lastname, "i");
      if (splitname[2] != "") {
        data.middlename = "^" + splitname[2];
        checkmiddlename = new RegExp(data.middlename, "i");
      }
      if (splitname[1] != "") {
        data.firstname = "^" + splitname[1];
        checkfirstname = new RegExp(data.firstname, "i");
      }
    } else {
      data.firstname = "^" + data.firstname;
      data.middlename = "^" + data.middlename;
      data.lastname = "^" + data.lastname;
      checkfirstname = new RegExp(data.firstname, "i");
      checkmiddlename = new RegExp(data.middlename, "i");
      checklastname = new RegExp(data.lastname, "i");
    }
    var check = new RegExp(data.donorid, "i");
    var pagesize = parseInt(data.pagesize);
    var pagenumber = parseInt(data.pagenumber);
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else if (db) {
        if (data.accesslevel == "entry") {
          var matchobj = {
            donorid: check,
            firstname: checkfirstname,
            middlename: checkmiddlename,
            lastname: checklastname,
            campnumber: data.campnumber,
            camp: data.camp,
            pincode: data.pincode,
            mobile: data.mobile,
            new: {
              $ne: 1
            }
          };
        } else {
          var matchobj = {
            donorid: check,
            firstname: checkfirstname,
            middlename: checkmiddlename,
            lastname: checklastname,
            campnumber: data.campnumber,
            camp: data.camp,
            pincode: data.pincode,
            mobile: data.mobile
          };
        }
        if (data.donorid == "") {
          delete matchobj.donorid;
        }
        if (data.firstname == "" || data.firstname.indexOf("undefined") != -1) {
          delete matchobj.firstname;
        }
        if (data.middlename == "" || data.middlename.indexOf("undefined") != -1) {
          delete matchobj.middlename;
        }
        if (data.lastname == "" || data.lastname.indexOf("undefined") != -1) {
          delete matchobj.lastname;
        }
        if (data.campnumber == "" || data.campnumber == "All") {
          delete matchobj.campnumber;
        }
        if (data.camp == "" || data.camp == "All") {
          delete matchobj.camp;
        }
        if (data.pincode == "") {
          delete matchobj.pincode;
        }
        if (data.mobile == "") {
          delete matchobj.mobile;
        }
        callbackfunc1();

        function callbackfunc1() {
          db.collection("donor").count(matchobj, function (err, number) {
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
            db.collection("donor").find(matchobj, {
              password: 0
            }).sort({
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
      }
    });
  },
  findEntry: function (data, callback) {
    var newreturns = {};
    newreturns.data = [];
    var checklastname = "";
    var checkmiddlename = "";
    var checkfirstname = "";
    if (data.name != "") {
      var splitname = data.name.split(" ");
      data.lastname = "^" + splitname[0];
      checklastname = new RegExp(data.lastname, "i");
      if (splitname[2] != "") {
        data.middlename = "^" + splitname[2];
        checkmiddlename = new RegExp(data.middlename, "i");
      }
      if (splitname[1] != "") {
        data.firstname = "^" + splitname[1];
        checkfirstname = new RegExp(data.firstname, "i");
      }
    } else {
      data.firstname = "^" + data.firstname;
      data.middlename = "^" + data.middlename;
      data.lastname = "^" + data.lastname;
      checkfirstname = new RegExp(data.firstname, "i");
      checkmiddlename = new RegExp(data.middlename, "i");
      checklastname = new RegExp(data.lastname, "i");
    }
    var check = new RegExp(data.donorid, "i");
    var pagesize = parseInt(data.pagesize);
    var pagenumber = parseInt(data.pagenumber);
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else if (db) {
        if (data.accesslevel == 'verify') {
          var matchobj = {
            donorid: check,
            firstname: checkfirstname,
            middlename: checkmiddlename,
            lastname: checklastname,
            campnumber: data.campnumber,
            camp: data.camp,
            mobile: data.pincode,
            hospital: sails.ObjectID(data.hospital),
            new: {
              $eq: 1
            },
            bottle: {
              $ne: ""
            },
            verified: {
              $exists: false
            }
          };
        } else {
          var matchobj = {
            donorid: check,
            firstname: checkfirstname,
            middlename: checkmiddlename,
            lastname: checklastname,
            campnumber: data.campnumber,
            camp: data.camp,
            mobile: data.pincode,
            hospital: sails.ObjectID(data.hospital),
            new: {
              $eq: 1
            },
            bottle: {
              $exists: true
            },
            bottle: {
              $ne: ""
            }
          };
        }
        if (data.donorid == "") {
          delete matchobj.donorid;
        }
        if (data.firstname == "" || data.firstname.indexOf("undefined") != -1) {
          delete matchobj.firstname;
        }
        if (data.middlename == "" || data.middlename.indexOf("undefined") != -1) {
          delete matchobj.middlename;
        }
        if (data.lastname == "" || data.lastname.indexOf("undefined") != -1) {
          delete matchobj.lastname;
        }
        if (data.campnumber == "" || data.campnumber == "All") {
          delete matchobj.campnumber;
        }
        if (data.camp == "" || data.camp == "All") {
          delete matchobj.camp;
        }
        if (data.pincode == "") {
          delete matchobj.mobile;
        }
        callbackfunc1();

        function callbackfunc1() {
          db.collection("donor").count(matchobj, function (err, number) {
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
            db.collection("donor").find(matchobj, {
              password: 0
            }).sort({
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
      }
    });
  },
  findVerified: function (data, callback) {
    var newreturns = {};
    newreturns.data = [];
    var checklastname = "";
    var checkmiddlename = "";
    var checkfirstname = "";
    if (data.name != "") {
      var splitname = data.name.split(" ");
      data.lastname = "^" + splitname[0];
      checklastname = new RegExp(data.lastname, "i");
      if (splitname[2] != "") {
        data.middlename = "^" + splitname[2];
        checkmiddlename = new RegExp(data.middlename, "i");
      }
      if (splitname[1] != "") {
        data.firstname = "^" + splitname[1];
        checkfirstname = new RegExp(data.firstname, "i");
      }
    } else {
      data.firstname = "^" + data.firstname;
      data.middlename = "^" + data.middlename;
      data.lastname = "^" + data.lastname;
      checkfirstname = new RegExp(data.firstname, "i");
      checkmiddlename = new RegExp(data.middlename, "i");
      checklastname = new RegExp(data.lastname, "i");
    }
    var check = new RegExp(data.donorid, "i");
    var pagesize = parseInt(data.pagesize);
    var pagenumber = parseInt(data.pagenumber);
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else if (db) {
        if (data.accesslevel == 'gift') {
          var matchobj = {
            donorid: check,
            firstname: checkfirstname,
            middlename: checkmiddlename,
            lastname: checklastname,
            campnumber: data.campnumber,
            camp: data.camp,
            mobile: data.pincode,
            verified: {
              $eq: true
            },
            giftdone: {
              $exists: false
            }
          };
        } else {
          var matchobj = {
            donorid: check,
            firstname: checkfirstname,
            middlename: checkmiddlename,
            lastname: checklastname,
            campnumber: data.campnumber,
            camp: data.camp,
            mobile: data.pincode,
            hospital: sails.ObjectID(data.hospital),
            verified: {
              $eq: true
            }
          };
        }
        if (data.donorid == "") {
          delete matchobj.donorid;
        }
        if (data.firstname == "" || data.firstname.indexOf("undefined") != -1) {
          delete matchobj.firstname;
        }
        if (data.middlename == "" || data.middlename.indexOf("undefined") != -1) {
          delete matchobj.middlename;
        }
        if (data.lastname == "" || data.lastname.indexOf("undefined") != -1) {
          delete matchobj.lastname;
        }
        if (data.campnumber == "" || data.campnumber == "All") {
          delete matchobj.campnumber;
        }
        if (data.camp == "" || data.camp == "All") {
          delete matchobj.camp;
        }
        if (data.pincode == "") {
          delete matchobj.mobile;
        }
        callbackfunc1();

        function callbackfunc1() {
          db.collection("donor").count(matchobj, function (err, number) {
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
            db.collection("donor").find(matchobj, {
              password: 0
            }).sort({
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
      }
    });
  },
  findGifted: function (data, callback) {
    var newreturns = {};
    newreturns.data = [];
    var checklastname = "";
    var checkmiddlename = "";
    var checkfirstname = "";
    if (data.name != "") {
      var splitname = data.name.split(" ");
      data.lastname = "^" + splitname[0];
      checklastname = new RegExp(data.lastname, "i");
      if (splitname[2] != "") {
        data.middlename = "^" + splitname[2];
        checkmiddlename = new RegExp(data.middlename, "i");
      }
      if (splitname[1] != "") {
        data.firstname = "^" + splitname[1];
        checkfirstname = new RegExp(data.firstname, "i");
      }
    } else {
      data.firstname = "^" + data.firstname;
      data.middlename = "^" + data.middlename;
      data.lastname = "^" + data.lastname;
      checkfirstname = new RegExp(data.firstname, "i");
      checkmiddlename = new RegExp(data.middlename, "i");
      checklastname = new RegExp(data.lastname, "i");
    }
    var check = new RegExp(data.donorid, "i");
    var pagesize = parseInt(data.pagesize);
    var pagenumber = parseInt(data.pagenumber);
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else if (db) {
        var matchobj = {
          donorid: check,
          firstname: checkfirstname,
          middlename: checkmiddlename,
          lastname: checklastname,
          campnumber: data.campnumber,
          camp: data.camp,
          mobile: data.pincode,
          giftdone: {
            $eq: true
          }
        };
        if (data.donorid == "") {
          delete matchobj.donorid;
        }
        if (data.firstname == "" || data.firstname.indexOf("undefined") != -1) {
          delete matchobj.firstname;
        }
        if (data.middlename == "" || data.middlename.indexOf("undefined") != -1) {
          delete matchobj.middlename;
        }
        if (data.lastname == "" || data.lastname.indexOf("undefined") != -1) {
          delete matchobj.lastname;
        }
        if (data.campnumber == "" || data.campnumber == "All") {
          delete matchobj.campnumber;
        }
        if (data.camp == "" || data.camp == "All") {
          delete matchobj.camp;
        }
        if (data.pincode == "") {
          delete matchobj.mobile;
        }
        callbackfunc1();

        function callbackfunc1() {
          db.collection("donor").count(matchobj, function (err, number) {
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
            db.collection("donor").find(matchobj, {
              password: 0
            }).sort({
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
      }
    });
  },
  chageNaN: function (data, callback) {
    sails.query(function (err, db) {
      Donor.fin
    });
  },
  delete: function (data, callback) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else if (db) {
        Donor.findone(data, function (findrespo) {
          if (!findrespo.value) {
            var bottleNum = "";
            bottleNum = findrespo.bottle;
            findrespo.bottle = "";
            if (data.deletereason) {
              findrespo.deletereason = data.deletereason;
            }
            if (data.reason) {
              findrespo.reason = data.reason;
            }
            if (findrespo.oldbottle && findrespo.oldbottle.length > 0) {
              _.each(findrespo.oldbottle, function (y) {
                if (y.campnumber == data.campnumber) {
                  delete y.bottle;
                  y.deletedcamp = data.campnumber;
                }
                y.hospital = sails.ObjectID(y.hospital);
              });
            }
            var hospitalID = findrespo.hospital;
            findrespo.new = 0;
            delete data.donationcount;
            delete findrespo.donationcount;
            db.collection('donor').update({
              _id: sails.ObjectID(findrespo._id)
            }, {
              $set: findrespo
            }, function (err, updated) {
              if (updated) {
                var newdata = {};
                newdata.number = bottleNum;
                newdata.hospital = findrespo.hospitalname;
                newdata.camp = findrespo.camp;
                newdata.campnumber = findrespo.campnumber;
                newdata.used = "Unused";
                newdata.reason = findrespo.deletereason;
                Blood.save(newdata, function (respoblood) {
                  db.collection('table').findAndModify({
                    id: hospitalID.toString(),
                    hospitalname: findrespo.hospitalname,
                    camp: findrespo.camp,
                    campnumber: findrespo.campnumber
                  }, {}, {
                    $inc: {
                      rejected: 1,
                      pendingV: -1
                    }
                  }, function (err, newTab) {
                    if (err) {
                      console.log(err);
                      callback({
                        value: false,
                        comment: "Error"
                      });
                    } else if (newTab) {
                      Table.findCount(findrespo, function (result) {
                        sails.sockets.blast(findrespo.camp + "_" + findrespo.campnumber, result);
                      });
                      var data2 = _.cloneDeep(findrespo);
                      data2.camp = "All";
                      Table.findCount(data2, function (result) {
                        sails.sockets.blast(data2.camp + "_" + data2.campnumber, result);
                      });
                      callback({
                        value: true,
                        comment: "Donor deleted"
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
  lastbottlenumber: function (data, callback) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false,
          comment: "Error"
        });
      } else if (db) {
        db.collection('donor').find({
          bottle: {
            $ne: ""
          },
          camp: data.camp,
          campnumber: data.campnumber,
          hospital: sails.ObjectID(data.hospital)
        }, {
          _id: 0,
          bottle: 1
        }).sort({
          bottle: -1
        }).limit(1).toArray(function (err, data2) {
          if (err) {
            console.log(err);
            callback({
              value: false,
              comment: "Error"
            });
            db.close();
          } else if (data2 && data2[0]) {
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
  countdonor: function (data, callback) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: "false"
        });
      }
      if (db) {
        db.collection("donor").count({}, function (err, number) {
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
  countentry: function (data, callback) {
    var matchobj = {
      camp: data.camp,
      campnumber: data.campnumber,
      new: {
        $eq: 1
      },
      bottle: {
        $ne: ""
      }
    };
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: "false"
        });
      }
      if (db) {
        db.collection("donor").count(matchobj, function (err, number) {
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
  countverified: function (data, callback) {
    var matchobj = {
      camp: data.camp,
      campnumber: data.campnumber,
      bottle: {
        $ne: ""
      },
      verified: {
        $eq: true
      }
    };
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: "false"
        });
      }
      if (db) {
        db.collection("donor").count(matchobj, function (err, number) {
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
  countdeleted: function (data, callback) {
    var matchobj = {
      camp: data.camp,
      campnumber: data.campnumber,
      bottle: {
        $eq: ""
      }
    };
    if (data.camp == "" || data.camp == "All") {
      delete matchobj.camp;
    }
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: "false"
        });
      }
      if (db) {
        db.collection("donor").count(matchobj, function (err, number) {
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
  countgifted: function (data, callback) {
    var matchobj = {
      camp: data.camp,
      campnumber: data.campnumber,
      bottle: {
        $ne: ""
      },
      verified: {
        $eq: true
      },
      giftdone: {
        $eq: true
      }
    };
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: "false"
        });
      }
      if (db) {
        db.collection("donor").count(matchobj, function (err, number) {
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
  acksave: function (data, callback) {
    // console.log("inside acksave");
    // console.log(data);
    if (data.bottle && data.bottle != "") {
      data.bottle = parseInt(data.bottle);
    }
    delete data.donationcount;
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false,
          comment: "Error"
        });
      } else if (db) {
        Donor.findone(data, function (userrespo) {
          if (userrespo.value != false) {
            if (userrespo.history && userrespo.history.length > 0 && userrespo.donationcount && userrespo.donationcount > 0) {
              data.donationcount = userrespo.donationcount + 1;
              data.history = userrespo.history;
              var obj = {};
              obj.date = new Date();
              obj.campnumber = data.campnumber;
              data.history.push(obj);
            } else {
              data.donationcount = 1;
              data.history = [];
              var obj = {};
              obj.date = new Date();
              obj.campnumber = data.campnumber;
              data.history.push(obj);
            }
            data.oldbottle = userrespo.oldbottle;
            var i = 0;
            _.each(data.oldbottle, function (z) {
              z.hospital = sails.ObjectID(z.hospital);
              if (z.bottle == data.bottle && z.campnumber == data.campnumber) {
                z.ackdate = new Date();
                z.verified = true;
              }
              i++;
              if (i == data.oldbottle.length) {
                calledit();
              }
            });
            var hospitalID = userrespo.hospital;

            function calledit() {
              //console.log("inside calledit acksave");
              var donor = sails.ObjectID(data._id);
              delete data._id;
              db.collection('donor').update({
                _id: donor,
                verified: {
                  $ne: true
                }
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
                  db.collection('table').findAndModify({
                    id: hospitalID.toString(),
                    hospitalname: data.hospitalname,
                    camp: data.camp,
                    campnumber: data.campnumber
                  }, {}, {
                    $inc: {
                      verify: 1,
                      pendingG: 1,
                      pendingV: -1
                    }
                  }, function (err, newTab) {
                    if (err) {
                      console.log(err);
                      callback({
                        value: false,
                        comment: "Error"
                      });
                    } else if (newTab) {
                      Table.findCount(data, function (result) {
                        sails.sockets.blast(data.camp + "_" + data.campnumber, result);
                      });
                      var data2 = _.cloneDeep(data);
                      data2.camp = "All";
                      Table.findCount(data2, function (result) {
                        sails.sockets.blast(data2.camp + "_" + data2.campnumber, result);
                      });
                      callback(null, {
                        id: donor,
                        value: true
                      });
                      db.close();
                      if (data.mobile && data.mobile != "") {
                        sails.request.get({
                          // url: "http://esms.mytechnologies.co.in/sendsms.jsp?user=" + sails.smsUsername + "&password=" + sails.smsPassword + "&mobiles=" + data.mobile + "&senderid=TMMBLD&sms=Thank you for donating Blood. Your gesture will go a long way in saving 5 Precious Lives. Regards, TMM."
                        }, function (err, httpResponse, body) {});
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
                    comment: "No data found"
                  });
                  db.close();
                }
              });
            }
          } else {
            callback({
              value: false,
              comment: "No Donor found"
            });
            db.close();
          }
        });
      }
    });
  },
  giftsave: function (data, callback) {
    if (data.bottle && data.bottle != "") {
      data.bottle = parseInt(data.bottle);
    }
    delete data.donationcount;
    Donor.findone(data, function (userrespo) {
      if (userrespo.value != false) {
        sails.query(function (err, db) {
          if (err) {
            console.log(err);
            callback({
              value: false,
              comment: "Error"
            });
          } else if (db) {
            var i = 0;
            _.each(data.oldbottle, function (z) {
              z.hospital = sails.ObjectID(z.hospital);
              if (z.bottle == data.bottle && z.campnumber == data.campnumber && z.verified == true) {
                z.giftdone = data.giftdone;
              }
              i++;
              if (i == data.oldbottle.length) {
                callgift();
              }
            });

            function callgift() {
              var donor = sails.ObjectID(data._id);
              delete data._id;
              db.collection('donor').update({
                _id: donor,
                giftdone: {
                  $exists: false
                }
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
                  var incobj = {};
                  if (data.giftdone == true) {
                    incobj = {
                      gift: 1,
                      pendingG: -1
                    }
                  } else {
                    incobj = {
                      giftRejected: 1,
                      pendingG: -1
                    }
                  }
                  var hospitalID = userrespo.hospital;
                  db.collection('table').findAndModify({
                    id: hospitalID.toString(),
                    hospitalname: data.hospitalname,
                    camp: data.camp,
                    campnumber: data.campnumber
                  }, {}, {
                    $inc: incobj
                  }, function (err, newTab) {
                    if (err) {
                      console.log(err);
                      callback({
                        value: false,
                        comment: "Error"
                      });
                      db.close();
                    } else if (newTab) {
                      Table.findCount(data, function (result) {
                        sails.sockets.blast(data.camp + "_" + data.campnumber, result);
                      });
                      var data2 = _.cloneDeep(data);
                      data2.camp = "All";
                      Table.findCount(data2, function (result) {
                        sails.sockets.blast(data2.camp + "_" + data2.campnumber, result);
                      });
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
                    comment: "No data found"
                  });
                  db.close();
                }
              });
            }
          }
        });
      } else {
        callback({
          value: false,
          comment: "No data found"
        });
      }
    });
  },
  saveExcel: function (data, callback) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else if (db) {
        data._id = sails.ObjectID();
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
    });
  },
  update: function (data, callback) {
    console.log("in update ", data)
    if (data.me) {
      data.donationcount = parseInt(data.donationcount);
    } else if (data.donorid) {
      callme();
    } else {
      delete data.donationcount;
    }
    var i = 0;
    if (data.oldbottle && data.oldbottle.length > 0) {
      _.each(data.oldbottle, function (y) {
        y.hospital = sails.ObjectID(y.hospital);
        i++;
        if (i == data.oldbottle.length) {
          callme();
        }
      });
    } else {
      callme();
    }

    function callme() {
      sails.query(function (err, db) {
        if (err) {
          console.log(err);
          callback({
            value: false
          });
        } else if (db) {
          db.collection('donor').update({
            donorid: data.donorid
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
                value: true,
                comment: "Donor updated"
              });
              db.close();
            } else if (updated.result.nModified == 0 && updated.result.n != 0) {
              callback({
                value: true,
                comment: "Donor updated"
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
  },
  getbyid: function (data, callback) {
    var check = new RegExp(data.donorid, "i");
    var matchobj = {
      donorid: {
        $regex: check
      }
    };
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("donor").find(matchobj, {
          password: 0
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
  getforexcel: function (data, callback) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("donor").find({
          donorid: data.donorid
        }, {
          password: 0
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
  saveforapp: function (data, callback) {
    delete data.hospital;
    delete data.camp;
    delete data.bottle;
    delete data.campnumber;
    //delete data.donationcount;
    delete data.oldbottle;
    delete data.history;
    data.name = data.lastname + " " + data.firstname + " " + data.middlename;
    var splitname = data.lastname.substring(0, 1);
    var letter = splitname;
    splitname = "^" + splitname + "[0-9]";
    var checkname = new RegExp(splitname, "i");
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else if (db) {
        if (!data._id) {
          console.log(checkname)
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
              console.log(data2);
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
          //delete data.donationcount;
          if (data.oldbottle && data.oldbottle.length > 0) {
            _.each(data.oldbottle, function (y) {
              y.hospital = sails.ObjectID(y.hospital);
            });
          }
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
              callback({
                value: true,
                comment: "Donor updated"
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
  deleteDonor: function (data, callback) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else if (db) {
        db.collection('donor').remove({
          _id: sails.ObjectID(data._id)
        }, function (err, deleted) {
          if (deleted) {
            callback({
              value: true,
              comment: "Donor deleted"
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
      }
    });
  },
  deletealluser: function (data, callback) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: "false"
        });
      }
      db.collection('donor').remove({}, function (err, deleted) {
        if (deleted) {
          db.collection('village').remove({}, function (err, deleted1) {
            if (deleted1) {
              callback({
                value: true
              });
              db.close();
            } else if (err) {
              console.log(err);
              callback({
                value: "false"
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
        } else if (err) {
          console.log(err);
          callback({
            value: "false"
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
    });
  },
  deletedata: function (data, callback) {
    var i = 0;
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else if (db) {
        db.collection('donor').find({
          donorid: data.donorid
        }).toArray(function (err, found) {
          if (found && found.length > 0) {
            if (found[0].oldbottle && found[0].oldbottle.length > 0) {
              var index = sails._.findIndex(found[0].oldbottle, function (chr) {
                return chr.campnumber == data.campnumber;
              });
              if (index != -1) {
                found[0].oldbottle.splice(index, 1);
                i++;
                if (i == 2) {
                  callfunc();
                }
              } else {
                i++;
                if (i == 2) {
                  callfunc();
                }
              }
              var histindex = sails._.findIndex(found[0].oldbottle, function (chr) {
                return chr.campnumber == data.campnumber;
              });
              if (histindex != -1) {
                found[0].oldbottle.splice(histindex, 1);
                i++;
                if (i == 2) {
                  callfunc();
                }
              } else {
                i++;
                if (i == 2) {
                  callfunc();
                }
              }

              function callfunc() {
                Donor.update(found[0], function (respon) {
                  if (respon != false) {
                    callback({
                      value: true,
                      comment: "History updated"
                    });
                    db.close();
                  } else {
                    callback({
                      value: false,
                      comment: "Error"
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
      }
    });
  },
  findforapp: function (data, callback) {
    var checklastname = "";
    var checkmiddlename = "";
    var checkfirstname = "";
    data.firstname = "^" + data.firstname;
    data.middlename = "^" + data.middlename;
    data.lastname = "^" + data.lastname;
    checkfirstname = new RegExp(data.firstname, "i");
    checkmiddlename = new RegExp(data.middlename, "i");
    checklastname = new RegExp(data.lastname, "i");
    var check = new RegExp(data.donorid, "i");
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else if (db) {
        var matchobj = {
          donorid: check,
          firstname: checkfirstname,
          middlename: checkmiddlename,
          lastname: checklastname,
        };
        if (data.donorid == "") {
          delete matchobj.donorid;
        }
        if (data.firstname == "") {
          delete matchobj.firstname;
        }
        if (data.middlename == "") {
          delete matchobj.middlename;
        }
        if (data.lastname == "") {
          delete matchobj.lastname;
        }
        callbackfunc()

        function callbackfunc() {
          db.collection("donor").find(matchobj, {
            _id: 1,
            name: 1,
            mobile: 1,
            image: 1
          }).sort({
            name: 1
          }).toArray(function (err, found) {
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
      }
    });
  },
  savenoti: function (data, callback) {
    delete data.hospital;
    delete data.camp;
    delete data.bottle;
    delete data.campnumber;
    delete data.donationcount;
    delete data.oldbottle;
    delete data.history;
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      }
      if (db) {
        db.collection("donor").find({
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
                var donor = sails.ObjectID(data._id);
                delete data._id;
                delete newdata.donationcount;
                db.collection('donor').update({
                  _id: donor
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
              var donor = sails.ObjectID(data._id);
              delete data._id;
              delete newdata.donationcount;
              db.collection('donor').update({
                _id: donor
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
  mergeDonors: function (data, callback) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false,
          comment: "Error"
        });
      } else {
        Donor.getforexcel({
          donorid: data.from
        }, function (fromRespo) {
          if (fromRespo.value != false) {
            if (fromRespo.history && fromRespo.history.length > 0) {
              Donor.getforexcel({
                donorid: data.to
              }, function (toRespo) {
                if (toRespo.value != false) {
                  if (toRespo.history && toRespo.history.length > 0) {
                    if (fromRespo.donationcount > 0) {
                      toRespo.donationcount = fromRespo.donationcount + toRespo.donationcount;
                    } else {
                      toRespo.donationcount = fromRespo.donationcount;
                    }
                    _.each(fromRespo.oldbottle, function (f) {
                      f.hospital = sails.ObjectID(f.hospital);
                      f.date = new Date(f.date);
                      toRespo.oldbottle.push(f);
                    });
                    _.each(fromRespo.history, function (t) {
                      t.date = new Date(t.date);
                      toRespo.history.push(t);
                    });
                    db.collection('donor').update({
                      donorid: toRespo.donorid
                    }, {
                      $set: {
                        donationcount: toRespo.donationcount,
                        history: toRespo.history,
                        oldbottle: toRespo.oldbottle
                      }
                    }, function (err, doRespo) {
                      if (err) {
                        console.log(err);
                        callback({
                          value: false,
                          comment: "Error"
                        });
                      } else if (doRespo) {
                        Donor.deleteDonor({
                          _id: sails.ObjectID(fromRespo._id)
                        }, function (delRespo) {
                          if (delRespo.value != false) {
                            callback({
                              value: true,
                              comment: "Merge Successful"
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
                      } else {
                        callback({
                          value: false,
                          comment: "Some Error"
                        });
                        db.close();
                      }
                    });
                  } else {
                    callback({
                      value: false,
                      comment: "Old Donor history not found"
                    });
                    db.close();
                  }
                } else {
                  callback({
                    value: false,
                    comment: "Old Donor not found"
                  });
                  db.close();
                }
              });
            } else {
              callback({
                value: false,
                comment: "New Donor history not found"
              });
              db.close();
            }
          } else {
            callback({
              value: false,
              comment: "New Donor not found"
            });
            db.close();
          }
        });
      }
    });
  },
  addHistory: function (data, callback) {
    data.date = new Date(data.date);
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false,
          comment: "Error"
        });
      } else {
        Donor.getforexcel(data, function (doRespo) {
          if (doRespo.value != false) {
            var index = sails._.findIndex(doRespo.history, function (chr) {
              return chr.campnumber == data.campnumber;
            });
            if (index == -1) {
              if (doRespo.donationcount && doRespo.donationcount > 0) {
                doRespo.donationcount = doRespo.donationcount + 1;
              } else {
                doRespo.donationcount = 1;
              }
              if (doRespo.history && doRespo.history.length > 0) {
                callMe(doRespo);
              } else {
                doRespo.history = [];
                doRespo.oldbottle = [];
                callMe(doRespo);
              }

              function callMe(doRespo) {
                doRespo.history.push({
                  date: data.date,
                  campnumber: data.campnumber
                });
                doRespo.oldbottle.push({
                  date: data.date,
                  campnumber: data.campnumber,
                  bottle: "",
                  verified: true,
                  hospital: sails.ObjectID()
                });
                Donor.update({
                  me: 1,
                  donorid: doRespo.donorid,
                  history: doRespo.history,
                  oldbottle: doRespo.oldbottle,
                  donationcount: doRespo.donationcount
                }, function (upRespo) {
                  if (upRespo.value != false) {
                    callback({
                      value: true,
                      comment: "History Added Successfully"
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
                comment: "Entry of this camp number alreay exists"
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
      }
    });
  },
  bottleCount: function (data, callback) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false,
          comment: "Error"
        });
      } else {
        db.collection('donor').aggregate([{
          $match: {
            history: {
              $exists: true
            }
          }
        }, {
          $group: {
            _id: null,
            total: {
              $sum: {
                $size: "$history"
              }
            }
          }
        }]).toArray(function (err, data2) {
          if (err) {
            console.log(err);
            callback({
              value: false,
              comment: "Error"
            });
            db.close();
          } else if (data2) {
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
  sms: function (data, callback) {
    if (data.type == "All") {
      sails.query(function (err, db) {
        if (err) {
          console.log(err);
          callback({
            value: false,
            comment: "Error"
          });
        } else {
          db.collection('donor').find({
            mobile: {
              $nin: ["0", ""]
            }
          }, {
            _id: 0,
            mobile: 1
          }).toArray(function (err, found) {
            if (err) {
              console.log(err);
              callback({
                value: false,
                comment: "Error"
              });
              db.close();
            } else if (found && found.length > 0) {
              var abc = sails._.chunk(found, 90);
              var i = 0;

              function callSend(num) {
                var arr = abc[num];
                var mob = "";
                _.each(arr, function (res) {
                  mob += res.mobile + ",";
                });
                if (1 == 1) {
                  sails.request.get({
                    url: "http://esms.mytechnologies.co.in/sendsms.jsp?user=" + sails.smsUsername + "&password=" + sails.smsPassword + "&mobiles=" + mob + "&senderid=TMMBLD&sms=" + data.message
                  }, function (err, httpResponse, body) {
                    console.log(body);
                    if (body && body != "") {
                      i++;
                      num++;
                      if (i == abc.length) {
                        callback({
                          value: true,
                          comment: "Sent",
                          count: abc
                        });
                        db.close();
                      } else {
                        callSend(num);
                      }
                    }
                  });
                }
              }
              callSend(0);
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
    } else {
      sails.query(function (err, db) {
        if (err) {
          console.log(err);
          callback({
            value: false,
            comment: "Error"
          });
        } else {
          db.collection('donor').find({
            mobile: {
              $nin: ["0", ""]
            },
            pincode: {
              $in: data.pincode
            }
          }, {
            _id: 0,
            mobile: 1
          }).toArray(function (err, found) {
            if (err) {
              console.log(err);
              callback({
                value: false,
                comment: "Error"
              });
              db.close();
            } else if (found && found.length > 0) {
              var abc = sails._.chunk(found, 90);
              var i = 0;

              function callSend(arr) {
                var mob = "";
                _.each(arr, function (res) {
                  mob += res.mobile + ",";
                });
                if (1 == 1) {
                  sails.request.get({
                    url: "http://esms.mytechnologies.co.in/sendsms.jsp?user=" + sails.smsUsername + "&password=" + sails.smsPassword + "&mobiles=" + mob + "&senderid=TMMBLD&sms=" + data.message
                  }, function (err, httpResponse, body) {
                    console.log(body);
                    if (body && body != "") {
                      i++;
                      if (i == abc.length) {
                        callback({
                          value: true,
                          comment: "Sent",
                          count: abc
                        });
                        db.close();
                      }
                    }
                  });
                }
              }
              _.each(abc, function (n) {
                callSend(n);
              });
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
  },
  bottleCheck: function (data, callback) {
    data.bottle = parseInt(data.bottle);
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false,
          comment: "Error"
        });
      } else {
        db.collection("donor").find({
          campnumber: data.campnumber,
          bottle: data.bottle,
          camp: data.camp,
          hospital: sails.ObjectID(data.hospital)
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
              comment: "Bottle already exists",
              donorid: data2[0].donorid
            });
            db.close();
          } else {
            callback({
              value: true,
              comment: "Bottle Number can be used"
            });
            db.close();
          }
        });
      }
    });
  },
  getSearch: function (data, callback) {
    var newreturns = {};
    newreturns.data = [];
    data.pagesize = parseInt(data.pagesize);
    data.pagenumber = parseInt(data.pagenumber);
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false,
          comment: "Error"
        });
      } else {
        // console.log( data.pincode);
        async.parallel([

          function (callback) {
            var matchObj = {
              bloodgroup: data.bloodgrp,
              pincode: {
                $in: data.pincode
              }
            };
            if (data.pincode == 'All') {
              delete matchObj['pincode'];
            }
            db.collection("donor").count(matchObj, function (err, number) {
              if (number && number != "") {
                newreturns.totalpages = Math.ceil(number / data.pagesize);
                callback(null, newreturns);
              } else if (err) {
                console.log(err);
                callback(err, null);
              } else {
                callback(null, newreturns);
              }
            });
          },

          function (callback) {
            var matchObj = {
              bloodgroup: data.bloodgrp,
              age: {
                $lt: 65
              },
              pincode: {
                $in: data.pincode
              }
            };
            if (data.pincode == 'All') {
              delete matchObj['pincode'];
            }
           // console.log(matchObj);
            db.collection("donor").find(
              matchObj, {
                _id: 1,
                donorid: 1,
                name: 1,
                mobile: 1,
                bloodgroup: 1,
                pincode: 1,
                tel1: 1,
                tel2: 1
              }, {
                donorid: 1
              }).skip(data.pagesize * (data.pagenumber - 1)).limit(data.pagesize).toArray(function (err, found) {
              if (err) {
                console.log(err);
                callback(err, null);
              } else if (found && found.length > 0) {

                newreturns.data = found;
                // console.log(found);
                callback(null, newreturns);
              } else {
                callback(null, newreturns);
              }
            });
          }
        ], function (err, respo) {
          if (err) {
            console.log(err);
            callback({
              value: false,
              comment: "Error"
            });
            db.close();
          } else {
            callback(newreturns);
            db.close();
          }
        });
      }
    });
  },
  findNan: function (data, callback) {
    var check = new RegExp("nan", "i");
    var arr = [];
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false,
          comment: "Error"
        });
      } else {
        db.collection("donor").find({
          donorid: {
            $regex: check
          }
        }, {
          donorid: 1
        }).toArray(function (err, found) {
          if (err) {
            console.log(err);
            callback({
              value: false,
              comment: "Error"
            });
            db.close();
          } else if (found && found.length > 0) {
            function callMe(num) {
              abc = found[num];
              abc.donorid = sails._.capitalize(abc.donorid.substring(0, 1) + abc.donorid.substring(1, abc.donorid.length));
              var splitname = sails._.capitalize(abc.donorid.substring(0, 1));
              var letter = splitname;
              splitname = "^" + splitname + "[0-9]";
              var checkname = new RegExp(splitname);
              db.collection('donor').find({
                $and: [{
                  donorid: {
                    $regex: checkname
                  }
                }, {
                  donorid: {
                    $nin: ["r00NaN", "R00NaN"]
                  }
                }]
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
                  abc.donorid = regsplit[1] + 1;
                  abc.donorid = abc.donorid.toString();
                  if (abc.donorid.length == 1) {
                    abc.donorid = letter + "0000" + abc.donorid;
                  } else if (abc.donorid.length == 2) {
                    abc.donorid = letter + "000" + abc.donorid;
                  } else if (abc.donorid.length == 3) {
                    abc.donorid = letter + "00" + abc.donorid;
                  } else if (abc.donorid.length == 4) {
                    abc.donorid = letter + "0" + abc.donorid;
                  } else {
                    abc.donorid = letter + abc.donorid;
                  }
                  insertid(abc);
                } else {
                  abc.donorid = letter + "00001";
                  insertid(abc);
                }

                function insertid(abc) {
                  db.collection("donor").update({
                    _id: sails.ObjectID(abc._id)
                  }, {
                    $set: {
                      donorid: abc.donorid
                    }
                  }, function (err, updated) {
                    if (updated) {
                      num++;
                      if (num == found.length) {
                        callback({
                          value: true,
                          comment: "Updated",
                          data: found
                        });
                      } else {
                        callMe(num);
                      }
                    }
                  });
                }
              });
            }
            callMe(0);
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
  donationCountForApp: function (data, callback) {

  }
};
