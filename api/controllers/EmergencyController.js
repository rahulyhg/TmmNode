/**
 * EmergencyController
 *
 * @description :: Server-side logic for managing users
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
            comment: "Emergency-id is incorrect"
          });
        }
      } else {
        user();
      }

      function user() {
        var print = function(data) {
          res.json(data);
        }
        Emergency.save(req.body, print);
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
        Emergency.delete(req.body, print);
      } else {
        res.json({
          value: false,
          comment: "Emergency-id is incorrect"
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
    Emergency.find(req.body, callback);
  },
  findone: function(req, res) {
    if (req.body) {
      if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
        var print = function(data) {
          res.json(data);
        }
        Emergency.findone(req.body, print);
      } else {
        res.json({
          value: false,
          comment: "Emergency-id is incorrect"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  findByUser: function(req, res) {
    if (req.body) {
      if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
        var print = function(data) {
          res.json(data);
        }
        Emergency.findByUser(req.body, print);
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
  findlimited: function(req, res) {
    if (req.body) {
      if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
        function callback(data) {
          res.json(data);
        };
        Emergency.findlimited(req.body, callback);
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
  count: function(req, res) {
    if (req.body) {
      if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
        function callback(data) {
          res.json(data);
        };
        Emergency.count(req.body, callback);
      } else {
        res.json({
          value: false,
          comment: "Emergency-id is incorrect"
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
