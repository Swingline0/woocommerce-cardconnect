(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var WoocommereCardConnect = (function () {
    function WoocommereCardConnect(jQuery, csApiEndpoint) {
        var _this = this;
        this.getToken = function (number, callback) {
            if (!_this.validateCard(number))
                return callback(null, 'Invalid Credit Card Number');
            _this.$.get(_this.baseUrl + "&data=" + _this.cardNumber)
                .done(function (data) { return _this.processRequest(data, callback); })
                .fail(function (data) { return _this.failedRequest(data, callback); });
        };
        this.validateCard = function (number) {
            _this.cardNumber = number;
            if (_this.$.payment) {
                return _this.$.payment.validateCardNumber(_this.cardNumber);
            }
            else {
                return _this.cardNumber.length > 0;
            }
        };
        this.processRequest = function (data, callback) {
            var processToken = function (response) {
                var action = response.action, data = response.data;
                if (action === 'CE')
                    callback(data, null);
                else
                    callback(null, data);
            };
            eval(data);
        };
        this.failedRequest = function (data, callback) {
            return callback(null, 'Failed to connect to server');
        };
        this.$ = jQuery;
        this.baseUrl = csApiEndpoint + '?action=CE&type=json';
    }
    return WoocommereCardConnect;
})();
exports.default = WoocommereCardConnect;

},{}],2:[function(require,module,exports){
/// <reference path="./typings/tsd.d.ts"/>
var woocommerce_card_connect_1 = require("./woocommerce-card-connect");
jQuery(function ($) {
    var isLive = Boolean(wooCardConnect.isLive);
    var cc = new woocommerce_card_connect_1.default($, wooCardConnect.apiEndpoint);
    var $form = $('form.checkout, form#order_review');
    var $errors;
    if (!isLive) {
        setTimeout(function () {
            $form.find('#card_connect-cc-form input').change().keyup();
        }, 1000);
    }
    function formSubmit(ev) {
        if (0 === $('input.card-connect-token').size()) {
            $form.block({
                message: null,
                overlayCSS: {
                    background: '#fff',
                    opacity: 0.6
                }
            });
            var creditCard = $form.find('.wc-credit-card-form-card-number').val();
            if (!creditCard) {
                printWooError('Please enter a credit card number');
                return false;
            }
            else if (!checkCardType(creditCard)) {
                printWooError('Credit card type not accepted');
                return false;
            }
            cc.getToken(creditCard, function (token, error) {
                if (error) {
                    printWooError(error);
                    return false;
                }
                $('<input />')
                    .attr('name', 'card_connect_token')
                    .attr('type', 'hidden')
                    .addClass('card-connect-token')
                    .val(token)
                    .appendTo($form);
                $form.submit();
            });
            return false;
        }
        return true;
    }
    function checkCardType(cardNumber) {
        var cardType = $.payment.cardType(cardNumber);
        for (var i = 0; i < wooCardConnect.allowedCards.length; i++) {
            if (wooCardConnect.allowedCards[i] === cardType)
                return true;
        }
        return false;
    }
    function printWooError(error) {
        if (!$errors)
            $errors = $('.js-card-connect-errors', $form);
        var errorText;
        if (error.constructor === Array) {
            errorText = Array(error).reduce(function (prev, curr) { return prev += "<li>" + curr + "</li>"; });
        }
        else {
            errorText = "<li>" + error + "</li>";
        }
        $errors.html("<ul class=\"woocommerce-error\">" + errorText + "</ul>");
        $form.unblock();
    }
    $form.on('checkout_place_order_card_connect', formSubmit);
    $('form#order_review').on('submit', formSubmit);
    $('body').on('checkout_error', function () { return $('.card-connect-token').remove(); });
    $form.on('change', '.wc-credit-card-form-card-number', function () {
        $('.card-connect-token').remove();
    });
});

},{"./woocommerce-card-connect":1}]},{},[2]);
