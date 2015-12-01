module.exports = {
    save: function (data, callback) {
        data.name = data.firstname + " " + data.lastname + " " + data.middlename;
        if (data.hospital) {
            data.hospital = sails.ObjectID(data.hospital);
        }
        var splitname = data.lastname.substring(0, 1);
        var letter = splitname;
        splitname = "^" + splitname;
        var checkname = new RegExp(splitname, "i");
        data.donationcount = 0;
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                if (!data._id) {
                    check(data);

                    function generate(data) {
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
                        db.collection('donor').insert(data, function (err, created) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false,
                                    comment: "Error"
                                });
                                db.close();
                            } else if (created) {
                                var bloodData = {};
                                bloodData.nummber = data.blood;
                                bloodData.used = "Used";
                                Blood.saveblood(bloodData, function (bloodrespo) {
                                    if (bloodrespo.value == true) {
                                        callback({
                                            value: true,
                                            id: data._id
                                        });
                                        db.close();
                                    } else {
                                        callback({
                                            value: true,
                                            id: data._id
                                        });
                                        db.close();
                                    }
                                });
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
                    delete data._id;
                    if (!data.new) {
                        check(data);
                    } else {
                        editdonor(data);
                    }
                }

                function editdonor(data) {
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
                            var bloodData = {};
                            bloodData.nummber = data.blood;
                            bloodData.used = "Used";
                            Blood.saveblood(bloodData, function (bloodrespo) {
                                if (bloodrespo.value == true) {
                                    callback({
                                        value: true,
                                        comment: "Donor updated"
                                    });
                                    db.close();
                                } else {
                                    callback({
                                        value: true,
                                        comment: "Donor updated"
                                    });
                                    db.close();
                                }
                            });
                        } else if (updated.result.nModified == 0 && updated.result.n != 0) {
                            var bloodData = {};
                            bloodData.nummber = data.blood;
                            bloodData.used = "Used";
                            Blood.saveblood(bloodData, function (bloodrespo) {
                                if (bloodrespo.value == true) {
                                    callback({
                                        value: true,
                                        comment: "Donor updated"
                                    });
                                    db.close();
                                } else {
                                    callback({
                                        value: true,
                                        comment: "Donor updated"
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

                function check(data) {
                    db.collection("donor").find({
                        bottle: data.bottle,
                        camp: data.camp,
                        hospital: sails.ObjectID(data.hospital)
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
                            if (data.donorid) {
                                editdonor(data);
                            } else {
                                generate(data);
                            }
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
                    db.collection("donor").count({
                        $or: [{
                            donorid: {
                                '$regex': check
                            }
                        }, {
                            name: {
                                '$regex': check
                            }
                        }],
                        camp: data.camp
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
                        db.collection("donor").find({
                            $or: [{
                                donorid: {
                                    '$regex': check
                                }
                            }, {
                                name: {
                                    '$regex': check
                                }
                            }],
                            camp: data.camp
                        }, {
                            password: 0
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
                db.collection("donor").find({
                    _id: sails.ObjectID(data._id)
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
    findbyid: function (data, callback) {
        var check = new RegExp(data.search, "i");
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("donor").find({
                    $or: [{
                        donorid: {
                            '$regex': check
                        }
                    }, {
                        name: {
                            '$regex': check
                        }
                    }],
                    hospital: sails.ObjectID(data.hospital),
                    camp: data.camp
                }, {
                    name: 1,
                    donationcount: 1,
                    donorid: 1,
                    _id: 1
                }).limit(10).toArray(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        callback(data2);
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
    getverified: function (data, callback) {
        var check = new RegExp(data.search, "i");
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("donor").find({
                    $or: [{
                        donorid: {
                            '$regex': check
                        }
                    }, {
                        name: {
                            '$regex': check
                        }
                    }],
                    verified: {
                        $eq: true
                    },
                    hospital: sails.ObjectID(data.hospital),
                    camp: data.camp
                }, {
                    name: 1,
                    donationcount: 1,
                    donorid: 1,
                    _id: 1
                }).limit(10).toArray(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        callback(data2);
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
            } else if (db) {
                Donor.findone(data, function (findrespo) {
                    if (!findrespo.value) {
                        db.collection('donor').remove({
                            _id: sails.ObjectID(data._id)
                        }, function (err, deleted) {
                            if (deleted) {
                                var hospdata = {};
                                hospdata._id = findrespo.hospital;
                                Hospital.findone(hospdata, function (hosprespo) {
                                    if (!hosprespo.value) {
                                        var newdata = {};
                                        newdata.number = findrespo.bottle;
                                        newdata.hospital = hosprespo.name;
                                        newdata.camp = findrespo.camp;
                                        newdata.used = "Unused";
                                        console.log(hosprespo);
                                        console.log(findrespo);
                                        console.log(newdata);
                                        Blood.save(newdata, callback);
                                    } else {
                                        callback({
                                            value: false,
                                            comment: "No data found"
                                        });
                                        db.close();
                                    }
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
    countdonor: function (data, callback) {
        if (data.camp) {
            var matchobj = {
                camp: data.camp
            };
        } else {
            var matchobj = {};
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
    acksave: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false,
                    comment: "Error"
                });
            } else if (db) {
                Donor.findone(data, function (userrespo) {
                    if (!userrespo.value) {
                        if (userrespo.donationcount) {
                            data.donationcount = userrespo.donationcount + 1;
                        } else {
                            data.donationcount = 1;
                        }
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
                            comment: "Error"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    giftsave: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false,
                    comment: "Error"
                });
            } else if (db) {
                var donor = sails.ObjectID(data._id);
                delete data._id;
                db.collection('donor').update({
                    _id: donor,
                    giftdone: {
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
    },
    saveExcel: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else if (db) {
                if (!data._id) {
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
                } else {
                    var donor = sails.ObjectID(data._id);
                    delete data._id
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
            }
        });
    },
};