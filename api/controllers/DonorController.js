/**
 * DonorController
 *
 * @description :: Server-side logic for managing themes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body.lastname && req.body.lastname != "") {
                if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    theme();
                } else {
                    res.json({
                        value: false,
                        comment: "Donor-id is incorrect"
                    });
                }
            } else {
                theme();
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
        if (req.body) {
            if (req.body.theme && req.body.theme.length > 0) {
                var print = function(data) {
                    res.json(data);
                }
                Donor.find(req.body, print);
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
    findbyid: function(req, res) {
        if (req.body) {
            if (req.body.search && req.body.search != "" && req.body.hospital && req.body.hospital != "" && sails.ObjectID.isValid(req.body.hospital)) {
                var print = function(data) {
                    res.json(data);
                }
                Donor.findbyid(req.body, print);
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
    countdonor: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Donor.countdonor(req.body, callback);
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
                        res.connection.setTimeout(200000);
                        req.connection.setTimeout(200000);
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
                                        m.birthdate = new Date(m.birthdate);
                                        Village.savevillage(m, function(villagerespo) {
                                            m.village = [];
                                            m.village.push(villagerespo);
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
    }
};
