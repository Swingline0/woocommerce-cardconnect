#!/usr/bin/env sh
set -e

wp db reset --yes --allow-root

echo "INFO: Reset DB for clean test environment"

wp core install \
    --url="localhost:8080" \
    --title="Test Site" \
    --admin_user="test" \
    --admin_password="test" \
    --admin_email="test@example.com" \
    --allow-root

echo "INFO: Site install complete (login: test, pass: test)"

wp plugin install woocommerce --activate --allow-root
wp plugin activate woocommerce-cardconnect --allow-root

echo "INFO: Installed and activated Woocommerce and Cardconnect plugin"

wp config set WC_CC_ADVANCED true --type=constant --allow-root

wp option update woocommerce_card_connect_settings --allow-root --format=json '{
    "enabled":"yes",
    "title":"Credit card",
    "description":"Payment secured by CardConnect.",
    "mode":"capture",
    "sandbox":"yes",
    "sandbox_mid":"496160871111",
    "sandbox_user":"testing",
    "sandbox_password":"testing123",
    "production_mid":"",
    "production_user":"",
    "production_password":"",
    "site":"fts",
    "card_types":[
        "visa",
        "mastercard",
        "discover",
        "amex"
    ],
    "enable_profiles":"no",
    "use_iframe":"yes",
    "iframe_formatinput":"no",
    "void_avs":"yes",
    "void_cvv":"yes"
}'

echo "INFO: Set test credentials for Cardconnect gateway"

wp wc tool run install_pages --user=1 --allow-root # Creates default woocommerce shop pages

wp option update woocommerce_allow_tracking "no" --allow-root
wp option update woocommerce_currency "USD" --allow-root
wp option update woocommerce_default_country "US:FL" --allow-root
wp option update woocommerce_dimension_unit "in" --allow-root
wp option update woocommerce_product_type "both" --allow-root
wp option update woocommerce_store_address "123 Fake Street" --allow-root
wp option update woocommerce_store_city "Testville" --allow-root
wp option update woocommerce_store_postcode "12345" --allow-root

echo "INFO: Woocommerce configured with default options"

wp wc product create \
    --name="Test Product 1" \
    --regular_price="111" \
    --stock_quantity=5 \
    --user=1 \
    --allow-root

wp wc product create \
    --name="Test Product 2" \
    --regular_price="222" \
    --stock_quantity=5 \
    --user=1 \
    --allow-root

wp wc product create \
    --name="Test Product 3" \
    --regular_price="333" \
    --stock_quantity=5 \
    --user=1 \
    --allow-root

echo "INFO: Test products created:"

wp wc product list --user=1 --fields=id,name,permalink --allow-root

echo "INFO: Site initialization complete!"
echo "INFO: Visit http://localhost:8080 to view test site"
