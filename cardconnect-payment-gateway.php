<?php
/**
 * Plugin Name: CardConnect Payment Gateway
 * Plugin URI: https://wordpress.org/plugins/cardconnect-payment-module
 * Description: Accept credit card payments in your WooCommerce store!
 * Version: 3.0.2
 * Author: CardConnect <jle@cardconnect.com>
 * Author URI: https://cardconnect.com
 * License: GNU General Public License v2
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 *
 * WC requires at least: 3.0
 * WC tested up to: 3.4.4
 *
 * @version 3.0.2
 * @author CardConnect
 */

/*
	Copyright: © 2016 CardConnect <jle@cardconnect.com>
*/

if(!defined('ABSPATH')){
	exit; // Exit if accessed directly
}

define('WC_CARDCONNECT_VER', '3.0.2');
define('WC_CARDCONNECT_PLUGIN_PATH', untrailingslashit(plugin_basename(__DIR__)));
define('WC_CARDCONNECT_TEMPLATE_PATH', untrailingslashit(plugin_dir_path(__FILE__)) . '/templates/');
define('WC_CARDCONNECT_PLUGIN_URL', untrailingslashit(plugins_url('', __FILE__)));

add_action('plugins_loaded', 'CardConnectPaymentGateway_init', 0);

/**
 * Initializes Card Connect Gateway
 *
 * @return void
 * @since 0.5.0
 */
function CardConnectPaymentGateway_init(){

	// Append local includes dir to include path
	set_include_path(get_include_path() . PATH_SEPARATOR . plugin_dir_path(__FILE__) . 'includes');

	if(class_exists('CardConnectPaymentGateway') || !class_exists('WC_Payment_Gateway')){
		return;
	}

	// Include Composer dependencies
    include_once 'vendor/autoload.php';
    global $cardconnect_raven;
    try {
        // Raven is Sentry.io's Logging and Tracing utility
        // We don't want to capture all server errors, so will just use an action hook to pass exceptions to it.
        Raven_Autoloader::register();
        $cardconnect_raven = new Raven_Client('https://441f18f1f5c84f0ea52c5142fa154bb8@sentry.io/1246888');
    } catch (Exception $exception) {
        // Failed to register logging utility
        $cardconnect_raven = false;
    }

    // Include Classes
    include_once 'classes/class-wc-gateway-cardconnect.php';
	include_once 'classes/class-wc-gateway-cardconnect-saved-cards.php';

	// Include Class for WooCommerce Subscriptions extension
	if(class_exists('WC_Subscriptions_Order')){

		if ( ! function_exists( 'wcs_create_renewal_order' ) ) {
			// Subscriptions 1.x
			include_once 'classes/class-wc-gateway-cardconnect-addons-deprecated.php';
		} else {
			// Subscriptions 2.x
			include_once 'classes/class-wc-gateway-cardconnect-addons.php';
		}
	}

	// Include Class for WooCommerce Pre-Orders extension
	if(class_exists('WC_Pre_Orders')){
		include_once 'classes/class-wc-gateway-cardconnect-addons.php';
	}



	/**
	 * Add the Gateway to WooCommerce
	 **/
	add_filter('woocommerce_payment_gateways', 'woocommerce_add_gateway_CardConnectPaymentGateway');
	function woocommerce_add_gateway_CardConnectPaymentGateway($methods){


		if(class_exists('WC_Subscriptions_Order')){
			// handling for WooCommerce Subscriptions extension

			if ( ! function_exists( 'wcs_create_renewal_order' ) ) {
				// Subscriptions 1.x
				$methods[] = 'CardConnectPaymentGatewayAddonsDeprecated';
			} else {
				// Subscriptions 2.x
				$methods[] = 'CardConnectPaymentGatewayAddons';
			}

		}
		elseif(class_exists('WC_Pre_Orders')){
			// handling for WooCommerce Pre-Orders extension
			$methods[] = 'CardConnectPaymentGatewayAddons';
		}
		else {
			// handling for plain-ole "simple product" type orders
			$methods[] = 'CardConnectPaymentGateway';
		}
		return $methods;
	}

}
