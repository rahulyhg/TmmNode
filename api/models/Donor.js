module.exports = {
    save: function (data, callback) {
        if (data.bottle && data.bottle != "") {
            data.bottle = parseInt(data.bottle);
        }
        if (data.oldbottle && data.oldbottle.length > 0) {
            _.each(data.oldbottle, function (y) {
                y.hospital = sails.ObjectID(y.hospital);
            });
        }
        data.name = data.lastname + " " + data.firstname + " " + data.middlename;
        if (data.hospital && data.hospital != "") {
            data.hospital = sails.ObjectID(data.hospital);
            var insert = {};
            insert._id = data.hospital;
            Hospital.findone(insert, function (respo) {
                if (respo != false) {
                    data.hospitalname = respo.name;
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
                                    var splitname = data.lastname.substring(0, 1);
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
                                            blood();
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
                                if (data.new) {
                                    editOldDonor(data);
                                } else {
                                    check(data);
                                }
                            }

                            function editdonor(data) {
                                delete data.donationcount;
                                if (data.oldbottle && data.oldbottle.length > 0) {
                                    _.each(data.oldbottle, function (y) {
                                        y.hospital = sails.ObjectID(y.hospital);
                                    });
                                }
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
                                        blood();
                                    } else if (updated.result.nModified == 0 && updated.result.n != 0) {
                                        blood();
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

                            function blood() {
                                var bloodData = {};
                                bloodData.camp = data.camp;
                                bloodData.number = data.bottle;
                                bloodData.campnumber = data.campnumber;
                                bloodData.hospital = data.hospitalname;
                                Blood.deleteBottle(bloodData, function (bloodrespo) {
                                    db.collection('table').findAndModify({
                                        hospitalname: data.hospitalname,
                                        camp: data.camp,
                                        campnumber: data.campnumber
                                    }, {}, {
                                        $inc: {
                                            pendingV: 1
                                        }
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
                                            callback({
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
                                        if (data.donorid) {
                                            if (data.oldbottle && data.oldbottle.length > 0) {
                                                var olddata = {};
                                                olddata.bottle = data.bottle;
                                                olddata.camp = data.camp;
                                                olddata.hospital = sails.ObjectID(data.hospital);
                                                olddata.hospitalname = data.hospitalname;
                                                olddata.campnumber = data.campnumber;
                                                data.oldbottle.push(olddata);
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
                        new: {
                            $exists: false
                        },
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
                        pincode: data.pincode
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
                        pincode: data.pincode,
                        hospital: sails.ObjectID(data.hospital),
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
                        firstname: checkfirstname,
                        middlename: checkmiddlename,
                        lastname: checklastname,
                        campnumber: data.campnumber,
                        camp: data.camp,
                        pincode: data.pincode,
                        hospital: sails.ObjectID(data.hospital),
                        new: {
                            $exists: true
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
                    delete matchobj.pincode;
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
                        pincode: data.pincode,
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
                        pincode: data.pincode,
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
                    delete matchobj.pincode;
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
                    pincode: data.pincode,
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
                    delete matchobj.pincode;
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
                        _.each(findrespo.oldbottle, function (a) {
                            a.hospital = sails.ObjectID(a.hospital);
                            if (a.bottle == bottleNum && a.campnumber == data.campnumber) {
                                delete a.bottle;
                            }
                        });
                        delete data.donationcount;
                        db.collection('donor').update({
                            _id: sails.ObjectID(findrespo._id)
                        }, {
                            $set: findrespo
                        }, function (err, updated) {
                            if (updated) {
                                var hospdata = {};
                                hospdata._id = sails.ObjectID(findrespo.hospital);
                                Hospital.findone(hospdata, function (hosprespo) {
                                    if (hosprespo.value != false) {
                                        var newdata = {};
                                        newdata.number = bottleNum;
                                        newdata.hospital = hosprespo.name;
                                        newdata.camp = findrespo.camp;
                                        newdata.campnumber = findrespo.campnumber;
                                        newdata.used = "Unused";
                                        Blood.save(newdata, function (respoblood) {
                                            db.collection('table').findAndModify({
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
                $exists: true
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

                        function calledit() {
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
                                            callback({
                                                value: true
                                            });
                                            db.close();
                                            if (data.mobile && data.mobile != "") {
                                                sails.request.get({
                                                    url: "http://esms.mytechnologies.co.in/api/smsapi.aspx?username=gadaharia&password=vikasvira&to=" + data.mobile + "&from=TMMBLD&message=Thank you for donating Blood. Your gesture will go a long way in saving 5 Precious Lives. Regards, TMM."
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
                        z.giftdone = true;
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
                                hospitalname: data.hospitalname,
                                camp: data.camp,
                                campnumber: data.campnumber
                            }, {}, {
                                $inc: {
                                    gift: 1,
                                    pendingG: -1
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
        delete data.donationcount;
        var i = 0;
        if (data.oldbottle && data.oldbottle.length > 0) {
            _.each(data.oldbottle, function (y) {
                y.hospital = sails.ObjectID(y.hospital);
                i++;
                if (i == data.oldbottle.length) {
                    callme();
                }
            });
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
        delete data.donationcount;
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
                    delete data.donationcount;
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
                                        var i = 0;
                                        if (fromRespo.donationcount > 0) {
                                            toRespo.donationcount = fromRespo.donationcount + toRespo.donationcount;
                                        } else {
                                            toRespo.donationcount = fromRespo.donationcount;
                                        }
                                        _.each(fromRespo.oldbottle, function (f) {
                                            f.hospital = sails.ObjectID(f.hospital);
                                            f.date = new Date(f.date);
                                            toRespo.oldbottle.push(f);
                                            i++;
                                        });
                                        _.each(fromRespo.history, function (t) {
                                            t.date = new Date(t.date);
                                            toRespo.history.push(t);
                                            i++;
                                        });
                                        if (i == 2 * (fromRespo.history.length)) {
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
                                        }
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
    }
};
