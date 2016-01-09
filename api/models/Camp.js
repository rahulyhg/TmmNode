module.exports = {
    save: function(data, callback) {
        if (data.date) {
            data.date = new Date(data.date);
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
                    data._id = sails.ObjectID();
                    data.status = "no";
                    db.collection('camp').insert(data, function(err, created) {
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
                    var camp = sails.ObjectID(data._id);
                    delete data._id;
                    if (data.status == "no") {
                        db.collection('camp').update({
                            _id: camp
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
                            } else if (updated.result.nModified == 0 && updated.result.n != 0) {
                                callback({
                                    value: true,
                                    comment: "Data already updated"
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
                        db.collection('camp').update({
                            _id: camp
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
                                var newdata = {};
                                newdata.status = "disable";
                                db.collection('admin').update({
                                    campnumber: data.campnumber
                                }, {
                                    $set: newdata
                                }, {
                                    multi: true
                                }, function(err, deleted) {
                                    if (deleted) {
                                        Blood.deleteAll(data, function(blrespo) {
                                            db.collection('donor').update({}, {
                                                $unset: {
                                                    bottle: "",
                                                    new: "",
                                                    hospital: "",
                                                    hospitalname: "",
                                                    camp: "",
                                                    campnumber: "",
                                                    hospital: "",
                                                    verified: "",
                                                    giftdone: "",
                                                    deletereason: ""
                                                }
                                            }, {
                                                multi: true
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
                                                        comment: "Camp closed"
                                                    });
                                                    db.close();
                                                } else {
                                                    callback({
                                                        value: true,
                                                        comment: "Camp closed"
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
                            } else if (updated.result.nModified == 0 && updated.result.n != 0) {
                                callback({
                                    value: true,
                                    comment: "Data already updated"
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
                    db.collection('camp').insert(data, function(err, created) {
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
                    var camp = sails.ObjectID(data._id);
                    delete data._id;
                    db.collection('camp').update({
                        _id: camp
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
                        } else if (updated.result.nModified == 0 && updated.result.n != 0) {
                            callback({
                                value: true,
                                comment: "Data already updated"
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
    find: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("camp").find().sort({
                    date: -1
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
                    db.collection("camp").count({
                        campnumber: {
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
                        db.collection("camp").find({
                            campnumber: {
                                '$regex': check
                            }
                        }).sort({
                            campnumber: -1
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
                db.collection("camp").find({
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
            db.collection('camp').remove({
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
    },
    countlevels: function(data, callback) {
        var newreturns = {};
        if (data.hospital && data.hospital != "") {
            data.hospital = sails.ObjectID(data.hospital);
        }
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false,
                    comment: "Error"
                });
            } else if (db) {
                async.parallel([
                    function(callback) {
                        var matchobj = {
                            "oldbottle.campnumber": data.campnumber,
                            "oldbottle.camp": data.camp,
                            "oldbottle.hospital": data.hospital,
                            "oldbottle.bottle": {
                                $exists: true
                            }
                        };
                        if (data.camp == "All" || data.camp == "") {
                            delete matchobj["oldbottle.camp"];
                        }
                        if (!data.hospital || data.hospital == "") {
                            delete matchobj["oldbottle.hospital"];
                        }
                        db.collection('donor').aggregate([{
                            $unwind: "$oldbottle"
                        }, {
                            $match: matchobj
                        }, {
                            $project: {
                                _id: 0,
                                oldbottle: 1
                            }
                        }]).toArray(function(err, data1) {
                            if (err) {
                                console.log(err);
                                callback(err, null);
                            } else if (data1 && data1[0]) {
                                newreturns.entry = data1.length;
                                callback(null, newreturns);
                            } else {
                                newreturns.entry = 0;
                                callback(null, newreturns);
                            }
                        });
                    },
                    function(callback) {
                        var matchobj = {
                            "oldbottle.campnumber": data.campnumber,
                            "oldbottle.camp": data.camp,
                            "oldbottle.hospital": data.hospital,
                            "oldbottle.bottle": {
                                $exists: true
                            },
                            "oldbottle.verified": {
                                $exists: true
                            }
                        };
                        if (data.camp == "All" || data.camp == "") {
                            delete matchobj["oldbottle.camp"];
                        }
                        if (!data.hospital || data.hospital == "") {
                            delete matchobj["oldbottle.hospital"];
                        }
                        db.collection('donor').aggregate([{
                            $unwind: "$oldbottle"
                        }, {
                            $match: matchobj
                        }, {
                            $project: {
                                _id: 0,
                                oldbottle: 1
                            }
                        }]).toArray(function(err, data2) {
                            if (err) {
                                console.log(err);
                                callback(err, null);
                            } else if (data2 && data2[0]) {
                                newreturns.verify = data2.length;
                                callback(null, newreturns);
                            } else {
                                newreturns.verify = 0;
                                callback(null, newreturns);
                            }
                        });
                    },
                    function(callback) {
                        var matchobj = {
                            "oldbottle.campnumber": data.campnumber,
                            "oldbottle.camp": data.camp,
                            "oldbottle.hospital": data.hospital,
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
                        if (data.camp == "All" || data.camp == "") {
                            delete matchobj["oldbottle.camp"];
                        }
                        if (!data.hospital || data.hospital == "") {
                            delete matchobj["oldbottle.hospital"];
                        }
                        db.collection('donor').aggregate([{
                            $unwind: "$oldbottle"
                        }, {
                            $match: matchobj
                        }, {
                            $project: {
                                _id: 0,
                                oldbottle: 1
                            }
                        }]).toArray(function(err, data3) {
                            if (err) {
                                console.log(err);
                                callback(err, null);
                            } else if (data3 && data3[0]) {
                                newreturns.gift = data3.length;
                                callback(null, newreturns);
                            } else {
                                newreturns.gift = 0;
                                callback(null, newreturns);
                            }
                        });
                    },
                    function(callback) {
                        var matchobj = {
                            "oldbottle.campnumber": data.campnumber,
                            "oldbottle.camp": data.camp,
                            "oldbottle.hospital": data.hospital,
                            "oldbottle.bottle": {
                                $exists: true
                            },
                            "oldbottle.verified": {
                                $exists: false
                            }
                        };
                        if (data.camp == "All") {
                            delete matchobj["oldbottle.camp"];
                        }
                        if (!data.hospital || data.hospital == "") {
                            delete matchobj["oldbottle.hospital"];
                        }
                        db.collection('donor').aggregate([{
                            $unwind: "$oldbottle"
                        }, {
                            $match: matchobj
                        }, {
                            $project: {
                                _id: 0,
                                oldbottle: 1
                            }
                        }]).toArray(function(err, data4) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false,
                                    comment: "Error"
                                });
                            } else if (data4 && data4[0]) {
                                newreturns.pendingV = data4.length;
                                callback(null, newreturns);
                            } else {
                                newreturns.pendingV = 0;
                                callback(null, newreturns);
                            }
                        });
                    },
                    function(callback) {
                        var matchobj = {
                            "oldbottle.campnumber": data.campnumber,
                            "oldbottle.camp": data.camp,
                            "oldbottle.hospital": data.hospital,
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
                        if (data.camp == "All") {
                            delete matchobj["oldbottle.camp"];
                        }
                        if (!data.hospital || data.hospital == "") {
                            delete matchobj["oldbottle.hospital"];
                        }
                        db.collection('donor').aggregate([{
                            $unwind: "$oldbottle"
                        }, {
                            $match: matchobj
                        }, {
                            $project: {
                                _id: 0,
                                oldbottle: 1
                            }
                        }]).toArray(function(err, data5) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false,
                                    comment: "Error"
                                });
                            } else if (data5 && data5[0]) {
                                newreturns.pendingG = data5.length;
                                callback(null, newreturns);
                            } else {
                                newreturns.pendingG = 0;
                                callback(null, newreturns);
                            }
                        });
                    },
                    function(callback) {
                        var matchobj = {
                            "oldbottle.campnumber": data.campnumber,
                            "oldbottle.camp": data.camp,
                            "oldbottle.hospital": data.hospital,
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
                        if (data.camp == "All") {
                            delete matchobj["oldbottle.camp"];
                        }
                        if (!data.hospital || data.hospital == "") {
                            delete matchobj["oldbottle.hospital"];
                        }
                        db.collection('donor').aggregate([{
                            $unwind: "$oldbottle"
                        }, {
                            $match: matchobj
                        }, {
                            $project: {
                                _id: 0,
                                oldbottle: 1
                            }
                        }]).toArray(function(err, data6) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false,
                                    comment: "Error"
                                });
                            } else if (data6 && data6[0]) {
                                newreturns.pendingG = data6.length;
                                callback(null, newreturns);
                            } else {
                                newreturns.pendingG = 0;
                                callback(null, newreturns);
                            }
                        });
                    },
                    function(callback) {
                        var matchobj = {
                            "oldbottle.campnumber": data.campnumber,
                            "oldbottle.camp": data.camp,
                            "oldbottle.hospital": data.hospital,
                            "oldbottle.bottle": {
                                $exists: false
                            }
                        };
                        if (data.camp == "All") {
                            delete matchobj["oldbottle.camp"];
                        }
                        if (!data.hospital || data.hospital == "") {
                            delete matchobj["oldbottle.hospital"];
                        }
                        db.collection('donor').aggregate([{
                            $unwind: "$oldbottle"
                        }, {
                            $match: matchobj
                        }, {
                            $project: {
                                _id: 0,
                                oldbottle: 1
                            }
                        }]).toArray(function(err, data6) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false,
                                    comment: "Error"
                                });
                            } else if (data6 && data6[0]) {
                                newreturns.rejected = data6.length;
                                callback(null, newreturns);
                            } else {
                                newreturns.rejected = 0;
                                callback(null, newreturns);
                            }
                        });
                    }
                ], function(err, data7) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false,
                            comment: "Error"
                        });
                        db.close();
                    } else if (data7) {
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
        });
    },
    countforHosp: function(data, callback) {
        var i = 0;
        var responseData = [];
        Hospital.find(data, function(hospres) {
            if (hospres.value != false) {
                _.each(hospres, function(z) {
                    sails.query(function(err, db) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false,
                                comment: "Error"
                            });
                        } else if (db) {
                            var matchobj = {
                                "oldbottle.campnumber": data.campnumber,
                                "oldbottle.camp": data.camp,
                                "oldbottle.hospital": sails.ObjectID(z._id),
                                "oldbottle.bottle": {
                                    $exists: true
                                },
                                "oldbottle.verified": {
                                    $exists: true
                                }
                            };
                            if (data.camp == "All" || data.camp == "") {
                                delete matchobj["oldbottle.camp"];
                            }
                            db.collection('donor').aggregate([{
                                $unwind: "$oldbottle"
                            }, {
                                $match: matchobj
                            }, {
                                $project: {
                                    _id: 0,
                                    oldbottle: 1
                                }
                            }]).toArray(function(err, data2) {
                                if (err) {
                                    console.log(err);
                                    callback({
                                        value: false,
                                        comment: "Error"
                                    });
                                    db.close();
                                } else if (data2 && data2[0]) {
                                    responseData.push({
                                        name: z.name,
                                        id: z._id,
                                        count: data2.length
                                    });
                                    i++;
                                    if (i == hospres.length) {
                                        callback(responseData);
                                    }
                                } else {
                                    i++;
                                    if (i == hospres.length) {
                                        callback(responseData);
                                    }
                                }
                            });
                        }
                    });
                });
            } else {
                callback({
                    value: false,
                    comment: "No hospital found"
                });
            }
        });
    },
    donorlevels: function(data, callback) {
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
        var donor = sails.ObjectID(data.donor);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false,
                    comment: "Error"
                });
            } else if (db) {
                if (data.accesslevel == "entry") {
                    var matchobj = {
                        donorid: check,
                        firstname: checkfirstname,
                        middlename: checkmiddlename,
                        lastname: checklastname,
                        pincode: data.pincode,
                        "oldbottle.campnumber": data.campnumber,
                        "oldbottle.camp": data.camp,
                        "oldbottle.bottle": {
                            $exists: true
                        }
                    };
                } else if (data.accesslevel == "verify") {
                    var matchobj = {
                        donorid: check,
                        firstname: checkfirstname,
                        middlename: checkmiddlename,
                        lastname: checklastname,
                        pincode: data.pincode,
                        "oldbottle.campnumber": data.campnumber,
                        "oldbottle.camp": data.camp,
                        "oldbottle.bottle": {
                            $exists: true
                        },
                        "oldbottle.verified": {
                            $exists: true
                        }
                    };
                } else if (data.accesslevel == "gift") {
                    var matchobj = {
                        donorid: check,
                        firstname: checkfirstname,
                        middlename: checkmiddlename,
                        lastname: checklastname,
                        pincode: data.pincode,
                        "oldbottle.campnumber": data.campnumber,
                        "oldbottle.camp": data.camp,
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
                } else if (data.accesslevel == "pendingV") {
                    var matchobj = {
                        donorid: check,
                        firstname: checkfirstname,
                        middlename: checkmiddlename,
                        lastname: checklastname,
                        pincode: data.pincode,
                        "oldbottle.campnumber": data.campnumber,
                        "oldbottle.camp": data.camp,
                        "oldbottle.bottle": {
                            $exists: true
                        },
                        "oldbottle.verified": {
                            $exists: false
                        }
                    };
                } else if (data.accesslevel == "pendingG") {
                    var matchobj = {
                        donorid: check,
                        firstname: checkfirstname,
                        middlename: checkmiddlename,
                        lastname: checklastname,
                        pincode: data.pincode,
                        "oldbottle.campnumber": data.campnumber,
                        "oldbottle.camp": data.camp,
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
                } else if (data.accesslevel == "rejected") {
                    var matchobj = {
                        donorid: check,
                        firstname: checkfirstname,
                        middlename: checkmiddlename,
                        lastname: checklastname,
                        pincode: data.pincode,
                        "oldbottle.campnumber": data.campnumber,
                        "oldbottle.camp": data.camp,
                        "oldbottle.bottle": {
                            $exists: false
                        }
                    };
                } else {
                    callback({
                        value: false,
                        comment: "Please provide accesslevel"
                    });
                }
                if (data.camp == "All") {
                    delete matchobj["oldbottle.camp"];
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
                if (data.pincode == "") {
                    delete matchobj.pincode;
                }
                callbackfunc1();

                function callbackfunc1() {
                    db.collection('donor').aggregate([{
                        $unwind: "$oldbottle"
                    }, {
                        $match: matchobj
                    }, {
                        $group: {
                            _id: donor,
                            count: {
                                $sum: 1
                            }
                        }
                    }, {
                        $project: {
                            count: 1
                        }
                    }]).toArray(function(err, result) {
                        if (result && result[0]) {
                            newreturns.total = result[0].count;
                            newreturns.totalpages = Math.ceil(result[0].count / data.pagesize);
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
                        db.collection('donor').aggregate([{
                            $unwind: "$oldbottle"
                        }, {
                            $match: matchobj
                        }, {
                            $project: {
                                _id: 0,
                                oldbottle: 1,
                                name: 1,
                                donorid: 1,
                                pincode: 1
                            }
                        }, {
                            $sort: {
                                name: 1
                            }
                        }]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false,
                                    comment: "Error"
                                });
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
    hospDonors: function(data, callback) {
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
        var donor = sails.ObjectID(data.donor);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false,
                    comment: "Error"
                });
            } else if (db) {
                var matchobj = {
                    firstname: checkfirstname,
                    middlename: checkmiddlename,
                    lastname: checklastname,
                    "oldbottle.campnumber": data.campnumber,
                    "oldbottle.camp": data.camp,
                    "oldbottle.hospital": sails.ObjectID(data.hospital),
                    "oldbottle.bottle": {
                        $exists: true
                    },
                    "oldbottle.verified": {
                        $exists: true
                    }
                };
                if (data.camp == "All") {
                    delete matchobj["oldbottle.camp"];
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
                if (data.pincode == "") {
                    delete matchobj.pincode;
                }
                callbackfunc1();

                function callbackfunc1() {
                    db.collection('donor').aggregate([{
                        $unwind: "$oldbottle"
                    }, {
                        $match: matchobj
                    }, {
                        $group: {
                            _id: donor,
                            count: {
                                $sum: 1
                            }
                        }
                    }, {
                        $project: {
                            count: 1
                        }
                    }]).toArray(function(err, result) {
                        if (result && result[0]) {
                            newreturns.total = result[0].count;
                            newreturns.totalpages = Math.ceil(result[0].count / data.pagesize);
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
                        db.collection('donor').aggregate([{
                            $unwind: "$oldbottle"
                        }, {
                            $match: matchobj
                        }, {
                            $project: {
                                _id: 0,
                                name: 1,
                                oldbottle: 1
                            }
                        }]).toArray(function(err, data2) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false,
                                    comment: "Error"
                                });
                                db.close();
                            } else if (data2 && data2[0]) {
                                newreturns.data = data2;
                                callback(newreturns);
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
                }
            }
        });
    },
    findCampHospital: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {

                console.log(err);
                callback({
                    value: false,
                    comment: "Error"
                });
            } else if (db) {
                db.collection('camp').aggregate([{
                    $match: {
                        campnumber: data.campnumber
                    }
                }, {
                    $unwind: "$venues"
                }, {
                    $match: {
                        "venues.value": data.camp
                    }
                }, {
                    $project: {
                        _id: 0,
                        "venues.hospital": 1
                    }
                }]).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false,
                            comment: "Error"
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        callback(data2[0].venues);
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
}
