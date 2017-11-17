/**
 * table.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
    save: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else if (db) {
                if (!data._id) {
                    data._id = sails.ObjectID();
                    db.collection('table').insert(data, function(err, created) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else if (created) {
                            callback({
                                value: true
                            });
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "Not Created"
                            });
                            db.close();
                        }
                    });
                } else {
                    var table = sails.ObjectID(data._id);
                    delete data._id;
                    db.collection('table').update({
                        _id: table
                    }, {
                        $set: data
                    }, function(err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
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
    findlimited: function(data, callback) {
        var newcallback = 0;
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        var pagesize = data.pagesize;
        var pagenumber = data.pagenumber;
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("table").count({
                    title: {
                        '$regex': check
                    }
                }, function(err, number) {
                    if (number) {
                        newreturns.total = number;
                        newreturns.totalpages = Math.ceil(number / data.pagesize);
                        callbackfunc();
                    } else if (err) {
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
                    db.collection("table").find({
                        title: {
                            '$regex': check
                        }
                    }, {}).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
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
        });
    },
    find: function(data, callback) {
        var returns = [];
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("table").find({}, {}).toArray(function(err, found) {
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
                db.collection("table").find({
                    "_id": sails.ObjectID(data._id)
                }, {}).toArray(function(err, found) {
                    if (err) {
                        callback({
                            value: false
                        });
                        console.log(err);
                        db.close();
                    } else if (found && found[0]) {
                        callback(found[0]);
                        db.close()
                    } else {

                    }
                });
            }
        });
    },
    findCount: function(data, callback) {
        var matchobj = {
            campnumber: data.campnumber,
            camp: data.camp
        };
        if (data.camp == "All" || data.camp == "") {
            delete matchobj.camp;
        }
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
               // console.log(matchobj);
                db.collection("table").find(matchobj).toArray(function(err, found) {
                    if (err) {
                        callback({
                            value: false
                        });
                        console.log(err);
                        db.close();
                    } else if (found && found[0]) {
                        callback(found);
                        db.close()
                    } else {
                        Camp.findMe(data, function(countme) {
                            var responseData = [];
                            if (countme.value != false) {
                                var i = 0;

                                function callme(abc) {
                                    var z = {};
                                    z = countme[abc];
                                    var donor = sails.ObjectID(data.donor);
                                    var newreturns = {};
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
                                                        "oldbottle.hospital": sails.ObjectID(z._id),
                                                        "oldbottle.camp": data.camp,
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
                                                        if (err) {
                                                            console.log(err);
                                                            callback(err, null);
                                                        } else if (result && result[0]) {
                                                            newreturns.verify = result[0].count;
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
                                                        "oldbottle.hospital": sails.ObjectID(z._id),
                                                        "oldbottle.camp": data.camp,
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
                                                    if (data.camp == "All" || data.camp == "") {
                                                        delete matchobj["oldbottle.camp"];
                                                    }
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
                                                        if (err) {
                                                            console.log(err);
                                                            callback(err, null);
                                                        } else if (result && result[0]) {
                                                            newreturns.gift = result[0].count;
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
                                                        "oldbottle.hospital": sails.ObjectID(z._id),
                                                        "oldbottle.camp": data.camp,
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
                                                        if (err) {
                                                            console.log(err);
                                                            callback(err, null);
                                                        } else if (result && result[0]) {
                                                            newreturns.pendingV = result[0].count;
                                                            callback(null, newreturns);
                                                        } else {
                                                            newreturns.pendingV = 0;
                                                            callback(null, newreturns);
                                                        }
                                                    });
                                                },
                                                function(callback) {
                                                    var matchobj = {
                                                        "oldbottle.camp": z.camp,
                                                        "oldbottle.deletedcamp": data.campnumber,
                                                        "oldbottle.hospitalname": z.name
                                                    };
                                                    if (data.camp == "All") {
                                                        delete matchobj["oldbottle.camp"];
                                                    }
                                                    db.collection('donor').aggregate([{
                                                        $unwind: "$oldbottle"
                                                    }, {
                                                        $match: matchobj
                                                    }, {
                                                        $group: {
                                                            _id: null,
                                                            count: {
                                                                $sum: 1
                                                            }
                                                        }
                                                    }, {
                                                        $project: {
                                                            count: 1
                                                        }
                                                    }]).toArray(function(err, result) {
                                                        if (err) {
                                                            console.log(err);
                                                            callback(err, null);
                                                        } else if (result && result[0]) {
                                                            // console.log("rejected");
                                                            // console.log(result[0].count);
                                                            // console.log(result);
                                                            newreturns.rejected = result[0].count;
                                                            callback(null, newreturns);
                                                        } else {
                                                            newreturns.rejected = 0;
                                                            callback(null, newreturns);
                                                        }
                                                    });
                                                },
                                                function(callback) {
                                                    var matchobj = {
                                                        "oldbottle.campnumber": data.campnumber,
                                                        "oldbottle.hospital": sails.ObjectID(z._id),
                                                        "oldbottle.camp": data.camp,
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
                                                    if (data.camp == "All" || data.camp == "") {
                                                        delete matchobj["oldbottle.camp"];
                                                    }
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
                                                        if (err) {
                                                            console.log(err);
                                                            callback(err, null);
                                                        } else if (result && result[0]) {
                                                            newreturns.giftRejected = result[0].count;
                                                            callback(null, newreturns);
                                                        } else {
                                                            newreturns.giftRejected = 0;
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
                                                    newreturns.hospitalname = z.name;
                                                    newreturns.id = z._id;
                                                    newreturns.campnumber = data.campnumber;
                                                    newreturns.camp = z.camp;
                                                    Table.save(newreturns, function(respoTab) {
                                                        if (respoTab.value != false) {
                                                            responseData.push(newreturns);
                                                            abc++;
                                                            if (abc == countme.length) {
                                                                // console.log("abc " + abc);
                                                                // console.log("countme.length " + countme.length);
                                                                callback(responseData);
                                                                db.close();
                                                            } else {
                                                                callme(abc);
                                                            }
                                                        } else {
                                                            callback({
                                                                value: false,
                                                                comment: "Error in save"
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
                                }
                                callme(0);
                            } else {
                                Camp.countlevels(data, function(countResp) {
                                    if (countResp.value != false) {
                                        countResp.campnumber = data.campnumber;
                                        Table.save(countResp, function(respoTab) {
                                            if (respoTab.value != false) {
                                                responseData.push(countResp);
                                                callback(responseData);
                                                db.close();
                                            } else {
                                                callback({
                                                    value: false,
                                                    comment: "Error in save"
                                                });
                                                db.close();
                                            }
                                        });
                                    } else {
                                        callback({
                                            value: false,
                                            comment: "No data found"
                                        });
                                    }
                                });
                            }
                        });
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
            db.collection('table').remove({
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
    deleteAll: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            db.collection('table').remove({}, function(err, deleted) {
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
    }
};
