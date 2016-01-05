/**
 * DonorController
 *
 * @description :: Server-side logic for managing themes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
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
                var print = function(data) {
                    res.json(data);
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
    delete: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
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
    find: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        Donor.find(req.body, print);
    },
    findone: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
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
    acksave: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id) && req.body.verified && req.body.verified == true) {
                var print = function(data) {
                    res.json(data);
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
    giftsave: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id) && req.body.giftdone && req.body.giftdone == true) {
                var print = function(data) {
                    res.json(data);
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
    findVerified: function(req, res) {
        if (req.body) {
            if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
                var print = function(data) {
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
    findGifted: function(req, res) {
        if (req.body) {
            if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
                var print = function(data) {
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
    getverified: function(req, res) {
        if (req.body) {
            if (req.body.search && req.body.search != "" && req.body.hospital && req.body.hospital != "" && sails.ObjectID.isValid(req.body.hospital)) {
                var print = function(data) {
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
    findlimited: function(req, res) {
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
    findEntry: function(req, res) {
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
    countdonor: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Donor.countdonor(req.body, callback);
    },
    countentry: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Donor.countentry(req.body, callback);
    },
    countverified: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Donor.countverified(req.body, callback);
    },
    countgifted: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Donor.countgifted(req.body, callback);
    },
    countdeleted: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Donor.countdeleted(req.body, callback);
    },
    lastbottlenumber: function(req, res) {
        if (req.body) {
            if (req.body.camp && req.body.camp != "" && req.body.campnumber && req.body.campnumber != "" && req.body.hospital && req.body.hospital != "" && sails.ObjectID.isValid(req.body.hospital)) {
                var print = function(data) {
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
    excelobject: function(req, res) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
            }
            if (db) {
                db.open(function(err, db) {
                    if (err) {
                        console.log(err);
                    }
                    if (db) {
                        res.connection.setTimeout(200000000);
                        req.connection.setTimeout(200000000);
                        var extension = "";
                        var excelimages = [];
                        req.file("file").upload(function(err, uploadedFiles) {
                            if (err) {
                                console.log(err);
                            }
                            _.each(uploadedFiles, function(n) {
                                writedata = n.fd;
                                excelcall(writedata);
                            });
                        });

                        function excelcall(datapath) {
                            var outputpath = "./.tmp/output.json";
                            sails.xlsxj({
                                input: datapath,
                                output: outputpath
                            }, function(err, result) {
                                if (err) {
                                    console.error(err);
                                }
                                if (result) {
                                    sails.fs.unlink(datapath, function(data) {
                                        if (data) {
                                            sails.fs.unlink(outputpath, function(data2) {});
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
                                            Village.savevillage(m, function(villagerespo) {
                                                m.village = [];
                                                m.village.push(villagerespo);
                                                savedonor();
                                            });
                                        } else {
                                            m.village = [];
                                            savedonor();
                                        }

                                        function savedonor() {
                                            Donor.saveExcel(m, function(respo) {
                                                if (respo.value && respo.value == true) {
                                                    console.log(num);
                                                    num++;
                                                    if (num < result.length) {
                                                        setTimeout(function() {
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
    donorCount: function(req, res) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
            }
            if (db) {
                db.open(function(err, db) {
                    if (err) {
                        console.log(err);
                    }
                    if (db) {
                        res.connection.setTimeout(200000000);
                        req.connection.setTimeout(200000000);
                        var extension = "";
                        var excelimages = [];
                        req.file("file").upload(function(err, uploadedFiles) {
                            if (err) {
                                console.log(err);
                            }
                            _.each(uploadedFiles, function(n) {
                                writedata = n.fd;
                                excelcall(writedata);
                            });
                        });

                        function excelcall(datapath) {
                            var outputpath = "./.tmp/output.json";
                            sails.xlsxj({
                                input: datapath,
                                output: outputpath
                            }, function(err, result) {
                                if (err) {
                                    console.error(err);
                                }
                                if (result) {
                                    sails.fs.unlink(datapath, function(data) {
                                        if (data) {
                                            sails.fs.unlink(outputpath, function(data2) {});
                                        }
                                    });

                                    function createteam(num) {
                                        m = result[num];
                                        delete m.donorid1;
                                        m.donationcount = parseInt(m.donationcount);
                                        Donor.getbyid(m, function(getresp) {
                                            // if (!getresp.donationcount) {
                                            Donor.update(m, function(respo) {
                                                if (respo.value && respo.value == true) {
                                                    console.log(num);
                                                    num++;
                                                    if (num < result.length) {
                                                        setTimeout(function() {
                                                            createteam(num);
                                                        }, 15);
                                                    } else {
                                                        res.json("Done");
                                                    }
                                                } else {
                                                    console.log(num);
                                                    num++;
                                                    if (num < result.length) {
                                                        setTimeout(function() {
                                                            createteam(num);
                                                        }, 15);
                                                    } else {
                                                        res.json("Done");
                                                    }
                                                }
                                            });
                                            // } else {
                                            //     console.log(num);
                                            //     num++;
                                            //     if (num < result.length) {
                                            //         setTimeout(function() {
                                            //             createteam(num);
                                            //         }, 15);
                                            //     } else {
                                            //         res.json("Done");
                                            //     }
                                            // }
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
    donationZero: function(req, res) {
        var i = 0;
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                res.json({
                    value: false
                });
            } else if (db) {
                Donor.find(req.body, function(respo) {
                    _.each(respo, function(z) {
                        if (!z.donationcount) {
                            z.donationcount = 0;
                            var donor = sails.ObjectID(z._id);
                            delete z._id;
                            db.collection('donor').update({
                                _id: donor
                            }, {
                                $set: z
                            }, function(err, updated) {
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
    updateHistory: function(req, res) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
            }
            if (db) {
                db.open(function(err, db) {
                    if (err) {
                        console.log(err);
                    }
                    if (db) {
                        res.connection.setTimeout(200000000);
                        req.connection.setTimeout(200000000);
                        var extension = "";
                        var excelimages = [];
                        req.file("file").upload(function(err, uploadedFiles) {
                            if (err) {
                                console.log(err);
                            }
                            _.each(uploadedFiles, function(n) {
                                writedata = n.fd;
                                excelcall(writedata);
                            });
                        });

                        function excelcall(datapath) {
                            var outputpath = "./.tmp/output.json";
                            sails.xlsxj({
                                input: datapath,
                                output: outputpath
                            }, function(err, result) {
                                if (err) {
                                    console.error(err);
                                }
                                if (result) {
                                    sails.fs.unlink(datapath, function(data) {
                                        if (data) {
                                            sails.fs.unlink(outputpath, function(data2) {});
                                        }
                                    });

                                    function createteam(num) {
                                        m = result[num];
                                        m.donorid = m.donorid1.toUpperCase();
                                        m.date = new Date(m.date);
                                        delete m.donorid1;
                                        Donor.getbyid(m, function(dorespo) {
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
                                                    Donor.update(donated, function(respo) {
                                                        if (respo.value && respo.value == true) {
                                                            console.log(num);
                                                            num++;
                                                            if (num < result.length) {
                                                                setTimeout(function() {
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
                                                    Donor.update(donated, function(respo) {
                                                        if (respo.value && respo.value == true) {
                                                            console.log(num);
                                                            num++;
                                                            if (num < result.length) {
                                                                setTimeout(function() {
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
                                                    setTimeout(function() {
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
    saveforapp: function(req, res) {
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
                var print = function(data) {
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
    deleteDonor: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
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
    deletealluser: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        Donor.deletealluser(req.body, print);
    },
    emptyHistory: function(req, res) {
        res.connection.setTimeout(200000000);
        req.connection.setTimeout(200000000);
        db.collection('donor').update({}, {
            $unset: {
                history: "",
                oldbottle: ""
            }
        }, function(err, updated) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
                db.close();
            } else if (updated) {
                callback({
                    value: true,
                    comment: "History closed"
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
    },
    deletenew: function(req, res) {
        res.connection.setTimeout(200000000);
        req.connection.setTimeout(200000000);
        sails.query(function(err, db) {
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
                }, function(err, deleted) {
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
    findForPrint: function(req, res) {
        if (req.param('_id') && req.param('_id') != "" && sails.ObjectID.isValid(req.param('_id')) && req.param('campnumber') && req.param('campnumber') != "" && req.param('campnumber') != "All") {
            sails.query(function(err, db) {
                if (err) {
                    console.log(err);
                    res.json({
                        value: "false"
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
                    }]).toArray(function(err, data2) {
                        if (err) {
                            console.log(err);
                            res.json({
                                value: "false"
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
                                value: "false",
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
    }
};
