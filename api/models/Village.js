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
                    db.collection("village").find({
                        "name": data.name
                    }).toArray(function(err, data2) {
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
                            db.collection('village').insert(data, function(err, created) {
                                if (err) {
                                    console.log(err);
                                    callback({
                                        value: false
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
                } else {
                    var village = sails.ObjectID(data._id);
                    delete data._id;
                    db.collection('village').update({
                        _id: village
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

                db.collection("village").count({
                    name: {
                        '$regex': check
                    }
                }, function(err, number) {
                    if (number) {
                        newreturns.total = number;
                        newreturns.totalpages = Math.ceil(number / data.pagesize);
                        callbackfunc1();
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

                function callbackfunc1() {
                    db.collection("village").find({
                        name: {
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
        if (data.search && data.village) {
            var returns = [];
            var exit = 0;
            var exitup = 1;
            var check = new RegExp(data.search, "i");

            function callback2(exit, exitup, data) {
                if (exit == exitup) {
                    callback(data);
                }
            }
            sails.query(function(err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });

                }
                if (db) {
                    db.collection("village").find({
                        name: {
                            '$regex': check
                        }
                    }).limit(10).toArray(function(err, found) {
                        if (err) {
                            callback({
                                value: false
                            });
                            console.log(err);
                            db.close();
                        } else if (found != null) {
                            exit++;
                            if (data.village.length != 0) {
                                var nedata;
                                nedata = _.remove(found, function(n) {
                                    var flag = false;
                                    _.each(data.village, function(n1) {
                                        if (n1.name == n.name) {
                                            flag = true;
                                        }
                                    })
                                    return flag;
                                });
                            }
                            returns = returns.concat(found);
                            callback2(exit, exitup, returns);
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
    findone: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("village").find({
                    "_id": sails.ObjectID(data._id)
                }, {}).toArray(function(err, data2) {
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
    delete: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            var cvillage = db.collection('village').remove({
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
    savevillage: function(data, callback) {
        var newdata = {};
        newdata.name = data.village;
        newdata._id = sails.ObjectID();
        sails.query(function(err, db) {
            var exit = 0;
            var exitup = 0;
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                exit++;
                db.collection("village").find({
                    name: data.village
                }).each(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2 != null) {
                        exitup++;
                        callback({
                            _id: data2._id,
                            name: data2.name
                        });
                        db.close();
                    } else {
                        if (exit != exitup) {
                            db.collection('village').insert(newdata, function(err, created) {
                                if (err) {
                                    console.log(err);
                                    callback({
                                        value: false
                                    });
                                    db.close();
                                } else if (created) {
                                    callback({
                                        _id: newdata._id,
                                        name: newdata.name
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
            }
        });
    }
};
