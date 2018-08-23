import { map, isArray } from 'lodash';

import { WoocommerceCardConnectSettings } from './interfaces';
import initCardSecure from './checkout-card-secure';
import initHostedIframe from './checkout-hosted-iframe';
import SavedCards from './saved-cards';

declare const wooCardConnect : WoocommerceCardConnectSettings;

jQuery(($: any) => {
    const { apiEndpoint: { basePath, cs, itoke }, iframeOptions } = wooCardConnect;
    const $form = $('form.checkout, form#order_review');
    const $body = $('body');
    let $errors : JQuery<HTMLElement>;
    const $tokenInput = $('<input />')
        .attr('name', 'card_connect_token')
        .attr('type', 'hidden')
        .addClass('card-connect-token')
        .appendTo($form);

    if (wooCardConnect.profilesEnabled) {
        $body.on('updated_checkout', SavedCards.init);
        $form.on('ready', SavedCards.init);
    }

    /**
     * Success callback used for both CardSecure and Hosted iFrame integrations
     *
     * The function simply appends a hidden input to the checkout form and sets
     * the value based on what is passed to it.
     * @param {string} token
     */
    function onTokenSuccess(token : string) : void {
        $tokenInput.val(token);
    }

    /**
     * Display errors on the checkout form
     *
     * Wraps a one or many errors in <li>'s and displays them on the form
     * @param {string | string[]} error
     * @param {boolean} clearToken - reset token on error push
     */
    function onError(error : string | string[], clearToken : boolean) : void {
        if (!$errors) $errors = $('.js-card-connect-errors', $form);

        // Map an array of strings into individual <li>'s, or wrap a single error in <li> tags
        const errorText : string = isArray(error)
            ? map(error, curr => `<li>${curr}</li>`).join('')
            : `<li>${error}</li>`;

        $errors.html(`<ul class="woocommerce-error">${errorText}</ul>`);

        $([document.documentElement, document.body]).animate({
            scrollTop: $('.payment_method_card_connect').offset().top
        }, 500);

        // Clear any existing value from the hidden token input
        if ($tokenInput && clearToken) $tokenInput.val('');
        $form.unblock();
    }

    // Initialize logic to marshall the rest of the checkout process
    if (iframeOptions.enabled) {
        initHostedIframe($, `${basePath}${itoke}`, onTokenSuccess, onError)
    } else {
        initCardSecure($, `${basePath}${cs}`, onTokenSuccess, onError);
    }
});
