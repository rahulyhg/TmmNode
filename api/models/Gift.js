module.exports = {
    save: function(data, callback) {
        if (data.camp && data.camp != "") {
            sails.query(function(err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (db) {
                    var camp = sails.ObjectID(data.camp);
                    delete data.camp;
                    if (!data._id) {
                        data._id = sails.ObjectID();
                        db.collection("camp").update({
                            _id: camp
                        }, {
                            $push: {
                                gift: data
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
                                    value: true
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
                        data._id = sails.ObjectID(data._id);
                        var tobechanged = {};
                        var attribute = "gift.$.";
                        _.forIn(data, function(value, key) {
                            tobechanged[attribute + key] = value;
                        });
                        db.collection("camp").update({
                            "_id": camp,
                            "gift._id": data._id
                        }, {
                            $set: tobechanged
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
        } else {
            callback({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    delete: function(data, callback) {
        if (data.camp && data.camp != "") {
            var camp = sails.ObjectID(data.camp);
            delete data.camp;
            data._id = sails.ObjectID(data._id);
            sails.query(function(err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (db) {
                    db.collection("camp").update({
                        _id: camp
                    }, {
                        $pull: {
                            "gift": {
                                "_id": sails.ObjectID(data._id)
                            }
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
        } else {
            callback({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    //Findlimited
    findlimited: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                var newreturns = {};
                var check = new RegExp(data.search, "i");
                var pagesize = data.pagesize;
                var pagenumber = data.pagenumber;
                var camp = sails.ObjectID(data.camp);
                var matchobj = {
                    "gift.user": {
                        $exists: true
                    },
                    "gift.user": {
                        $regex: check
                    }
                };
                callbackfunc1();

                function callbackfunc1() {
                    db.collection("camp").aggregate([{
                        $match: {
                            _id: camp
                        }
                    }, {
                        $unwind: "$gift"
                    }, {
                        $match: matchobj
                    }, {
                        $group: {
                            _id: camp,
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
                        db.collection("camp").aggregate([{
                            $match: {
                                _id: camp
                            }
                        }, {
                            $unwind: "$gift"
                        }, {
                            $match: matchobj
                        }, {
                            $project: {
                                gift: 1
                            }
                        }]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                            if (found && found[0]) {
                                newreturns.data = found;
                                callback(newreturns);
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
                }
            }
        });
    },
    //Findlimited
    findone: function(data, callback) {
        if (data.camp && data.camp != "") {
            var camp = sails.ObjectID(data.camp);
            sails.query(function(err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (db) {
                    db.collection("camp").find({
                        _id: camp,
                        "gift._id": sails.ObjectID(data._id)
                    }, {
                        "gift.$": 1
                    }).toArray(function(err, data2) {
                        if (data2 && data2[0] && data2[0].gift && data2[0].gift[0]) {
                            callback(data2[0].gift[0]);
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
        } else {
            callback({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    find: function(data, callback) {
        if (data.camp && data.camp != "") {
            var camp = sails.ObjectID(data.camp);
            sails.query(function(err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (db) {
                    db.collection("camp").aggregate([{
                        $match: {
                            _id: camp,
                            "gift.user": {
                                $exists: true
                            }
                        }
                    }, {
                        $unwind: "$gift"
                    }, {
                        $match: {
                            "gift.user": {
                                $exists: true
                            }
                        }
                    }, {
                        $project: {
                            gift: 1
                        }
                    }]).toArray(function(err, data2) {
                        if (data2 && data2[0] && data2[0].gift && data2[0].gift[0]) {
                            callback(data2);
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
        } else {
            callback({
                value: false,
                comment: "Please provide parameters"
            });
        }
    }
};
