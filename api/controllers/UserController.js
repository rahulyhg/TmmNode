/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body) {
            if (req.body._id) {
                if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    user();
                } else {
                    res.json({
                        value: false,
                        comment: "User-id is incorrect"
                    });
                }

                function user() {
                    var print = function(data) {
                        res.json(data);
                    }
                    User.save(req.body, print);
                }
            } else {
                user();
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    find: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        User.find(req.body, print);
    },
    findlimited: function(req, res) {
        if (req.body) {
            if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
                function callback(data) {
                    res.json(data);
                };
                User.findlimited(req.body, callback);
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
    },
    findone: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
                    res.json(data);
                }
                User.findone(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "User id incorrect"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    updateforapp: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                var print = function(data) {
                    res.json(data);
                }
                User.updateforapp(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "Donor id incorrect"
                });
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
                User.delete(req.body, print);
            } else {
                res.json({
                    value: false,
                    comment: "User-id is incorrect"
                });
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    countnotify: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            User.countnotify(req.body, print);
        } else {
            res.json({
                value: false,
                comment: "User-id is incorrect"
            });
        }
    },
    sendSMS: function(req, res) {
        if (req.body && req.body.mobile && req.body.mobile.toString().length == 10) {
            var otp = Math.floor(Math.random() * 900000) + 100000;
            sails.request.get({
                url: "http://esms.mytechnologies.co.in/api/smsapi.aspx?username=" + sails.smsUsername + "&password=" + sails.smsPassword + "&to=" + req.body.mobile + "&from=TMMBLD&message=Your One Time Password for TMM App is " + otp
            }, function(err, httpResponse, body) {
                if (err) {
                    console.log(err);
                    res.json({
                        value: false,
                        comment: "Some Error"
                    });
                } else {
                    res.json({
                        value: true,
                        otp: otp
                    });
                }
            });
        } else {
            res.json({
                value: false,
                comment: "Invalid mobile no."
            });
        }
    },
    saveApp: function(req, res) {
        if (req.body) {
            var print = function(data) {
                res.json(data);
            }
            User.saveApp(req.body, print);
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    }
};
