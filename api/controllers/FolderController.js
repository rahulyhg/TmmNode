module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                folder();
            } else {
                res.json({
                    value: false,
                    comment: "Folder-id is incorrect"
                });
            }
        } else {
            folder();
        }

        function folder() {
            var print = function(data) {
                res.json(data);
            }
            Folder.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Folder.delete(req.body, print);
        } else {
            res.json({
                value: false,
                comment: "Folder-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Folder.find(req.body, callback);
    },
    findweb: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Folder.findweb(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Folder.findone(req.body, print);
        } else {
            res.json({
                value: false,
                comment: "Folder-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Folder.findlimited(req.body, callback);
    },
    villageUpdate: function(req, res) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                res.json({
                    value: false,
                    comment: "Error"
                });
            } else {
                var i = 0;
                var boochArr = [];
                db.collection("donor").find().each(function(err, doc) {
                    if (_.isEmpty(doc)) {
                        res.json({ booch: boochArr });
                    } else {
                        if (doc.village && Array.isArray(doc.village) == false) {
                            boochArr.push(doc.donorid);
                            var obj = {};
                            obj._id = "-1";
                            obj.name = doc.village;
                            doc.village = [];
                            doc.village.push(obj);
                            db.collection("donor").update({ _id: sails.ObjectID(doc._id) }, {
                                $set: { village: doc.village }
                            }, function(err, updated) {
                                console.log(err);
                                console.log(updated);
                            });
                        }
                    }
                });
            }
        });
    }
};
