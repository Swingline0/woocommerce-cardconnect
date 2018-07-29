import { debounce } from 'lodash';
import { Promise } from "bluebird";

import CardConnectTokenizer from "./checkout-card-secure-tokenizer";
import { WoocommerceCardConnectSettings } from "./interfaces";

declare const wooCardConnect : WoocommerceCardConnectSettings;
const SAVED_CARDS_SELECT = '#card_connect-cards';

export default ($ : any, csEndpoint : string, onTokenSuccess : Function, onError : Function) => {
    const cc = new CardConnectTokenizer($, csEndpoint);
    const $form : any = $('form.checkout, form#order_review');

    function getToken() : Promise<undefined> {
        return new Promise((resolve : Function, reject : Function) => {
            // If the form is already tokenized and ready to submit
            if (checkAllowSubmit()) {
                return resolve();
            }

            const $ccInput = $form.find('#card_connect-card-number');
            const creditCard = String($ccInput.val());

            if(creditCard.indexOf('\u2022') > -1) {
                // CC input field contains a masked card number suggesting it's already been processed
                return resolve();
            }

            $form.block({
                message: null,
                overlayCSS: {
                    background: '#fff',
                    opacity: 0.6
                }
            });
            if (!creditCard){
                onError('Please enter a credit card number');
                return reject();
            } else if (!checkCardType(creditCard)){
                onError('Credit card type not accepted');
                return reject();
            }
            cc.getToken(creditCard, function(token : string, error : string){
                if (error){
                    onError(error);
                    return reject();
                }
                // Mask user entered CC number
                $ccInput.val($.map(creditCard.split(''), (char : string, index : number) => {
                    if (creditCard.length - (index + 1) > 4 ){
                        return char !== ' ' ? '\u2022' : ' ';
                    } else {
                        return char;
                    }
                }).join(''));
                $form.unblock();
                onTokenSuccess(token);
                return resolve();
            });
        });
    }

    function checkAllowSubmit() : boolean {
        // if we have a token OR a 'saved card' is selected, return FALSE
        return !!$('input.card-connect-token', $form).length || !!$(SAVED_CARDS_SELECT).val();
    }

    function checkCardType(cardNumber : string) : boolean {
        let cardType = $.payment.cardType(cardNumber);
        for(let i = 0; i < wooCardConnect.allowedCards.length; i++) {
            if(wooCardConnect.allowedCards[i] === cardType) return true;
        }
        return false;
    }

    // Will wait to fire until 500ms of no additional calls
    const getTokenDebounced = debounce(getToken, 500);
    // Get token when focus of CC field is lost
    $form.on('blur', '#card_connect-card-number', () => {
        $('.js-card-connect-errors', $form).html('');
        getTokenDebounced();
    });

    // Bind Submit Listeners
    let isTokenizationInProgress = false;
    $form.on('checkout_place_order_card_connect', (event : Event) => {
        if (checkAllowSubmit()) {
            // Submit form if it's already tokenized
            return true;
        }
        if (isTokenizationInProgress) {
            return false;
        }
        event.preventDefault();
        event.stopPropagation();
        isTokenizationInProgress = true;
        getToken()
            .then(() => {
                $(event.target).submit();
            })
            .catch((err) => {
                console.error(err, 'Tokenization failed, can\'t submit form.');
                isTokenizationInProgress = false;
            });
        return false;
    });
    $('form#order_review').on('submit', () => checkAllowSubmit());

    // Clear token if form is changed
    $form.on('keyup change', `#card_connect-card-number, ${SAVED_CARDS_SELECT}`, () => {
        $('.card-connect-token').remove();
    });
};
