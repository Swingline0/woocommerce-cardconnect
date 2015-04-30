/// <reference path="./typings/tsd.d.ts"/>
declare let jQuery : any;
declare let wooCardConnect : any;
declare let window : any;
import WoocommereCardConnect from "./woocommerce-card-connect";

jQuery($ => {

  let isLive : boolean = Boolean(wooCardConnect.isLive);
  let cc = new WoocommereCardConnect($, wooCardConnect.apiEndpoint);
  let $form = $('form.checkout, form#order_review');
  let $errors;

  // Simulate some text entry to get jQuery Payment to reformat numbers
  if(!isLive){
    // Arbitrary set timout to delay for ajax events
    // no biggie if this fails, it's just for looks in sandbox mode..
    setTimeout(() => {
      $form.find('#card_connect-cc-form input').change().keyup();
    }, 1000);
  }

  function formSubmit(ev) : boolean {
    if(0 === $('input.card-connect-token').size()){
      $form.block({
        message: null,
        overlayCSS: {
          background: '#fff',
          opacity: 0.6
        }
      });
      let creditCard = $form.find('.wc-credit-card-form-card-number').val();
      if(!creditCard){
        printWooError('Please enter a credit card number');
        return false;
      }else if(!checkCardType(creditCard)){
        printWooError('Credit card type not accepted');
        return false;
      }
      cc.getToken(creditCard, function(token, error){
        if(error){
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

  function checkCardType(cardNumber : string) : boolean {
    let cardType = $.payment.cardType(cardNumber);
    for(let i = 0; i < wooCardConnect.allowedCards.length; i++) {
      if(wooCardConnect.allowedCards[i] === cardType) return true;
    }
    return false;
  }

  function printWooError(error : string | string[]) : void {

    if(!$errors) $errors = $('.js-card-connect-errors', $form);

    let errorText : string | string[]; // This should only be a string, TS doesn't like the reduce output though
    if(error.constructor === Array){
      errorText = Array(error).reduce((prev, curr) => prev += `<li>${curr}</li>`);
    }else{
      errorText = `<li>${error}</li>`;
    }

    $errors.html(`<ul class="woocommerce-error">${errorText}</ul>`);
    $form.unblock();
  }

  // Bind Submit Listeners
  $form.on('checkout_place_order_card_connect', formSubmit);
  $('form#order_review').on('submit', formSubmit);

  // Remove token on checkout err
  $('body').on('checkout_error', () => $('.card-connect-token').remove());

  // Clear token if form is changed
  $form.on('change', '.wc-credit-card-form-card-number', () => {
    $('.card-connect-token').remove();
  });

});
