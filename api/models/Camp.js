module.exports = {
    save: function(data, callback) {
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
                                }, function(err, deleted) {
                                    if (deleted) {
                                        callback({
                                            value: true,
                                            comment: "Admin deleted"
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
    find: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("camp").find().toArray(function(err, found) {
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
                        name: {
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
                            name: {
                                '$regex': check
                            }
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
        if (data.hospital && data.hospital != "") {
            data.hospital = sails.ObjectID(data.hospital);
        }
        var newreturns = {};
        var matchobj = {
            "oldbottle.campnumber": data.campnumber,
            "oldbottle.camp": data.camp,
            "oldbottle.hospital": data.hospital,
            "oldbottle.bottle": {
                $exists: true
            }
        };
        if (data.camp == "All") {
            delete matchobj["oldbottle.camp"];
        }
        if (!data.hospital || data.hospital == "") {
            delete matchobj["oldbottle.hospital"];
        }
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false,
                    comment: "Error"
                });
            } else if (db) {
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
                        newreturns.entry = data2.length;
                        callfunc1();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });

                function callfunc1() {
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
                    }]).toArray(function(err, data3) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false,
                                comment: "Error"
                            });
                            db.close();
                        } else if (data3 && data3[0]) {
                            newreturns.verify = data3.length;
                            callfunc2();
                        } else {
                            callback(newreturns);
                            db.close();
                        }
                    });
                }

                function callfunc2() {
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
                            db.close();
                        } else if (data4 && data4[0]) {
                            newreturns.gift = data4.length;
                            callback(newreturns);
                            db.close();
                        } else {
                            callback(newreturns);
                            db.close();
                        }
                    });
                }
            }
        });
    },
    countforHosp: function(data, callback) {
        if (data.hospital && data.hospital != "") {
            data.hospital = sails.ObjectID(data.hospital);
        }
        var newreturns = {};
        var matchobj = {
            "oldbottle.campnumber": data.campnumber,
            "oldbottle.camp": data.camp,
            "oldbottle.hospital": data.hospital,
            "oldbottle.bottle": {
                $exists: true
            }
        };
        if (data.camp == "All") {
            delete matchobj["oldbottle.camp"];
        }
        if (!data.hospital || data.hospital == "") {
            delete matchobj["oldbottle.hospital"];
        }
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false,
                    comment: "Error"
                });
            } else if (db) {
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
                        newreturns.entry = data2.length;
                        // callfunc1();
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
    donorlevels: function(data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.donorid, "i");
        var checkname = new RegExp(data.name, "i");
        var checkfirstname = new RegExp(data.firstname, "i");
        var checklastname = new RegExp(data.lastname, "i");
        var checkmiddlename = new RegExp(data.middlename, "i");
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
                        name: checkname,
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
                        name: checkname,
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
                        name: checkname,
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
                                donorid: 1
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
    }
};
