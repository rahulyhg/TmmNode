/**
 * RequestController
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
            comment: "Request-id is incorrect"
          });
        }
      } else {
        user();
      }

      function user() {
        var print = function(data) {
          res.json(data);
        }
        Request.save(req.body, print);
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
        Request.delete(req.body, print);
      } else {
        res.json({
          value: false,
          comment: "Request-id is incorrect"
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
    Request.find(req.body, callback);
  },
  findById: function(req, res) {
    if (req.body) {
      if (req.body.getid && req.body.getid != "" && sails.ObjectID.isValid(req.body.getid)) {
        function callback(data) {
          res.json(data);
        };
        Request.findById(req.body, callback);
      } else {
        res.json({
          value: false,
          comment: "Request-id is incorrect"
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
        Request.findone(req.body, print);
      } else {
        res.json({
          value: false,
          comment: "Request-id is incorrect"
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
        Request.findlimited(req.body, callback);
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
