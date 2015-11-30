/**
 * GiftController
 *
 * @description :: Server-side logic for managing feeds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body) {
            if (req.body.camp && req.body.camp != "" && sails.ObjectID.isValid(req.body.camp)) {
                if (req.body._id) {
                    if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                        feed();
                    } else {
                        res.json({
                            value: false,
                            comment: "Gift-id is incorrect"
                        });
                    }
                } else {
                    feed();
                }
            } else {
                res.json({
                    value: false,
                    comment: "camp-id is incorrect "
                });
            }

            function feed() {
                var print = function(data) {
                    res.json(data);
                }
                Gift.save(req.body, print);
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
            if (req.body.camp && req.body.camp != "" && sails.ObjectID.isValid(req.body.camp)) {
                if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    var print = function(data) {
                        res.json(data);
                    }
                    Gift.delete(req.body, print);
                } else {
                    res.json({
                        value: false,
                        comment: "Gift-id is incorrect"
                    });
                }
            } else {
                res.json({
                    value: false,
                    comment: "camp-id is incorrect "
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
        if (req.body) {
            if (req.body.camp && req.body.camp != "" && sails.ObjectID.isValid(req.body.camp)) {
                function callback(data) {
                    res.json(data);
                };
                Gift.find(req.body, callback);
            } else {
                res.json({
                    value: false,
                    comment: "camp-id is incorrect "
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    findone: function(req, res) {
        if (req.body) {
            if (req.body.camp && req.body.camp != "" && sails.ObjectID.isValid(req.body.camp)) {
                if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    var print = function(data) {
                        res.json(data);
                    }
                    Gift.findone(req.body, print);
                } else {
                    res.json({
                        value: false,
                        comment: "Gift-id is incorrect"
                    });
                }
            } else {
                res.json({
                    value: false,
                    comment: "camp-id is incorrect "
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
            if (req.body.camp && req.body.camp != "" && sails.ObjectID.isValid(req.body.camp)) {
                if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
                    function callback(data) {
                        res.json(data);
                    };
                    Gift.findlimited(req.body, callback);
                } else {
                    res.json({
                        value: false,
                        comment: "Please provide parameters"
                    });
                }
            } else {
                res.json({
                    value: false,
                    comment: "camp-id is incorrect "
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
