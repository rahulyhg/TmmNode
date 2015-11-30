/**
 * BloodController
 *
 * @description :: Server-side logic for managing bloods
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body) {
            if (req.body._id) {
                if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    blood();
                } else {
                    res.json({
                        value: false,
                        comment: "Blood-id is incorrect"
                    });
                }
            } else {
                blood();
            }

            function blood() {
                var print = function(data) {
                    res.json(data);
                }
                Blood.save(req.body, print);
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
                Blood.delete(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Blood-id is incorrect"
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
        Blood.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
                    res.json(data);
                }
                Blood.findone(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Blood-id is incorrect"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    saveblood: function(req, res) {
        if (req.body) {
            if (req.body.number && req.body.number != "") {
                var print = function(data) {
                    res.json(data);
                }
                Blood.saveblood(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Bottle number is needed"
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
                Blood.findlimited(req.body, callback);
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
    }
};
