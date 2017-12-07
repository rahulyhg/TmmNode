/**
 * CampController
 *
 * @description :: Server-side logic for managing users
 * @help                :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
  save: function (req, res) {
    res.connection.setTimeout(200000000);
    req.connection.setTimeout(200000000);
    if (req.body) {
      if (req.body._id) {
        if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
          user();
        } else {
          res.json({
            value: false,
            comment: "Camp-id is incorrect"
          });
        }
      } else {
        user();
      }

      function user() {
        var print = function (data) {
          res.json(data);
        }
        Camp.save(req.body, print);
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  delete: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
        var print = function (data) {
          res.json(data);
        }
        Camp.delete(req.body, print);
      } else {
        res.json({
          value: false,
          comment: "Camp-id is incorrect"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  find: function (req, res) {
    function callback(data) {
      res.json(data);
    };
    Camp.find(req.body, callback);
  },
  countcamp: function (req, res) {
    function callback(data) {
      res.json(data);
    };
    Camp.countcamp(req.body, callback);
  },
  findone: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
        var print = function (data) {
          res.json(data);
        }
        Camp.findone(req.body, print);
      } else {
        res.json({
          value: false,
          comment: "Camp-id is incorrect"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  findCampHospital: function (req, res) {
    if (req.body) {
      if (req.body.camp && req.body.camp != "" && req.body.campnumber && req.body.campnumber != "") {
        var print = function (data) {
          res.json(data);
        }
        Camp.findCampHospital(req.body, print);
      } else {
        res.json({
          value: false,
          comment: "Please provide parameters"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  findlimited: function (req, res) {
    if (req.body) {
      if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
        function callback(data) {
          res.json(data);
        };
        Camp.findlimited(req.body, callback);
      } else {
        res.json({
          value: false,
          comment: "Please provide parameters"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  countlevels: function (req, res) {
    res.connection.setTimeout(200000000);
    req.connection.setTimeout(200000000);
    if (req.body) {
      if (req.body.campnumber && req.body.campnumber != "") {
        function callback(data) {
          res.json(data);
        };
        Camp.countlevels(req.body, callback);
      } else {
        res.json({
          value: false,
          comment: "Please provide parameters"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  countforHosp: function (req, res) {
    if (req.body) {
      if (req.body.campnumber && req.body.campnumber != "") {
        function callback(data) {
          res.json(data);
        };
        Camp.countforHosp(req.body, callback);
      } else {
        res.json({
          value: false,
          comment: "Please provide parameters"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  donorlevels: function (req, res) {
    if (req.body) {
      if (req.body.accesslevel && req.body.accesslevel != "") {
        function callback(data) {
          res.json(data);
        };
        Camp.donorlevels(req.body, callback);
      } else {
        res.json({
          value: false,
          comment: "Please provide parameters"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  hospDonors: function (req, res) {
    if (req.body) {
      if (req.body.campnumber && req.body.campnumber != "" && req.body.hospital && req.body.hospital != "" && sails.ObjectID.isValid(req.body.hospital)) {
        function callback(data) {
          res.json(data);
        };
        Camp.hospDonors(req.body, callback);
      } else {
        res.json({
          value: false,
          comment: "Please provide parameters"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  excelDonor: function (req, res) {
    var camp = req.param('camp');
    var campnumber = req.param('campnumber');
    var accesslevel = req.param('accesslevel');
    res.connection.setTimeout(20000000);
    req.connection.setTimeout(20000000);
    //console.log(accesslevel);
    if (accesslevel == "entry") {
      var matchobj = {
        "oldbottle.campnumber": campnumber,
        "oldbottle.camp": camp,
        "oldbottle.bottle": {
          $exists: true
        }
      };
    } else if (accesslevel == "verify") {
      var matchobj = {
        "oldbottle.campnumber": campnumber,
        "oldbottle.camp": camp,
        "oldbottle.bottle": {
          $exists: true
        },
        "oldbottle.verified": {
          $exists: true
        }
      };
    } else if (accesslevel == "gift") {
      var matchobj = {
        "oldbottle.campnumber": campnumber,
        "oldbottle.camp": camp,
        "oldbottle.bottle": {
          $exists: true
        },
        "oldbottle.verified": {
          $exists: true
        },
        "oldbottle.giftdone": {
          $eq: true
        }
      };
    } else if (accesslevel == "pendingV") {
      var matchobj = {
        "oldbottle.campnumber": campnumber,
        "oldbottle.camp": camp,
        "oldbottle.bottle": {
          $exists: true
        },
        "oldbottle.verified": {
          $exists: false
        }
      };
    } else if (accesslevel == "pendingG") {
      var matchobj = {
        "oldbottle.campnumber": campnumber,
        "oldbottle.camp": camp,
        "oldbottle.bottle": {
          $exists: true
        },
        "oldbottle.verified": {
          $exists: true
        },
        "oldbottle.giftdone": {
          $exists: false
        }
      };
    } else if (accesslevel == "rejected") {
      var matchobj = {
        "oldbottle.camp": camp,
        "oldbottle.deletedcamp": campnumber
      };
    } else if (accesslevel == "giftRejected") {
      var matchobj = {
        "oldbottle.campnumber": campnumber,
        "oldbottle.camp": camp,
        "oldbottle.bottle": {
          $exists: true
        },
        "oldbottle.verified": {
          $exists: true
        },
        "oldbottle.giftdone": {
          $eq: false
        }
      };
    } else {
      res.json({
        value: false,
        comment: "Please provide accesslevel"
      });
    }
    if (camp == "All" || camp == "") {
      delete matchobj["oldbottle.camp"];
    }
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        res.json({
          value: false
        });
      } else if (db) {
        //console.log(matchobj);
        db.collection("donor").aggregate([{
          $unwind: "$oldbottle"
        }, {
          $match: matchobj
        }, {
          $project: {
            _id: 0,
            donorid: 1,
            name: 1,
            bloodgroup: 1,
            oldbottle: 1,
            deletereason: 1,
            age: 1,
            gender: 1,

          }
        }, {
          $sort: {
            "oldbottle.ackdate": 1
          }
        }]).toArray(function (err, data2) {
          if (err) {
            console.log(err);
            res.json({
              value: false
            });
            db.close();
          } else if (data2 && data2[0]) {
            // res.json(data2);
            //console.log("Camp report download");
            //console.log(data2.length);
            var locals = {
              data: data2
            };
            locals.date = sails.moment().format("DD-MM-YYYY");
            locals.camp = camp;
            locals.campnumber = campnumber;
            if (accesslevel != "rejected") {
              res.view("donors", locals);
            } else {
              res.view("rejected", locals);
            }
            db.close();
          } else {
            res.json({
              value: false,
              comment: "No data found"
            });
            db.close();
          }
        });
      }
    });
  },
  hospitalDonor: function (req, res) {
    var camp = req.param('camp');
    var campnumber = req.param('campnumber');
    var hospital = req.param('hospital');
    hospital = sails.ObjectID(hospital);
    var data5 = {};
    data5._id = hospital;
    Hospital.findone(data5, function (respo) {
      if (respo.value != false) {
        var hospitalname = respo.name;
        res.connection.setTimeout(20000000);
        req.connection.setTimeout(20000000);
        var matchobj = {
          "oldbottle.campnumber": campnumber,
          "oldbottle.camp": camp,
          "oldbottle.hospital": hospital,
          "oldbottle.bottle": {
            $exists: true
          },
          "oldbottle.verified": {
            $exists: true
          }
        };
        if (camp == "All" || camp == "") {
          delete matchobj["oldbottle.camp"];
        }
        sails.query(function (err, db) {
          if (err) {
            console.log(err);
            res.json({
              value: false
            });
          } else if (db) {
            db.collection("donor").aggregate([{
              $unwind: "$oldbottle"
            }, {
              $match: matchobj
            }, {
              $project: {
                _id: 0,
                donorid: 1,
                name: 1,
                bloodgroup: 1,
                oldbottle: 1,
                age: 1,
                gender: 1
              }
            }, {
              $sort: {
                "oldbottle.bottle": 1
              }
            }]).toArray(function (err, data2) {
              if (err) {
                console.log(err);
                res.json({
                  value: false
                });
                db.close();
              } else if (data2 && data2[0]) {
                // res.json(data2);
                var locals = {
                  data: data2
                };
                locals.date = sails.moment().format("DD-MM-YYYY");
                locals.hospitalname = hospitalname;
                locals.camp = camp;
                locals.campnumber = campnumber;
                res.view("hospital", locals);
                db.close();
              } else {
                res.json({
                  value: false,
                  comment: "No data found"
                });
                db.close();
              }
            });
          }
        });
      } else {
        res.json({
          value: false,
          comment: "Hospital id is incorrect"
        });
      }
    });
  },
  excelDonor1: function (req, res) {
    var camp = req.param('camp');
    var campnumber = req.param('campnumber');
    var accesslevel = req.param('accesslevel');
    res.connection.setTimeout(20000000);
    req.connection.setTimeout(20000000);
    // console.log(accesslevel);
    if (accesslevel == "entry") {
      var matchobj = {
        "oldbottle.campnumber": campnumber,
        "oldbottle.camp": camp,
        "oldbottle.bottle": {
          $exists: true
        }
      };
    } else if (accesslevel == "verify") {
      var matchobj = {
        "oldbottle.campnumber": campnumber,
        "oldbottle.camp": camp,
        "oldbottle.bottle": {
          $exists: true
        },
        "oldbottle.verified": {
          $exists: true
        }
      };
    } else if (accesslevel == "gift") {
      var matchobj = {
        "oldbottle.campnumber": campnumber,
        "oldbottle.camp": camp,
        "oldbottle.bottle": {
          $exists: true
        },
        "oldbottle.verified": {
          $exists: true
        },
        "oldbottle.giftdone": {
          $eq: true
        }
      };
    } else if (accesslevel == "pendingV") {
      var matchobj = {
        "oldbottle.campnumber": campnumber,
        "oldbottle.camp": camp,
        "oldbottle.bottle": {
          $exists: true
        },
        "oldbottle.verified": {
          $exists: false
        }
      };
    } else if (accesslevel == "pendingG") {
      var matchobj = {
        "oldbottle.campnumber": campnumber,
        "oldbottle.camp": camp,
        "oldbottle.bottle": {
          $exists: true
        },
        "oldbottle.verified": {
          $exists: true
        },
        "oldbottle.giftdone": {
          $exists: false
        }
      };
    } else if (accesslevel == "rejected") {
      var matchobj = {
        "oldbottle.camp": camp,
        "oldbottle.deletedcamp": campnumber
      };
    } else if (accesslevel == "giftRejected") {
      var matchobj = {
        "oldbottle.campnumber": campnumber,
        "oldbottle.camp": camp,
        "oldbottle.bottle": {
          $exists: true
        },
        "oldbottle.verified": {
          $exists: true
        },
        "oldbottle.giftdone": {
          $eq: false
        }
      };
    } else {
      res.json({
        value: false,
        comment: "Please provide accesslevel"
      });
    }
    if (camp == "All" || camp == "") {
      delete matchobj["oldbottle.camp"];
    }
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        res.json({
          value: false
        });
      } else if (db) {
        console.log(matchobj);
        db.collection("donor").aggregate([{
          $unwind: "$oldbottle"
        }, {
          $match: matchobj
        }, {
          $sort: {
            "oldbottle.ackdate": 1
          }
        }, {
          $project: {
            _id: 0,
            "Donor Id": "$donorid",
            Name: "$name",
            "Blood Group": "$bloodgroup",
            "Bottle No": "$oldbottle.bottle",
            "Blood Bank": "$oldbottle.hospitalname",
            Age: "$age",
            Gender: "$gender",
            "Rejected Reason": "$reason"
          }
        }]).toArray(function (err, data2) {
          if (err) {
            console.log(err);
            res.json({
              value: false
            });
            db.close();
          } else if (data2 && data2[0]) {
            // res.json(data2);
            //console.log(data2.length);
           var fields = {
              "Donor Id": 'string',
              Name: 'string',
              Gender: 'string',
              "Blood Group": 'string',
              Age: 'string',
              "Bottle No": 'string',
              "Blood Bank": 'string'
            }
            if(accesslevel != "verify"){
               fields["Rejected Reason"] = 'string';
            }
            var xls = sails.json2xls(data2, {
              fields: fields
            });
            sails.fs.writeFileSync('./data.xlsx', xls, 'binary');
            var path = './data.xlsx';
            var excel = sails.fs.readFileSync('./data.xlsx');
            res.set('Content-Type', "application/octet-stream");
            res.set('Content-Disposition', "attachment;filename=" + path);
            res.send(excel);
            db.close();
          } else {
            res.json({
              value: false,
              comment: "No data found"
            });
            db.close();
          }
        });
      }
    });
  },
  hospitalDonor1: function (req, res) {
    var camp = req.param('camp');
    var campnumber = req.param('campnumber');
    var hospital = req.param('hospital');
    hospital = sails.ObjectID(hospital);
    var data5 = {};
    data5._id = hospital;
    Hospital.findone(data5, function (respo) {
      if (respo.value != false) {
        var hospitalname = respo.name;
        res.connection.setTimeout(20000000);
        req.connection.setTimeout(20000000);
        var matchobj = {
          "oldbottle.campnumber": campnumber,
          "oldbottle.camp": camp,
          "oldbottle.hospital": hospital,
          "oldbottle.bottle": {
            $exists: true
          },
          "oldbottle.verified": {
            $exists: true
          }
        };
        if (camp == "All" || camp == "") {
          delete matchobj["oldbottle.camp"];
        }
        sails.query(function (err, db) {
          if (err) {
            console.log(err);
            res.json({
              value: false
            });
          } else if (db) {
            console.log(matchobj);
            db.collection("donor").aggregate([{
              $unwind: "$oldbottle"
            }, {
              $match: matchobj
            }, {
              $project: {
                _id: 0,
                "Full Name": {
                  $concat: ["$firstname", " ", "$middlename", " ", "$lastname"]
                },
                "Donor Id":"$donorid",
                firstname: 1,
                middlename: 1,
                lastname: 1,
                Age: "$age",
                Gender: "$gender",
                Address1: "$address1",
                Address2: "$address2",
                Area: "$Area",
                City: "$city",
                "Mobile No":"$mobile",
                Pincode: "$Pincode",
                Weight: "$weight",
                "Bottle No": "$oldbottle.bottle",
                "Blood bank Name":"$oldbottle.hospitalname",
                "Blood Group": "$bloodgroup",
                // "Sr.No": {
                //   // $cond: {
                //   $cond: {
                //     if: {
                //       "$Sr.No": {$exists:true}
                //     },
                //     then: {
                //       $inc: {
                //         "$Sr.No": 1
                //       },
                //       else: 1
                //     }
                //     //if: {"$Sr.No":{$exists: 1}}, then:{$inc:{"$Sr.No" :1 } },else:1
                //   }
                // }
              }
            }, {
              $sort: {
                bottle_no: 1
              }
            }]).toArray(function (err, data2) {
              if (err) {
                console.log(err);
                res.json({
                  value: false
                });
                db.close();
              } else if (data2 && data2[0]) {
                console.log(data2);
                var xls = sails.json2xls(data2, {
                  fields: {
                    "Full Name": "string",
                    "Gender": 'string',
                    "Age": 'string',
                    "Weight": 'string',
                    "Blood Group": 'string',
                    "Bottle No": 'string',
                    "Address1": 'string',
                    "Address2": 'string',
                    "Area":"string",
                    "City":"string",
                    "Pincode":"string",
                    "Blood bank Name":"string"
                  }
                });
                sails.fs.writeFileSync('./data.xlsx', xls, 'binary');
                var path = './data.xlsx';
                var excel = sails.fs.readFileSync('./data.xlsx');
                var mimetype = sails.mime.lookup('./data.xlsx');
                res.set('Content-Type', "application/octet-stream");
                res.set('Content-Disposition', "attachment;filename=" + path);
                res.send(excel);
                db.close();
              } else {
                res.json({
                  value: false,
                  comment: "No data found"
                });
                db.close();
              }
            });
          }
        });
      } else {
        res.json({
          value: false,
          comment: "Hospital id is incorrect"
        });
      }
    });
  },
  findMe: function (req, res) {
    if (req.body) {
      if (req.body.campnumber && req.body.campnumber != "") {
        function callback(data) {
          res.json(data);
        };
        Camp.findMe(req.body, callback);
      } else {
        res.json({
          value: false,
          comment: "Please provide parameters"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  closeLogin: function (req, res) {
    if (req.body) {
      if (req.body.campnumber && req.body.campnumber != "" && req.body.camp && req.body.camp != "") {
        function callback(data) {
          res.json(data);
        };
        Camp.closeLogin(req.body, callback);
      } else {
        res.json({
          value: false,
          comment: "Please provide parameters"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  recheckCounts: function (req, res) {
    if (req.body) {
      function callback(data) {
        res.json(data);
      };
      Camp.recheckCounts(req.body, callback);

    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  }
};
