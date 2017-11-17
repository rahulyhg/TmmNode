/**
 * DonorController
 *
 * @description :: Server-side logic for managing themes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
  trial: function(req, res){
    sails.query(function (err, db) {
      db.collection("donor").aggregate([{
        $unwind: "$oldbottle"
      },{
        $match: {"oldbottle.deletedcamp": 'C090'}
      }]).toArray(function (err, result) {
        console.log(result.length);
        _.each(result, function(data, key){
        db.collection("camp").find({
          "venues.value": data.oldbottle.camp,
          "venues.hospital.name": data.oldbottle.hospitalname,
          'campnumber':'C090'
        }).toArray(function (err, data2) {
         
          if(_.isEmpty(data2)){
             console.log(" Not found" + key );
             console.log(data2);
          }else{
            console.log("found"+ key);
            //console.log(data2);
          }
        });
      });
      });
    });
  },
  addDonor: function (req, res) {
    if (req.body) {
      if (req.body._id) {
        if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
          theme();
        } else {
          res.json({
            value: false,
            comment: "Donor-id is incorrect"
          });
        }
      } else {
        if (req.body.lastname && req.body.lastname != "") {
          theme();
        } else {
          res.json({
            value: false,
            comment: "Please provide parameters"
          });
        }
      }

      function theme() {
        var print = function (data) {
          res.json(data);
        }
        Donor.addDonor(req.body, print);
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  save: function (req, res) {
    if (req.body) {
      if (req.body._id) {
        if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
          theme();
        } else {
          res.json({
            value: false,
            comment: "Donor-id is incorrect"
          });
        }
      } else {
        if (req.body.lastname && req.body.lastname != "") {
          theme();
        } else {
          res.json({
            value: false,
            comment: "Please provide parameters"
          });
        }
      }

      function theme() {
        var print = function (err, data) {
          if(_.isEmpty(err)){
            res.json(data);  
          }else{
          res.json(err);
          }
        }
        Donor.save(req.body, print);
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
        Donor.delete(req.body, print);
      } else {
        res.json({
          value: false,
          comment: "Donor-id is incorrect"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  changeNaN: function (req, res) {
    if (req.body) {
      var print = function (data) {
        res.json(data);
      }
        Donor.changeNaN(req.body, print);
      
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  deletedata: function (req, res) {
    if (req.body) {
      if (req.body.donorid && req.body.donorid != "" && req.body.campnumber && req.body.campnumber != "") {
        var print = function (data) {
          res.json(data);
        }
        Donor.deletedata(req.body, print);
      } else {
        res.json({
          value: false,
          comment: "Donor-id is incorrect"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  findforapp: function (req, res) {
    if (req.body) {
      Donor.findforapp(req.body, function (respo) {
        res.json(respo);
      });
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  find: function (req, res) {
    var print = function (data) {
      res.json(data);
    }
    Donor.find(req.body, print);
  },
  findone: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
        var print = function (data) {
          res.json(data);
        }
        Donor.findone(req.body, print);
      } else {
        res.json({
          value: false,
          comment: "Donor-id is incorrect"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  findoneAndUpdate: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
        var print = function (data) {
          res.json(data);
        }
        Donor.findone(req.body, print);
      } else {
        res.json({
          value: false,
          comment: "Donor-id is incorrect"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  getbyid: function (req, res) {
    if (req.body) {
      if (req.body.donorid && req.body.donorid != "") {
        var print = function (data) {
          res.json(data);
        }
        Donor.getbyid(req.body, print);
      } else {
        res.json({
          value: false,
          comment: "Donor-id is incorrect"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  acksave: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id) && req.body.verified && req.body.verified == true) {
        var print = function (err, data) {
          if(_.isEmpty(err)){
            res.json(data);  
          }else{
          res.json(err);
          }
        }
        Donor.acksave(req.body, print);
      } else {
        res.json({
          value: false,
          comment: "Donor-id is incorrect"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  giftsave: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
        var print = function (err, data) {
          if(_.isEmpty(err)){
            res.json(data);  
          }else{
          res.json(err);
          }
        }
        Donor.giftsave(req.body, print);
      } else {
        res.json({
          value: false,
          comment: "Donor-id is incorrect"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  findVerified: function (req, res) {
    if (req.body) {
      if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
        var print = function (data) {
          res.json(data);
        }
        Donor.findVerified(req.body, print);
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
  mergeDonors: function (req, res) {
    if (req.body) {
      if (req.body.from && req.body.to) {
        Donor.mergeDonors(req.body, function (respo) {
          res.json(respo);
        });
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
  findGifted: function (req, res) {
    if (req.body) {
      if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
        var print = function (data) {
          res.json(data);
        }
        Donor.findGifted(req.body, print);
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
  getverified: function (req, res) {
    if (req.body) {
      if (req.body.search && req.body.search != "" && req.body.hospital && req.body.hospital != "" && sails.ObjectID.isValid(req.body.hospital)) {
        var print = function (data) {
          res.json(data);
        }
        Donor.getverified(req.body, print);
      } else {
        res.json({
          value: false,
          comment: "Search is needed"
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
        Donor.findlimited(req.body, callback);
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
  findEntry: function (req, res) {
    if (req.body) {
      if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
        function callback(data) {
          res.json(data);
        };
        Donor.findEntry(req.body, callback);
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
  countdonor: function (req, res) {
    function callback(data) {
      res.json(data);
    };
    Donor.countdonor(req.body, callback);
  },
  countentry: function (req, res) {
    function callback(data) {
      res.json(data);
    };
    Donor.countentry(req.body, callback);
  },
  countverified: function (req, res) {
    function callback(data) {
      res.json(data);
    };
    Donor.countverified(req.body, callback);
  },
  countgifted: function (req, res) {
    function callback(data) {
      res.json(data);
    };
    Donor.countgifted(req.body, callback);
  },
  countdeleted: function (req, res) {
    function callback(data) {
      res.json(data);
    };
    Donor.countdeleted(req.body, callback);
  },
  bottleCount: function (req, res) {
    function callback(data) {
      res.json(data);
    };
    Donor.bottleCount(req.body, callback);
  },
  lastbottlenumber: function (req, res) {
    if (req.body) {
      if (req.body.camp && req.body.camp != "" && req.body.campnumber && req.body.campnumber != "" && req.body.hospital && req.body.hospital != "" && sails.ObjectID.isValid(req.body.hospital)) {
        var print = function (data) {
          res.json(data);
        }
        Donor.lastbottlenumber(req.body, print);
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
  excelobject: function (req, res) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
      }
      if (db) {
        db.open(function (err, db) {
          if (err) {
            console.log(err);
          }
          if (db) {
            res.connection.setTimeout(200000000);
            req.connection.setTimeout(200000000);
            var extension = "";
            var excelimages = [];
            req.file("file").upload(function (err, uploadedFiles) {
              if (err) {
                console.log(err);
              }
              _.each(uploadedFiles, function (n) {
                writedata = n.fd;
                excelcall(writedata);
              });
            });

            function excelcall(datapath) {
              var outputpath = "./.tmp/output.json";
              sails.xlsxj({
                input: datapath,
                output: outputpath
              }, function (err, result) {
                if (err) {
                  console.error(err);
                }
                if (result) {
                  sails.fs.unlink(datapath, function (data) {
                    if (data) {
                      sails.fs.unlink(outputpath, function (data2) {});
                    }
                  });

                  function createteam(num) {
                    m = result[num];
                    m.name = m.lastname + " " + m.firstname + " " + m.middlename;
                    if (m.birthdate == "") {
                      m.birthdate = new Date();
                    } else {
                      m.birthdate = new Date(m.birthdate);
                    }
                    if (m.email != "") {
                      m.email = m.email + m.domainName;
                    }
                    delete m.donorid1;
                    delete m.domainName;
                    delete m.address21;
                    delete m.address3;
                    if (m.village != "") {
                      Village.savevillage(m, function (villagerespo) {
                        m.village = [];
                        m.village.push(villagerespo);
                        savedonor();
                      });
                    } else {
                      m.village = [];
                      savedonor();
                    }

                    function savedonor() {
                      Donor.saveExcel(m, function (respo) {
                        if (respo.value && respo.value == true) {
                          console.log(num);
                          num++;
                          if (num < result.length) {
                            setTimeout(function () {
                              createteam(num);
                            }, 15);
                          } else {
                            res.json("Done");
                          }
                        }
                      });
                    }
                  }
                  createteam(0);
                }
              });
            }
          }
        });
      }
    });
  },
  donorCount: function (req, res) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
      }
      if (db) {
        db.open(function (err, db) {
          if (err) {
            console.log(err);
          }
          if (db) {
            res.connection.setTimeout(200000000);
            req.connection.setTimeout(200000000);
            var extension = "";
            var excelimages = [];
            req.file("file").upload(function (err, uploadedFiles) {
              if (err) {
                console.log(err);
              }
              _.each(uploadedFiles, function (n) {
                writedata = n.fd;
                excelcall(writedata);
              });
            });

            function excelcall(datapath) {
              var outputpath = "./.tmp/output.json";
              sails.xlsxj({
                input: datapath,
                output: outputpath
              }, function (err, result) {
                if (err) {
                  console.error(err);
                }
                if (result) {
                  sails.fs.unlink(datapath, function (data) {
                    if (data) {
                      sails.fs.unlink(outputpath, function (data2) {});
                    }
                  });

                  function createteam(num) {
                    m = result[num];
                    delete m.donorid1;
                    m.donationcount = parseInt(m.donationcount);
                    Donor.getforexcel(m, function (getresp) {
                      Donor.update(m, function (respo) {
                        if (respo.value && respo.value == true) {
                          console.log(num);
                          num++;
                          if (num < result.length) {
                            setTimeout(function () {
                              createteam(num);
                            }, 15);
                          } else {
                            res.json("Done");
                          }
                        } else {
                          console.log(num);
                          num++;
                          if (num < result.length) {
                            setTimeout(function () {
                              createteam(num);
                            }, 15);
                          } else {
                            res.json("Done");
                          }
                        }
                      });
                    });
                  }
                  createteam(0);
                }
              });
            }
          }
        });
      }
    });
  },
  findAndUpdate: function (req, res) {
    var i = 0;
    var boochArr = [];
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        res.json({
          value: false
        });
      } else if (db) {
        db.collection("donor").find().each(function (err, doc) {
          if (_.isEmpty(doc)) {
            res.json({
              booch: boochArr
            });
          } else {
            if (doc.history && doc.history.length != doc.donationcount) {
              boochArr.push(doc.donorid);
              db.collection("donor").update({
                _id: sails.ObjectID(doc._id)
              }, {
                $set: {
                  donationcount: doc.history.length
                }
              }, function (err, updated) {
                if (err) {
                  console.log(err);
                } else {
                  res.json({
                    value: false,
                    comment: ""
                  });
                }
              });
            }
          }
        });
      }
    });
  },
  donationZero: function (req, res) {
    var i = 0;
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        res.json({
          value: false
        });
      } else if (db) {
        Donor.find(req.body, function (respo) {
          _.each(respo, function (z) {
            if (!z.donationcount) {
              z.donationcount = 0;
              var donor = sails.ObjectID(z._id);
              delete z._id;
              db.collection('donor').update({
                _id: donor
              }, {
                $set: z
              }, function (err, updated) {
                if (err) {
                  console.log(err);
                  res.json({
                    value: false,
                    comment: "Error"
                  });
                  db.close();
                } else if (updated) {
                  i++;
                  if (i == respo.length) {
                    res.json({
                      value: true,
                      comment: "Donor updated"
                    });
                    db.close();
                  }
                } else {
                  res.json({
                    value: false,
                    comment: "No data found"
                  });
                  db.close();
                }
              });
            } else {
              i++;
              if (i == respo.length) {
                res.json({
                  value: true,
                  comment: "Donor updated"
                });
                db.close();
              }
            }
          });
        });
      }
    });
  },
  bottleInt: function (req, res) {
    var i = 0;
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        res.json({
          value: false
        });
      } else if (db) {
        Donor.find(req.body, function (respo) {
          _.each(respo, function (z) {
            if (z.bottle && z.bottle != "") {
              z.bottle = parseInt(z.bottle);
              var donor = sails.ObjectID(z._id);
              delete z._id;
              var obj = {};
              obj.bottle = z.bottle;
              db.collection('donor').update({
                _id: donor
              }, {
                $set: obj
              }, function (err, updated) {
                if (err) {
                  console.log(err);
                  res.json({
                    value: false,
                    comment: "Error"
                  });
                  db.close();
                } else if (updated) {
                  i++;
                  if (i == respo.length) {
                    res.json({
                      value: true,
                      comment: "Donor updated"
                    });
                    db.close();
                  }
                } else {
                  res.json({
                    value: false,
                    comment: "No data found"
                  });
                  db.close();
                }
              });
            } else {
              i++;
              if (i == respo.length) {
                res.json({
                  value: true,
                  comment: "Donor updated"
                });
                db.close();
              }
            }
          });
        });
      }
    });
  },
  updateHistory: function (req, res) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
      }
      if (db) {
        db.open(function (err, db) {
          if (err) {
            console.log(err);
          }
          if (db) {
            res.connection.setTimeout(200000000);
            req.connection.setTimeout(200000000);
            var extension = "";
            var excelimages = [];
            req.file("file").upload(function (err, uploadedFiles) {
              if (err) {
                console.log(err);
              }
              _.each(uploadedFiles, function (n) {
                writedata = n.fd;
                excelcall(writedata);
              });
            });

            function excelcall(datapath) {
              var outputpath = "./.tmp/output.json";
              sails.xlsxj({
                input: datapath,
                output: outputpath
              }, function (err, result) {
                if (err) {
                  console.error(err);
                }
                if (result) {
                  sails.fs.unlink(datapath, function (data) {
                    if (data) {
                      sails.fs.unlink(outputpath, function (data2) {});
                    }
                  });

                  function createteam(num) {
                    m = result[num];
                    m.donorid = m.donorid1.toUpperCase();
                    m.date = new Date(m.date);
                    delete m.donorid1;
                    Donor.getforexcel(m, function (dorespo) {
                      if (dorespo.value != false) {
                        if (dorespo.history) {
                          var donated = {};
                          var newdata = {};
                          donated.history = dorespo.history;
                          newdata.date = m.date;
                          newdata.campnumber = m.campnumber;
                          donated.donorid = m.donorid;
                          donated.history.push(newdata);
                          donated.oldbottle = dorespo.oldbottle;
                          var newres = {};
                          newres.date = m.date;
                          newres.campnumber = m.campnumber;
                          newres.bottle = "";
                          newres.verified = true;
                          donated.oldbottle.push(newres);
                          Donor.update(donated, function (respo) {
                            if (respo.value && respo.value == true) {
                              console.log(num);
                              num++;
                              if (num < result.length) {
                                setTimeout(function () {
                                  createteam(num);
                                }, 15);
                              } else {
                                res.json("Done");
                              }
                            }
                          });
                        } else {
                          var donated = {};
                          var newdata = {};
                          donated.history = [];
                          newdata.date = m.date;
                          newdata.campnumber = m.campnumber;
                          donated.donorid = m.donorid;
                          donated.history.push(newdata);
                          donated.oldbottle = [];
                          var newres = {};
                          newres.date = m.date;
                          newres.campnumber = m.campnumber;
                          newres.bottle = "";
                          newres.verified = true;
                          donated.oldbottle.push(newres);
                          Donor.update(donated, function (respo) {
                            if (respo.value && respo.value == true) {
                              console.log(num);
                              num++;
                              if (num < result.length) {
                                setTimeout(function () {
                                  createteam(num);
                                }, 15);
                              } else {
                                res.json("Done");
                              }
                            }
                          });
                        }
                      } else {
                        console.log(num);
                        num++;
                        if (num < result.length) {
                          setTimeout(function () {
                            createteam(num);
                          }, 15);
                        } else {
                          res.json("Done");
                        }
                      }
                    });
                  }
                  createteam(0);
                }
              });
            }
          }
        });
      }
    });
  },
  saveforapp: function (req, res) {
    if (req.body) {
      if (req.body._id) {
        if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
          theme();
        } else {
          res.json({
            value: false,
            comment: "Donor-id is incorrect"
          });
        }
      } else {
        if (req.body.lastname && req.body.lastname != "") {
          theme();
        } else {
          res.json({
            value: false,
            comment: "Please provide parameters"
          });
        }
      }

      function theme() {
        var print = function (data) {
          res.json(data);
        }
        Donor.saveforapp(req.body, print);
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  deleteDonor: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
        var print = function (data) {
          res.json(data);
        }
        Donor.deleteDonor(req.body, print);
      } else {
        res.json({
          value: false,
          comment: "Donor-id is incorrect"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  // deletealluser: function (req, res) {
  //     var print = function (data) {
  //         res.json(data);
  //     }
  //     Donor.deletealluser(req.body, print);
  // },
  emptyHistory: function (req, res) {
    res.connection.setTimeout(200000000);
    req.connection.setTimeout(200000000);
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        res.json({
          value: false
        });
      } else if (db) {
        db.collection('donor').update({}, {
          $unset: {
            history: "",
            oldbottle: ""
          }
        }, {
          multi: true
        }, function (err, updated) {
          if (err) {
            console.log(err);
            res.json({
              value: false
            });
            db.close();
          } else if (updated) {
            res.json({
              value: true,
              comment: "History closed"
            });
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
  deletenew: function (req, res) {
    res.connection.setTimeout(200000000);
    req.connection.setTimeout(200000000);
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else if (db) {
        db.collection('donor').remove({
          notexcel: {
            $exists: true
          }
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
  findForPrint: function (req, res) {
    if (req.param('_id') && req.param('_id') != "" && sails.ObjectID.isValid(req.param('_id')) && req.param('campnumber') && req.param('campnumber') != "" && req.param('campnumber') != "All") {
      sails.query(function (err, db) {
        if (err) {
          console.log(err);
          res.json({
            value: false
          });
          db.close();
        } else if (db) {
          db.collection('donor').aggregate([{
            $match: {
              _id: sails.ObjectID(req.param('_id'))
            }
          }, {
            $unwind: "$oldbottle"
          }, {
            $match: {
              "oldbottle.campnumber": req.param('campnumber')
            }
          }]).toArray(function (err, data2) {
            if (err) {
              console.log(err);
              res.json({
                value: false
              });
              db.close();
            } else if (data2 && data2[0]) {
              // res.json(data2[0]);
              var locals = {
                data: data2[0]
              };
              locals.date = sails.moment().format("DD-MM-YYYY");
              res.view("print", locals);
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
        comment: "Please provide parameters"
      });
    }
  },
  updateMail: function (req, res) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
      }
      if (db) {
        db.open(function (err, db) {
          if (err) {
            console.log(err);
          }
          if (db) {
            res.connection.setTimeout(200000000);
            req.connection.setTimeout(200000000);
            var extension = "";
            var excelimages = [];
            req.file("file").upload(function (err, uploadedFiles) {
              if (err) {
                console.log(err);
              }
              _.each(uploadedFiles, function (n) {
                writedata = n.fd;
                excelcall(writedata);
              });
            });

            function excelcall(datapath) {
              var outputpath = "./.tmp/output.json";
              sails.xlsxj({
                input: datapath,
                output: outputpath
              }, function (err, result) {
                if (err) {
                  console.error(err);
                }
                if (result) {
                  sails.fs.unlink(datapath, function (data) {
                    if (data) {
                      sails.fs.unlink(outputpath, function (data2) {});
                    }
                  });

                  function createteam(num) {
                    m = result[num];
                    delete m.donorid1;
                    if (m.email != "") {
                      m.email = m.email + "@" + m.domainName;
                      Donor.update(m, function (respo) {
                        if (respo.value && respo.value == true) {
                          console.log(num);
                          num++;
                          if (num < result.length) {
                            setTimeout(function () {
                              createteam(num);
                            }, 15);
                          } else {
                            res.json("Done");
                          }
                        } else {
                          console.log(num);
                          num++;
                          if (num < result.length) {
                            setTimeout(function () {
                              createteam(num);
                            }, 15);
                          } else {
                            res.json("Done");
                          }
                        }
                      });
                    } else {
                      console.log(num);
                      num++;
                      if (num < result.length) {
                        setTimeout(function () {
                          createteam(num);
                        }, 15);
                      } else {
                        res.json("Done");
                      }
                    }
                  }
                  createteam(0);
                }
              });
            }
          }
        });
      }
    });
  },
  newDonor: function (req, res) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
      }
      if (db) {
        db.open(function (err, db) {
          if (err) {
            console.log(err);
          }
          if (db) {
            res.connection.setTimeout(200000000);
            req.connection.setTimeout(200000000);
            var extension = "";
            var excelimages = [];
            req.file("file").upload(function (err, uploadedFiles) {
              if (err) {
                console.log(err);
              }
              _.each(uploadedFiles, function (n) {
                writedata = n.fd;
                excelcall(writedata);
              });
            });

            function excelcall(datapath) {
              var outputpath = "./.tmp/output.json";
              sails.xlsxj({
                input: datapath,
                output: outputpath
              }, function (err, result) {
                if (err) {
                  console.error(err);
                }
                if (result) {
                  sails.fs.unlink(datapath, function (data) {
                    if (data) {
                      sails.fs.unlink(outputpath, function (data2) {});
                    }
                  });

                  function createteam(num) {
                    m = result[num];

                    m.history = [{
                      date: new Date(m.date),
                      campnumber: m.campnumber
                    }];
                    m.oldbottle = [{
                      date: new Date(m.date),
                      campnumber: m.campnumber,
                      bottle: "",
                      verified: true
                    }];
                    m.name = m.lastname + " " + m.firstname + " " + m.middlename;
                    if (m.birthdate == "") {
                      m.birthdate = new Date();
                    } else {
                      m.birthdate = new Date(m.birthdate);
                    }
                    if (m.email != "") {
                      m.email = m.email + m.domainName;
                    }
                    delete m.donorid1;
                    delete m.bottle;
                    delete m.campnumber;
                    delete m.date;
                    delete m.domainName;
                    delete m.address21;
                    delete m.address3;
                    if (m.village != "") {
                      Village.savevillage(m, function (villagerespo) {
                        m.village = [];
                        m.village.push(villagerespo);
                      });
                    } else {
                      m.village = [];
                    }
                    var splitname = m.lastname.substring(0, 1);
                    var letter = splitname;
                    splitname = "^" + splitname + "[0-9]";
                    var checkname = new RegExp(splitname, "i");
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
                        m.donorid = regsplit[1] + 1;
                        m.donorid = m.donorid.toString();
                        if (m.donorid.length == 1) {
                          m.donorid = letter + "0000" + m.donorid;
                          savedonor();
                        } else if (m.donorid.length == 2) {
                          m.donorid = letter + "000" + m.donorid;
                          savedonor();
                        } else if (m.donorid.length == 3) {
                          m.donorid = letter + "00" + m.donorid;
                          savedonor();
                        } else if (m.donorid.length == 4) {
                          m.donorid = letter + "0" + m.donorid;
                          savedonor();
                        } else {
                          m.donorid = letter + m.donorid;
                          savedonor();
                        }
                      } else {
                        m.donorid = letter + "00001";
                        savedonor();
                      }
                    });

                    function savedonor() {
                      Donor.saveExcel(m, function (respo) {
                        if (respo.value && respo.value == true) {
                          console.log(num);
                          num++;
                          if (num < result.length) {
                            setTimeout(function () {
                              createteam(num);
                            }, 15);
                          } else {
                            res.json("Done");
                          }
                        }
                      });
                    }
                  }
                  createteam(0);
                }
              });
            }
          }
        });
      }
    });
  },
  excelData: function (req, res) {
    var datapath = './bloodimg/' + req.query.file;
    var isfile = sails.fs.existsSync(datapath);
    if (isfile != false) {
      var outputpath = "./.tmp/output.json";
      sails.xlsxj({
        input: datapath,
        output: outputpath
      }, function (err, result) {
        if (err) {
          console.error(err);
        } else if (result) {
          sails.fs.unlink(datapath, function (data) {
            if (data) {
              sails.fs.unlink(outputpath, function (data2) {});
            }
          });
          var abc = [];
          var i = 0;
          if (result[0].donorid) {
            function createteam(num) {
              m = result[num];
              Donor.getforexcel(m, function (respo) {
                if (respo.value != false) {
                  var json = {};
                  json.donorid = respo.donorid;
                  json.name = respo.name;
                  json.address1 = respo.address1;
                  json.address2 = respo.address2;
                  json.area = respo.area;
                  json.city = respo.city;
                  json.pincode = respo.pincode;
                  json.mobile = respo.mobile;
                  abc.push(json);
                  num++;
                  if (num < result.length) {
                    setTimeout(function () {
                      createteam(num);
                    }, 15);
                  } else {
                    var xls = sails.json2xls(abc);
                    var path = './data2.xlsx';
                    sails.fs.writeFileSync(path, xls, 'binary');
                    var excel = sails.fs.readFileSync(path);
                    res.set('Content-Type', "application/octet-stream");
                    res.set('Content-Disposition', "attachment;filename=" + path);
                    res.send(excel);
                  }
                } else {
                  console.log(m.donorid);
                  num++;
                  if (num < result.length) {
                    setTimeout(function () {
                      createteam(num);
                    }, 15);
                  } else {
                    var xls = sails.json2xls(abc);
                    var path = './data2.xlsx';
                    sails.fs.writeFileSync(path, xls, 'binary');
                    var excel = sails.fs.readFileSync(path);
                    res.set('Content-Type', "application/octet-stream");
                    res.set('Content-Disposition', "attachment;filename=" + path);
                    res.send(excel);
                  }
                }
              });
            }
            createteam(0);
          } else {
            res.json({
              value: false
            });
          }
        }
      });
    }
  },
  check: function (req, res) {
    if (req.query.campnumber && req.query.count) {
      sails.query(function (err, db) {
        if (err) {
          console.log(err);
          res.json({
            value: false,
            comment: "Error"
          });
        } else {
          db.collection('donor').aggregate([{
            $match: {
              donationcount: parseInt(req.query.count)
            }
          }, {
            $unwind: "$oldbottle"
          }, {
            $match: {
              "oldbottle.campnumber": req.query.campnumber,
              "oldbottle.bottle": {
                $exists: true
              },
              "oldbottle.verified": true
            }
          }, {
            $project: {
              _id: 0,
              donorid: 1,
              name: 1,
              address1: 1,
              address2: 1,
              city: 1,
              area: 1,
              pincode: 1,
              village: {
                $cond: [{
                    $eq: ["$village", []]
                  },
                  [""], "$village"
                ]
              },
              mobile: 1,
              donationcount: 1
            }
          }, {
            $unwind: "$village"
          }, {
            $project: {
              _id: 0,
              donorid: 1,
              name: 1,
              address1: 1,
              address2: 1,
              city: 1,
              area: 1,
              pincode: 1,
              village: "$village.name",
              mobile: 1,
              donationcount: 1
            }
          }]).sort({
            donorid: 1
          }).toArray(function (err, data2) {
            if (err) {
              console.log(err);
              res.json({
                value: false,
                comment: "Error"
              });
              db.close();
            } else if (data2 && data2.length > 0) {
              // res.json(data2);
              var xls = sails.json2xls(data2);
              var path = './' + req.query.campnumber + '-' + req.query.count + '.xlsx';
              sails.fs.writeFileSync(path, xls, 'binary');
              var excel = sails.fs.readFileSync(path);
              res.set('Content-Type', "application/octet-stream");
              res.set('Content-Disposition', "attachment;filename=" + path);
              res.send(excel);
              setTimeout(function () {
                sails.fs.unlink(path, function (data) {
                  console.log(data);
                });
              }, 10000);
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
        comment: "Please provide params"
      });
    }
  },
  singleCheck: function (req, res) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        res.json({
          value: false,
          comment: "Error"
        });
      } else {
        if (req.query.count) {
          db.collection("donor").find({
            donationcount: parseInt(req.query.count),
            oldbottle: {
              $exists: true
            }
          }, {
            _id: 0,
            donorid: 1,
            name: 1,
            address1: 1,
            address2: 1,
            city: 1,
            area: 1,
            pincode: 1,
            mobile: 1,
            donationcount: 1,
            oldbottle: {
              $slice: -1
            },
          }).toArray(function (err, data2) {
            if (err) {
              console.log(err);
              res.json({
                value: false,
                comment: "Error"
              });
              db.close();
            } else if (data2 && data2.length > 0) {
              _.each(data2, function (respo) {
                respo.last_donated_date = sails.moment(respo.oldbottle[0].date).format("DD-MM-YYYY");
                delete respo.oldbottle;
              });
              // res.json(data2);
              var xls = sails.json2xls(data2);
              var path = './Donation-Count' + req.query.count + '.xlsx';
              sails.fs.writeFileSync(path, xls, 'binary');
              var excel = sails.fs.readFileSync(path);
              res.set('Content-Type', "application/octet-stream");
              res.set('Content-Disposition', "attachment;filename=" + path);
              res.send(excel);
              setTimeout(function () {
                sails.fs.unlink(path, function (data) {
                  console.log(data);
                });
              }, 10000);
              db.close();
            } else {
              res.json({
                value: false,
                comment: "No data found"
              });
              db.close();
            }
          });
        } else {
          res.json({
            value: false,
            comment: "Please provide parameters"
          });
          db.close();
        }
      }
    });
  },
  sendnoti: function (req, res) {
    var message = new sails.gcm.Message();
    var title = "Request";
    var body = "Request for blood";
    message.addNotification('title', title);
    message.addNotification('body', body);
    message.addNotification('sound', true);
    var reg = ["f7LvgpS28lg:APA91bHA4V0aQxfL1KDq4KYcxUoN21Xj2Lg88ZciiY-HCSGmRiwfujUgVLoSLLqDemYD8RJrlR40zlSjKipkN9vQ4OEky8bjDF9cv5cG4Aqb8ZtuJXgys4wOvQxnbHYr9Uz7BYKmd5HL"];
    var sender = new sails.gcm.Sender('AIzaSyDphhd4bathBzXJckCNZRvESUtnjdMuWxo');
    sender.send(message, {
      registrationTokens: reg
    }, function (err, response) {
      if (err) {
        console.log(err);
        res.json({
          value: "false",
          comment: err
        });
      } else {
        res.json(response);
      }
    });
  },
  giftList: function (req, res) {
    res.connection.setTimeout(200000000);
    req.connection.setTimeout(200000000);
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        callback({
          value: false
        });
      } else {
        var arr = [];
        Donor.find(req.body, function (respo) {
          console.log("in find");

          function createteam(num) {
            var more = respo[num];
            if (more.donationcount == 10 || more.donationcount == 25 || more.donationcount == 50 || more.donationcount == 75) {
              if (more.oldbottle && more.oldbottle.length > 0) {
                var i = 0;
                _.each(more.oldbottle, function (check) {
                  if (check.campnumber && check.campnumber == "C086" && check.bottle && check.bottle != "" && check.verified && check.verified == true) {
                    console.log(more.donorid);
                    arr.push({
                      donorid: more.donorid,
                      name: more.name,
                      address1: more.address1,
                      address2: more.address2,
                      city: more.city,
                      pincode: more.pincode,
                      donationcount: more.donationcount
                    });
                    i++;
                    if (i == more.oldbottle.length) {
                      num++;
                      if (num < respo.length) {
                        setTimeout(function () {
                          createteam(num);
                        }, 15);
                      } else {
                        var xls = sails.json2xls(arr);
                        sails.fs.writeFileSync('./data.xlsx', xls, 'binary');
                        res.json({
                          value: true
                        });
                      }
                    }
                  } else {
                    i++;
                    if (i == more.oldbottle.length) {
                      num++;
                      if (num < respo.length) {
                        setTimeout(function () {
                          createteam(num);
                        }, 15);
                      } else {
                        var xls = sails.json2xls(arr);
                        sails.fs.writeFileSync('./data.xlsx', xls, 'binary');
                        res.json({
                          value: true
                        });
                      }
                    }
                  }
                });
              } else {
                num++;
                if (num < respo.length) {
                  setTimeout(function () {
                    createteam(num);
                  }, 15);
                } else {
                  var xls = sails.json2xls(arr);
                  sails.fs.writeFileSync('./data.xlsx', xls, 'binary');
                  res.json({
                    value: true
                  });
                }
              }
            } else {
              num++;
              if (num < respo.length) {
                setTimeout(function () {
                  createteam(num);
                }, 15);
              } else {
                var xls = sails.json2xls(arr);
                sails.fs.writeFileSync('./data.xlsx', xls, 'binary');
                res.json({
                  value: true
                });
              }
            }
          }
          createteam(0);
        });
      }
    });
  },
  addHistory: function (req, res) {
    if (req.body) {
      if (req.body.date && req.body.date != "" && req.body.donorid && req.body.donorid != "" && req.body.campnumber && req.body.campnumber != "") {
        var print = function (data) {
          res.json(data);
        }
        Donor.addHistory(req.body, print);
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
  getforexcel: function (req, res) {
    if (req.body) {
      if (req.body.donorid && req.body.donorid != "") {
        var print = function (data) {
          res.json(data);
        }
        Donor.getforexcel(req.body, print);
      } else {
        res.json({
          value: false,
          comment: "Donor-id is incorrect"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  downloadMobile: function (req, res) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        res.json({
          value: false,
          comment: "Error"
        });
      } else {
        db.collection('donor').aggregate([{
          $match: {
            mobile: {
              $exists: true
            }
          }
        }, {
          $project: {
            _id: 0,
            donorid: 1,
            name: 1,
            address1: 1,
            address2: 1,
            area: 1,
            city: 1,
            pincode: 1,
            mobile: 1
          }
        }]).sort({
          donorid: 1
        }).toArray(function (err, data2) {
          if (err) {
            console.log(err);
            res.json({
              value: false,
              comment: "Error"
            });
            db.close();
          } else if (data2 && data2.length > 0) {
            data2 = _.uniq(data2, "mobile");
            var mobArr = [];
            var i = 0;
            _.each(data2, function (mob) {
              if (mob.mobile != "0" || mob.mobile != "") {
                mobArr.push(mob);
              }
            });

            var xls = sails.json2xls(mobArr);
            var path = './Mobile-Excel.xlsx';
            sails.fs.writeFileSync(path, xls, 'binary');
            var excel = sails.fs.readFileSync(path);
            res.set('Content-Type', "application/octet-stream");
            res.set('Content-Disposition', "attachment;filename=" + path);
            res.send(excel);
            setTimeout(function () {
              sails.fs.unlink(path, function (data) {
                console.log(data);
              });
            }, 10000);
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
  downloadLabel: function (req, res) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        res.json({
          value: false,
          comment: "Error"
        });
      } else {
        db.collection('donor').find({
          // $and: [{
          //   $or: [{
          //     discontinued: {
          //       $exists: false
          //     }
          //   }, {
          //     discontinued: "no"
          //   }]
          // }, {
          //   $or: [{
          //     reason: {
          //       $exists: false
          //     }
          //   }, {
          //     reason: ""
          //   }]
          // }]
        }, {
          _id: 0,
          donorid: 1,
          name: 1,
          address1: 1,
          address2: 1,
          area: 1,
          city: 1,
          pincode: 1,
          mobile: 1,
          bottle:1,
          age:1
        })
        // .sort({
        //   donorid: 1
        // })
        .toArray(function (err, data2) {
          if (err) {
            console.log(err);
            res.json({
              value: false,
              comment: "Error"
            });
            db.close();
          } else if (data2 && data2.length > 0) {
            // var fdata = _.filter(data2, function(value){
            //   return !_.isEmpty(value);
            // });

           console.log('fdata', data2);
           var path = './Label-Excel.xlsx';
            var xls = sails.json2xls(data2, {
          bottle:1,
          fields: {name:'string',donorid:'string',mobile:'string',address1:'string',address2:'string',area:'string',city:'string',pincode:'string',bottle:'string',age:'string'}

          });

            sails.fs.writeFileSync(path, xls, 'binary');
            
            var excel = sails.fs.readFileSync(path);
            res.set('Content-Type', "application/octet-stream");
            res.set('Content-Disposition', "attachment;filename=" + path);
            res.send(excel);
            db.close();
            // setTimeout(function () {
            //   sails.fs.unlink(path, function (data) {
            //     console.log(data);
            //   });
            // }, 10000);
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
  downloadNewExcel: function (req, res) {
    sails.query(function (err, db) {
      if (err) {
        console.log(err);
        res.json({
          value: false,
          comment: "Error"
        });
      } else {
        db.collection('donor').aggregate([{
          $match: {
            donorid: {
              $exists: true
            },
            donationcount: {
              $gt: 0
            }
          }
        }, {
          $project: {
            _id: 0,
            donorid: 1,
            name: 1,
            village: 1,
            area: 1,
            mobile: 1,
            donationcount: 1,
            history: 1
          }
        }]).sort({
          donorid: 1
        }).toArray(function (err, data2) {
          if (err) {
            console.log(err);
            res.json({
              value: false,
              comment: "Error"
            });
            db.close();
          } else if (data2 && data2.length > 0) {
            var array = [];
            _.each(data2, function (n) {
              var obj = {
                "Donorid": n.donorid,
                "Name": n.name,
                "Area": n.area,
                "Mobile": n.mobile,
                "Count": n.donationcount
              };
              if (n.village && Array.isArray(n.village) && n.village.length > 0 && n.village[0] != null) {
                obj["Village"] = n.village[0].name;
              } else {
                obj["Village"] = "";
              }
              if (n.history && n.history.length > 0) {
                var object = sails._.last(n.history);
                obj["Last Camp-Number"] = object.campnumber;
              } else {
                obj["Last Camp-Number"] = "";
              }
              array.push(obj);
            });
            var xls = sails.json2xls(array);
            var path = './Count-of-donors.xlsx';
            sails.fs.writeFileSync(path, xls, 'binary');
            var excel = sails.fs.readFileSync(path);
            res.set('Content-Type', "application/octet-stream");
            res.set('Content-Disposition', "attachment;filename=" + path);
            res.send(excel);
            setTimeout(function () {
              sails.fs.unlink(path, function (data) {
                console.log(data);
              });
            }, 10000);
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
  sms: function (req, res) {
    if (req.body) {
      if (req.body.type && req.body.type != "") {
        var print = function (data) {
          res.json(data);
        }
        Donor.sms(req.body, print);
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
  bottleCheck: function (req, res) {
    if (req.body) {
      Donor.bottleCheck(req.body, function (data2) {
        res.json(data2);
      });
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  getSearch: function (req, res) {
    if (req.body) {
      if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
        var print = function (data) {
          res.json(data);
        }
        Donor.getSearch(req.body, print);
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
  findNan: function (req, res) {
    if (req.body) {
      Donor.findNan(req.body, function (respo) {
        res.json(respo);
      });
    } else {
      res.json({
        value: false,
        comment: "Invalid Call"
      });
    }
  }
};
