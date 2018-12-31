=== WooCommerce CardConnect Payment Gateway ===
Contributors: jle1, RexAK
Tags: woocommerce, payment, gateway, cardconnect
Requires at least: 4.4
Tested up to: 4.9.8
Stable tag: 3.0.4
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
WC requires at least: 3.2
WC tested up to: 3.4.2
WC Pre-Orders tested with v1.5.9
WC Subscriptions tested with v2.2.20

== Description ==

Note: WooCommerce CardConnect Payment Gateway version 3.0+ is a major update. It is recommended that you test this version for compatibility before updating. 3.0+ introduces CardPoint's API iframe tokenization methods.

The WooCommerce CardConnect Payment Gateway allows you to accept Visa, MasterCard, American Express and Discover payments in your WordPress WooCommerce store. CardConnect payment processing tokenizes sensitive data, safeguarding your customers from a data breach and removing the burden of PCI compliance.

CardConnect allows customers to checkout with a saved card.  Card details are saved on CardConnect servers and not on your site. The plugin supports the WooCommerce Subscription extension.

Visit [CardConnect](http://cardconnect.com) for more information.


Please note that WooCommerce (v3.2+) must be installed and active.
The latest version of WooCommerce (v3.4.2) is supported.
The WooCommerce Subscriptions extension (v2.2.x) is fully supported.

You must contact your Card Connect representative to receive the account credentials specifically for this plugin to work. Those credentials are different than what is provided for the Virtual Terminal. You must also contact your hosting provider and request that they open ports 6443 and 8443 for traffic. Refer to the CardConnect [WooCommerce information page](https://support.cardconnect.com/cardpointe/marketplace/woocommerce) for more details.


== Installation ==

* Upload plugin files to your plugins folder, or install using WordPress built-in Add New Plugin installer;
* Activate the plugin;
* Configure the plugin settings in WooCommerce > Settings > Checkout > Card Connect
* Contact your CardConnect representative for your merchant ID and credentials, and to activate your account for WooCommerce usage.

== Frequently Asked Questions ==

= Does this plugin require that an SSL certificate be installed? =

It is recommended that you install an SSL certificate on your site for the checkout page, however the plugin does not require it.

= Is there an option for a sandbox account for testing? =

Yes. When you sign-up for a merchant account with CardConnect you will receive credentials for a sandbox account as well as a live account.

= Are there any special requirements needed from my hosting provider? =

You may need to request that your hosting provider open certain ports. Specific instructions will be provided when you activate your CardConnect account.

= Who do I contact if I need assistance? =

For further info or support, contact your CardConnect representative.

= Does this support the WooCommerce Subscriptions extension? =

Yes, we support  v2.2.x of the Subscriptions extension.  We highly recommend that you use v2.x for best results.

= Does this support the WooCommerce Pre-Orders extension? =

Yes.

= Does this support all currencies supported by the WooCommerce store? =

We support all WooCommerce currencies except the Ukranian Hryvnia.

= Can I switch back to the 2.x method of tokenization, and not use the 3.x+ iframe methods =

Yes. Define WC_CC_ADVANCED as true in your wp-config.php file. Then, open the plugin's WooCommerce setting page, and configure the new options. Use at your own risk.

= Who do I contact for support? =

Support is provided by CardConnect. Before posting to this plugin forum, contact your CardConnect rep.

= I have trouble with a saved card =

Cards save while in test/sandbox mode will NOT carry over when switching to live mode. If you've saved a card in this manner, and receive an error, you need to resave the card in live mode, under a different label/name.

== Changelog ==
= 3.0.4 =
* Change: Remove development functions

= 3.0.3 =
* Force update - for those on < 3.0.3

= 3.0.2 =
* repackage, restore raven

= 3.0.1 =
* removes Fatal error reported when upgrading

= 3.0.0 =
* Change: Now tokenizes card numbers via CardPoint's iframe methods
* Change: added method to attempt to pull WooCommerce checkout styles, and apply them to the check out card detail fields
* Fix: normalizes the refund total to prevent some isolated cases where refund amounts were multiplied by 100
* Fix: Various tokenization checks for both the new iframe version and older JS tokenization calls
* Fix: Tokenization carries over from previous versions, into this version. Subscriptions and Saved cards are persistent.

= 2.0.17 =
* Change: Updated to use new CardConnect SSL certificate

= 2.0.16 =
* reupload - svn issue

= 2.0.15 =
* Fix: Format order total to fix decimal point issue on some hosting servers.

= 2.0.14 =
* Compatibility: Tested against WP 4.9.1 and WooCommerce 3.2.6
* replaced many WC object methods with CRUD methods

= 2.0.13 =
* Compatibility: Tested against WP 4.8.3 and WooCommerce 3.2.3

= 2.0.12 =
* Fix: Visa Electron and ELO (Brazil) fix. Now supports both types.

= 2.0.11 =
* Added: Electron Card image

= 2.0.10 =
* Added: Support for Visa Electron card type
* Tested against WooCommerce 3.0.7

= 2.0.9 =
* Tested against WP 4.7.4 and WooCommerce 3.0.6

= 2.0.8 =
* Tested against WP 4.7.1 and WooCommerce 2.6.12

= 2.0.7 =
* Fix: Added backwards compatibility with previous version of WooCommerce v2.5.5



= 2.0.6 =
* Updated plugin author info.

= 2.0.5 =
* Fix: Synchronize a custom function, generate_settings_html(), with recent updates to the WooCommerce version.

= 2.0.4 =
* Fix: Renewal Order amounts for subscriptions could be incorrect if the payment amount was a whole number.

= 2.0.3 =
* Minor CardConnect API update



= 2.0.2 =
* Fix: Fixed detection of whether the Pre-Orders extension is installed or not.

= 2.0.1 =
* Fix: Improved handling for wp-admin CardConnect checkbox option 'Saved Cards - Allow customers to save payment information.'

= 2.0.0 =
* Major release to fully support the WooCommerce Subscriptions 2.x extension plugin for the WooCommerce store.
* Support for WooCommerce Pre-Orders extension has also been added.

= 1.0.7 =
* Fix: Corrected Merchant account field mapping for addresses

= 1.0.6 =
* Fix: Ensure 'site' field is populated in 'wp-admin > WooCommerce > Settings > Checkout > CardConnect' before performing
  port checks.
* Typo fix in checkout screen.

= 1.0.5 =
* Fix: Issue with error messages covering Card Connect fields.

= 1.0.4 =
* We now check that your server has the required ports open to allow communication with the CardConnect servers.  You'll
see this information at the bottom of your (wp-admin > WooCommerce > Settings > Checkout > CardConnect) settings screen
in the section titled 'Warnings/Messages'.  Refresh this page to re-perform the check.

= 1.0.3 =
* Minor CardConnect API update

= 1.0.2 =
* Minor Bug Fixes

= 1.0.1 =
* Bug Fix: Fixed bug that some users experienced where WooCommerce settings page would be blank white page

= 1.0.0 =
* Public Release
* Bug Fixes
* UI Tweaks

= 0.6.0 =
* New feature: Now integrate with WooCommerce Subscriptions

= 0.5.0 =
* New feature: Allow customer to store payment information on CardConnect servers for easy re-use
* Better tokenization handling
* Allow for template overrides

= 0.4.0 =
* Implement immediate tokenization of credit card number, with improved error feedback
* Allow unique CardConnect site names to be specified in gateway configuration
* Allow customer to supply discrete cardholder name if necessary
* UI Tweaks
* Bug fixes

= 0.1.0 =
* Beta release. Initial functionality includes tokenized transactions, easy toggle between prod/test environments,
and auth only/capture transactions.

== Upgrade Notice ==
= 3.0.0 =
CardConnect Payment Module 3.0.0 is a major release. Please insure compatibility before updating. See the changelog
for update info.

= 2.0.0 =
Major release to fully support the WooCommerce Subscriptions 2.x extension plugin for the WooCommerce store.

= 1.0.1 =
Upgrade for bug fixes

= 1.0.0 =
Initial repository version

