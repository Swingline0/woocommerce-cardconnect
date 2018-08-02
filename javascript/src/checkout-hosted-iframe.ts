import { includes, get, reduce } from 'lodash';
import * as computedStyle from 'computed-style';

import { IFRAME_CSS_WHITELIST } from './constants';
import { WoocommerceCardConnectSettings } from "./interfaces";

declare const wooCardConnect : WoocommerceCardConnectSettings;

export default ($ : any, csEndpoint : string, onTokenSuccess : Function, onError : Function) => {

    const { iframeOptions: { autostyle } } = wooCardConnect;

    // If autostyling is enabled, scrape styles and replace iframe with a new iteration
    if (autostyle) {
        const $frame = $('#card_connect-iframe');
        const $cardHolderName = $('#card_connect-card-name');
        const inputHeight = $cardHolderName.outerHeight();
        const inputStyles = extractStyles($cardHolderName[0]);
        const inputStyleBlock = encodeURIComponent(`
            body {margin: 0;}
            input {${inputStyles}}
            .error {border: 1px solid red;}
        `);
        const frameSrc = $frame.attr('src');
        const querystring = `css=${inputStyleBlock}`;

        const setIframeSrc = () => {
            if (inputStyles) {
                $('#card_connect-iframe').replaceWith($(`
                  <iframe
                    width="100%"
                    height="${inputHeight}"
                    style="margin-bottom: 0;"
                    id="card_connect-iframe"
                    src="${frameSrc}&${querystring}"
                    frameborder="0"
                    scrolling="no"/>
                `));
            }
        };
        // Woocommerce will "reload" the section which contains this field, as such it must be re-set each time
        $('body').on('updated_checkout', setIframeSrc);
        setIframeSrc();
    }

    // Bind event listener
    window.addEventListener('message', function(event : MessageEvent) {
        if (!includes(csEndpoint, event.origin)) {
            return;
        }
        try {
            const messagePayload = JSON.parse(event.data);
            const token = get(messagePayload, 'message', false);
            if (!token) {
                return onError(get(messagePayload, 'errorMessage', 'Bad response from CardConnect.'));
            }
            onTokenSuccess(token, 'token');
        } catch (e) {
            onError(e.toString());
        }
    }, false);
}

/**
 * Returns a string off CSS properties from the given element which
 *
 * Only returns styles from whitelisted properties (via CardConnect)
 * Only returns styles which have a value
 * @param {Node} DOM node
 * @returns {string} A string of CSS properties and values (e.g. "color: red; font-weight: bold;")
 */
function extractStyles(node : Node) {
    const computedStyles = reduce(IFRAME_CSS_WHITELIST, (carry, cssProp) => {
        const styleValue = computedStyle(node, cssProp);
        if (!styleValue) {
            return carry;
        }
        carry += `${cssProp}: ${styleValue};`;
        return carry;
    }, '');
    return computedStyles;
}
