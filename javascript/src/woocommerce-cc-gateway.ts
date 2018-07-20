import { Promise } from 'bluebird';
import { debounce } from 'lodash';

import CardConnectTokenizer from "./card-connect-tokenizer";
import SavedCards from './saved-cards';

interface JQueryGlobal extends JQueryStatic {
    payment: any;
}

// Global config object provided via wp_localize_script
interface WoocommerceCardConnectSettings {
    isLive: boolean;
    profilesEnabled: boolean;
    apiEndpoint: string;
    allowedCards: Array<String>;
    userSignedIn: boolean;
}

declare const wooCardConnect : WoocommerceCardConnectSettings;

const SAVED_CARDS_SELECT = '#card_connect-cards';

jQuery(($: JQueryGlobal) => {
    const cc = new CardConnectTokenizer($, wooCardConnect.apiEndpoint);
    const $form : any =  $('form.checkout, form#order_review');
    const $body = $('body');
    let $errors : JQuery<HTMLElement>;

    if (wooCardConnect.profilesEnabled) {
        $body.on('updated_checkout', SavedCards.init);
        $form.on('ready', SavedCards.init);
    }

    // Simulate some text entry to get jQuery Payment to reformat numbers
    // if(!wooCardConnect.isLive){
    //     $body.on('updated_checkout', getToken);
    // }

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
                printWooError('Please enter a credit card number');
                return reject();
            } else if (!checkCardType(creditCard)){
                printWooError('Credit card type not accepted');
                return reject();
            }
            cc.getToken(creditCard, function(token : string, error : string){
                if (error){
                    printWooError(error);
                    return reject();
                }
                // Append token as hidden input
                $('<input />')
                    .attr('name', 'card_connect_token')
                    .attr('type', 'hidden')
                    .addClass('card-connect-token')
                    .val(token)
                    .appendTo($form);

                // Mask user entered CC number
                $ccInput.val($.map(creditCard.split(''), (char, index) => {
                    if (creditCard.length - (index + 1) > 4 ){
                        return char !== ' ' ? '\u2022' : ' ';
                    } else {
                        return char;
                    }
                }).join(''));
                $form.unblock();
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

    // Will wait to fire until 500ms of no additional calls
    const getTokenDebounced = debounce(getToken, 500);
    // Get token when focus of CC field is lost
    $form.on('blur', '#card_connect-card-number', () => {
        if($errors) $errors.html('');
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

    // Remove token on checkout err
    $body.on('checkout_error', () => {
        if($errors) $errors.html('');
        $('.card-connect-token').remove();
    });

    // Clear token if form is changed
    $form.on('keyup change', `#card_connect-card-number, ${SAVED_CARDS_SELECT}`, () => {
        $('.card-connect-token').remove();
    });
});
