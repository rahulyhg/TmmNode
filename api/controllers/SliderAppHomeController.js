/**
 * SliderAppHomeController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  save: function (req, res) {
    if (req.body) {
      if (req.body._id) {
        if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
          user();
        } else {
          res.json({
            value: false,
            comment: "SliderAppHome-id is incorrect"
          });
        }
      } else {
        user();
      }

      function user() {
        var print = function (data) {
          res.json(data);
        }
        SliderAppHome.save(req.body, print);
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  delete: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
        var print = function (data) {
          res.json(data);
        }
        SliderAppHome.delete(req.body, print);
      } else {
        res.json({
          value: false,
          comment: "SliderAppHome-id is incorrect"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  find: function (req, res) {
    function callback(data) {
      res.json(data);
    };
    SliderAppHome.find(req.body, callback);
  },
  findAll: function (req, res) {
    function callback(data) {
      res.json(data);
    };
    SliderAppHome.findAll(req.body, callback);
  },
  findone: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
        var print = function (data) {
          res.json(data);
        }
        SliderAppHome.findone(req.body, print);
      } else {
        res.json({
          value: false,
          comment: "Slider-id is incorrect"
        });
      }
    } else {
      res.json({
        value: false,
        comment: "Please provide parameters"
      });
    }
  },
  findlimited: function (req, res) {
    if (req.body) {
      if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
        function callback(data) {
          res.json(data);
        };
        SliderAppHome.findlimited(req.body, callback);
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
