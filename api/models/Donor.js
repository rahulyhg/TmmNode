module.exports = {
    save: function(data, callback) {
        data.name = data.firstname + " " + data.middlename + " " + data.lastname;
        if (data.hospital) {
            data.hospital = sails.ObjectID(data.hospital);
        }
        var splitname = data.lastname.substring(0, 1);
        var letter = splitname;
        splitname = "^" + splitname + "[0-9]";
        var checkname = new RegExp(splitname, "i");
        data.donationcount = 0;
        sails.query(function(err, db) {
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
                        data.oldbottle = [];
                        var olddata = {};
                        olddata.bottle = data.bottle;
                        olddata.camp = data.camp;
                        olddata.hospital = data.hospital;
                        olddata.campnumber = data.campnumber;
                        data.oldbottle.push(olddata);
                        data._id = sails.ObjectID();
                        db.collection('donor').find({
                            donorid: {
                                $regex: checkname
                            }
                        }).sort({
                            donorid: -1
                        }).limit(1).toArray(function(err, data2) {
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
                        db.collection('donor').insert(data, function(err, created) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false,
                                    comment: "Error"
                                });
                                db.close();
                            } else if (created) {
                                var bloodData = {};
                                bloodData.number = data.bottle;
                                Blood.deleteBottle(bloodData, function(bloodrespo) {
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
                    }, function(err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false,
                                comment: "Error"
                            });
                            db.close();
                        } else if (updated.result.nModified != 0 && updated.result.n != 0) {
                            var bloodData = {};
                            bloodData.number = data.bottle;
                            Blood.deleteBottle(bloodData, function(bloodrespo) {
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
                            bloodData.number = data.bottle;
                            Blood.deleteBottle(bloodData, function(bloodrespo) {
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
                        campnumber: data.campnumber,
                        bottle: data.bottle,
                        camp: data.camp,
                        hospital: sails.ObjectID(data.hospital)
                    }).toArray(function(err, data2) {
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
                                if (data.oldbottle && data.oldbottle.length > 0) {
                                    var olddata = {};
                                    olddata.bottle = data.bottle;
                                    olddata.camp = data.camp;
                                    olddata.hospital = data.hospital;
                                    olddata.campnumber = data.campnumber;
                                    data.oldbottle.push(olddata);
                                } else {
                                    data.oldbottle = [];
                                    var olddata = {};
                                    olddata.bottle = data.bottle;
                                    olddata.camp = data.camp;
                                    olddata.hospital = data.hospital;
                                    olddata.campnumber = data.campnumber;
                                    data.oldbottle.push(olddata);
                                }
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
    find: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("donor").find({}, {
                    password: 0
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
    findone: function(data, callback) {
        sails.query(function(err, db) {
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
    findlimited: function(data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.donorid, "i");
        var checkname = new RegExp(data.name, "i");
        var checkfirstname = new RegExp(data.firstname, "i");
        var checklastname = new RegExp(data.lastname, "i");
        var checkmiddlename = new RegExp(data.middlename, "i");
        var pagesize = parseInt(data.pagesize);
        var pagenumber = parseInt(data.pagenumber);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else if (db) {
                if (data.accesslevel == "entry") {
                    var matchobj = {
                        donorid: check,
                        name: checkname,
                        firstname: checkfirstname,
                        middlename: checkmiddlename,
                        lastname: checklastname,
                        campnumber: data.campnumber,
                        camp: data.camp,
                        pincode: data.pincode,
                        new: {
                            $exists: false
                        }
                    };
                } else {
                    var matchobj = {
                        donorid: check,
                        name: checkname,
                        firstname: checkfirstname,
                        middlename: checkmiddlename,
                        lastname: checklastname,
                        campnumber: data.campnumber,
                        camp: data.camp,
                        pincode: data.pincode
                    };
                }
                if (data.donorid == "") {
                    delete matchobj.donorid;
                }
                if (data.name == "") {
                    delete matchobj.name;
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
                if (data.campnumber == "" || data.campnumber == "All") {
                    delete matchobj.campnumber;
                }
                if (data.camp == "" || data.camp == "All") {
                    delete matchobj.camp;
                }
                if (data.pincode == "") {
                    delete matchobj.pincode;
                }
                callbackfunc1();

                function callbackfunc1() {
                    db.collection("donor").count(matchobj, function(err, number) {
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
                            donorid: 1
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
    findEntry: function(data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.donorid, "i");
        var checkname = new RegExp(data.name, "i");
        var checkfirstname = new RegExp(data.firstname, "i");
        var checklastname = new RegExp(data.lastname, "i");
        var checkmiddlename = new RegExp(data.middlename, "i");
        var pagesize = parseInt(data.pagesize);
        var pagenumber = parseInt(data.pagenumber);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else if (db) {
                if (data.accesslevel == 'verify') {
                    var matchobj = {
                        donorid: check,
                        name: checkname,
                        firstname: checkfirstname,
                        middlename: checkmiddlename,
                        lastname: checklastname,
                        campnumber: data.campnumber,
                        camp: data.camp,
                        pincode: data.pincode,
                        hospital:sails.ObjectID(data.hospital),
                        new: {
                            $exists: true
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
                        name: checkname,
                        firstname: checkfirstname,
                        middlename: checkmiddlename,
                        lastname: checklastname,
                        campnumber: data.campnumber,
                        camp: data.camp,
                        pincode: data.pincode,
                        hospital:sails.ObjectID(data.hospital),
                        new: {
                            $exists: true
                        },
                        bottle: {
                            $ne: ""
                        }
                        // ,
                        // reason: {
                        //     $eq: ""
                        // }
                    };
                }
                if (data.donorid == "") {
                    delete matchobj.donorid;
                }
                if (data.name == "") {
                    delete matchobj.name;
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
                if (data.campnumber == "" || data.campnumber == "All") {
                    delete matchobj.campnumber;
                }
                if (data.camp == "" || data.camp == "All") {
                    delete matchobj.camp;
                }
                if (data.pincode == "") {
                    delete matchobj.pincode;
                }
                callbackfunc1();

                function callbackfunc1() {
                    db.collection("donor").count(matchobj, function(err, number) {
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
                            donorid: 1
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
    findVerified: function(data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.donorid, "i");
        var checkname = new RegExp(data.name, "i");
        var checkfirstname = new RegExp(data.firstname, "i");
        var checklastname = new RegExp(data.lastname, "i");
        var checkmiddlename = new RegExp(data.middlename, "i");
        var pagesize = parseInt(data.pagesize);
        var pagenumber = parseInt(data.pagenumber);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else if (db) {
                if (data.accesslevel == 'gift') {
                    var matchobj = {
                        donorid: check,
                        name: checkname,
                        firstname: checkfirstname,
                        middlename: checkmiddlename,
                        lastname: checklastname,
                        campnumber: data.campnumber,
                        camp: data.camp,
                        pincode: data.pincode,
                        hospital:sails.ObjectID(data.hospital),
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
                        name: checkname,
                        firstname: checkfirstname,
                        middlename: checkmiddlename,
                        lastname: checklastname,
                        campnumber: data.campnumber,
                        camp: data.camp,
                        pincode: data.pincode,
                        hospital:sails.ObjectID(data.hospital),
                        verified: {
                            $eq: true
                        }
                    };
                }
                if (data.donorid == "") {
                    delete matchobj.donorid;
                }
                if (data.name == "") {
                    delete matchobj.name;
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
                if (data.campnumber == "" || data.campnumber == "All") {
                    delete matchobj.campnumber;
                }
                if (data.camp == "" || data.camp == "All") {
                    delete matchobj.camp;
                }
                if (data.pincode == "") {
                    delete matchobj.pincode;
                }
                callbackfunc1();

                function callbackfunc1() {
                    db.collection("donor").count(matchobj, function(err, number) {
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
                            donorid: 1
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
    findGifted: function(data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.donorid, "i");
        var checkname = new RegExp(data.name, "i");
        var checkfirstname = new RegExp(data.firstname, "i");
        var checklastname = new RegExp(data.lastname, "i");
        var checkmiddlename = new RegExp(data.middlename, "i");
        var pagesize = parseInt(data.pagesize);
        var pagenumber = parseInt(data.pagenumber);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else if (db) {
                var matchobj = {
                    donorid: check,
                    name: checkname,
                    firstname: checkfirstname,
                    middlename: checkmiddlename,
                    lastname: checklastname,
                    campnumber: data.campnumber,
                    camp: data.camp,
                    pincode: data.pincode,
                    hospital:sails.ObjectID(data.hospital),
                    giftdone: {
                        $eq: true
                    }
                };
                if (data.donorid == "") {
                    delete matchobj.donorid;
                }
                if (data.name == "") {
                    delete matchobj.name;
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
                if (data.campnumber == "" || data.campnumber == "All") {
                    delete matchobj.campnumber;
                }
                if (data.camp == "" || data.camp == "All") {
                    delete matchobj.camp;
                }
                if (data.pincode == "") {
                    delete matchobj.pincode;
                }
                callbackfunc1();

                function callbackfunc1() {
                    db.collection("donor").count(matchobj, function(err, number) {
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
                            donorid: 1
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
    delete: function(data, callback) {
        console.log(data);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else if (db) {
                Donor.findone(data, function(findrespo) {
                    if (!findrespo.value) {
                        var bottleNum = "";
                        bottleNum = findrespo.bottle;
                        findrespo.bottle = "";
                        _.each(findrespo.oldbottle, function(a) {
                            if (a.bottle == bottleNum && a.campnumber == data.campnumber) {
                                delete a.bottle;
                            }
                        });
                        db.collection('donor').update({
                            _id: sails.ObjectID(findrespo._id)
                        }, {
                            $set: findrespo
                        }, function(err, updated) {
                            if (updated) {
                                var hospdata = {};
                                hospdata._id = sails.ObjectID(findrespo.hospital);
                                Hospital.findone(hospdata, function(hosprespo) {
                                    if (!hosprespo.value) {
                                        var newdata = {};
                                        newdata.number = bottleNum;
                                        newdata.hospital = hosprespo.name;
                                        newdata.camp = findrespo.camp;
                                        newdata.used = "Unused";
                                        Blood.save(newdata, function(respoblood) {
                                            callback({
                                                value: true,
                                                comment: "Donor deleted"
                                            });
                                            db.close();
                                        });
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
    lastbottlenumber: function(data, callback) {
        sails.query(function(err, db) {
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
                }).limit(1).toArray(function(err, data2) {
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
    countdonor: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            if (db) {
                db.collection("donor").count({}, function(err, number) {
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
    countentry: function(data, callback) {
        var matchobj = {
            camp: data.camp,
            campnumber: data.campnumber,
            bottle: {
                $ne: ""
            }
        };
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            if (db) {
                db.collection("donor").count(matchobj, function(err, number) {
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
    countverified: function(data, callback) {
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
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            if (db) {
                db.collection("donor").count(matchobj, function(err, number) {
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
    countgifted: function(data, callback) {
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
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            if (db) {
                db.collection("donor").count(matchobj, function(err, number) {
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
    acksave: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false,
                    comment: "Error"
                });
            } else if (db) {
                Donor.findone(data, function(userrespo) {
                    if (!userrespo.value) {
                        if (userrespo.history && userrespo.history.length > 0) {
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
                        _.each(data.oldbottle, function(z) {
                            if (z.bottle == data.bottle && z.campnumber == data.campnumber) {
                                z.verified = true;
                            }
                        });
                        var donor = sails.ObjectID(data._id);
                        delete data._id;
                        db.collection('donor').update({
                            _id: donor,
                            verified: {
                                $ne: true
                            }
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
    giftsave: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false,
                    comment: "Error"
                });
            } else if (db) {
                _.each(data.oldbottle, function(z) {
                    z.hospital = sails.ObjectID(z.hospital);
                    if (z.bottle == data.bottle && z.campnumber == data.campnumber && z.verified == true) {
                        z.giftdone = true;
                    }
                });
                var donor = sails.ObjectID(data._id);
                delete data._id;
                db.collection('donor').update({
                    _id: donor,
                    giftdone: {
                        $ne: true
                    }
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
    saveExcel: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else if (db) {
                if (!data._id) {
                    data._id = sails.ObjectID();
                    db.collection('donor').insert(data, function(err, created) {
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
                    }, function(err, updated) {
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
    update: function(data, callback) {
        sails.query(function(err, db) {
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
                }, function(err, updated) {
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
    },
    getbyid: function(data, callback) {
        sails.query(function(err, db) {
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
    saveforapp: function(data, callback) {
        data.name = data.firstname + " " + data.middlename + " " + data.lastname;
        var splitname = data.lastname.substring(0, 1);
        var letter = splitname;
        splitname = "^" + splitname + "[0-9]";
        var checkname = new RegExp(splitname, "i");
        data.donationcount = 0;
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else if (db) {
                if (!data._id) {
                    data._id = sails.ObjectID();
                    db.collection('donor').find({
                        donorid: {
                            $regex: checkname
                        }
                    }).sort({
                        donorid: -1
                    }).limit(1).toArray(function(err, data2) {
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
                        db.collection('donor').insert(data, function(err, created) {
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
                    var donor = sails.ObjectID(data._id);
                    delete data._id;
                    db.collection('donor').update({
                        _id: donor
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
    deleteDonor: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else if (db) {
                db.collection('donor').remove({
                    _id: sails.ObjectID(data._id)
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
    deletealluser: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            db.collection('donor').remove({}, function(err, deleted) {
                if (deleted) {
                    db.collection('village').remove({}, function(err, deleted1) {
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
    // sendSms: function(data, callback) {
    //     Donor.find(data, function(donresp) {
    //         request.get({
    //             url: ""
    //         }, function(err, httpResponse, body) {
    //             console.log(httpResponse);
    //             console.log(body);
    //         });
    //     });
    // }
};
