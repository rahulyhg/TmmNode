/**
 * OrderController
 *
 * @description :: Server-side logic for managing Orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var http = require('http'),
    fs = require('fs'),
    qs = require('querystring'),
    crypto = require('crypto');
var redirect = "http://wohlig.co.in/tmmweb/#/";
module.exports = {
    save: function(req, res) {
        if (req.body) {
            if (req.body._id) {
                if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    admin();
                } else {
                    res.json({
                        value: false,
                        comment: "Order-id is incorrect"
                    });
                }
            } else {
                admin();
            }

            function admin() {
                var print = function(data) {
                    res.json(data);
                }
                Order.save(req.body, print);
            }
        } else {
            res.json({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
    postReq: function(req, res) {
        var body = '',
            workingKey = '05E578D41CD1CFA7965DD1084F485F88', //Put in the 32-Bit key shared by CCAvenues.
            accessCode = 'AVIU64DC50BL27UILB', //Put in the access code shared by CCAvenues.
            encRequest = '',
            formbody = '';
        if (req.query.data) {
            var abc = JSON.parse(req.query.data);
            body += qs.stringify(abc);
            encRequest = encrypt(body, workingKey);
            formbody = '<form id="nonseamless" method="post" name="redirect" action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><script language="javascript">document.redirect.submit();</script></form>';
            responseCall();
        }

        function responseCall() {
            res.writeHeader(200, { "Content-Type": "text/html" });
            res.write(formbody);
            res.end();
        }
    },
    postRes: function(req, res) {
        var ccavEncResponse = '',
            ccavResponse = '',
            workingKey = '05E578D41CD1CFA7965DD1084F485F88', //Put in the 32-Bit key provided by CCAvenues.
            ccavPOST = '';
        if (req.body) {
            ccavEncResponse = qs.stringify(req.body);
            ccavPOST = qs.parse(ccavEncResponse);
            var encryption = ccavPOST.encResp;
            ccavResponse = decrypt(encryption, workingKey);
            responseCall();
        }

        function responseCall() {
            ccavResponse = qs.parse(ccavResponse);
            if (ccavResponse.order_status == "success" || ccavResponse.order_status == "Success") {
                Order.save({
                    orderid: ccavResponse.order_id,
                    name: ccavResponse.billing_name,
                    mobile: ccavResponse.billing_tel,
                    status: "Success",
                    amount: ccavResponse.amount
                }, function(respo) {
                    if (ccavResponse.merchant_param1 && ccavResponse.merchant_param1 != "") {
                        res.redirect(redirect + "success/");
                    } else {
                        res.redirect("http://wohlig.co.in/paisoapk/success.html");
                    }
                    sails.request.get({
                        url: "http://esms.mytechnologies.co.in/api/smsapi.aspx?username=" + sails.smsUsername + "&password=" + sails.smsPassword + "&to=" + ccavResponse.billing_tel + "&from=TMMBLD&message=Thank you for donation. Your transaction was Successful."
                    }, function(err, httpResponse, body) {});
                });
            } else {
                Order.save({
                    orderid: ccavResponse.order_id,
                    name: ccavResponse.billing_name,
                    mobile: ccavResponse.billing_tel,
                    status: "Failed",
                    amount: ccavResponse.amount
                }, function(respo) {
                    if (ccavResponse.merchant_param1 && ccavResponse.merchant_param1 != "") {
                        res.redirect(redirect + "failure/" + ccavResponse.order_id);
                    } else {
                        res.redirect("http://wohlig.co.in/paisoapk/fail.html");
                    }
                });
            }
        }
    }
};

function encrypt(plainText, workingKey) {
    var m = crypto.createHash('md5');
    m.update(workingKey);
    var key = m.digest('binary');
    var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
    var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    var encoded = cipher.update(plainText, 'utf8', 'hex');
    encoded += cipher.final('hex');
    return encoded;
}

function decrypt(encText, workingKey) {
    var m = crypto.createHash('md5');
    m.update(workingKey)
    var key = m.digest('binary');
    var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
    var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    var decoded = decipher.update(encText, 'hex', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
}
