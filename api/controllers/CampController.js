/**
 * CampController
 *
 * @description :: Server-side logic for managing users
 * @help                :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var pdf = require('html-pdf');
module.exports = {
    save: function(req, res) {
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
                var print = function(data) {
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
    delete: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
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
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Camp.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
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
    findCampHospital: function(req, res) {
        if (req.body) {
            if (req.body.camp && req.body.camp != "" && req.body.campnumber && req.body.campnumber != "") {
                var print = function(data) {
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
    findlimited: function(req, res) {
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
    countlevels: function(req, res) {
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
    countforHosp: function(req, res) {
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
    donorlevels: function(req, res) {
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
    hospDonors: function(req, res) {
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
    excelDonor: function(req, res) {
        var camp = req.param('camp');
        var campnumber = req.param('campnumber');
        var accesslevel = req.param('accesslevel');
        res.connection.setTimeout(20000000);
        req.connection.setTimeout(20000000);
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
                    $exists: true
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
                "oldbottle.campnumber": campnumber,
                "oldbottle.camp": camp,
                "oldbottle.bottle": {
                    $exists: false
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
        sails.query(function(err, db) {
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
                        bloodgroup: 1
                    }
                }, {
                    $sort: {
                        name: 1
                    }
                }]).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        res.json({
                            value: false
                        });
                    } else if (data2 && data2[0]) {
                        // res.json(data2);
                        var locals = {
                            data: data2
                        };
                        res.view("donors", locals);
                    } else {
                        res.json({
                            value: false,
                            comment: "No data found"
                        });
                    }
                });
            }
        });
    },
    hospitalDonor: function(req, res) {
        var camp = req.param('camp');
        var campnumber = req.param('campnumber');
        var accesslevel = req.param('accesslevel');
        var hospital = req.param('hospital');
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
        sails.query(function(err, db) {
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
                        "oldbottle.bottle": 1
                    }
                }, {
                    $sort: {
                        name: 1
                    }
                }]).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        res.json({
                            value: false
                        });
                    } else if (data2 && data2[0]) {
                        var locals = {
                            data: data2
                        };
                        res.view("hospital", locals);
                    } else {
                        res.json({
                            value: false,
                            comment: "No data found"
                        });
                    }
                });
            }
        });
    }
};
