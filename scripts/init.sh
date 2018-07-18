#!/usr/bin/env sh
set -e

wp db reset --yes

echo "INFO: Reset DB for clean test environment"

wp core install \
    --url="localhost:8080" \
    --title="Test Site" \
    --admin_user="test" \
    --admin_password="test" \
    --admin_email="test@example.com"

echo "INFO: Site install complete (login: test, pass: test)"

wp plugin install woocommerce --activate
wp plugin activate woocommerce-cardconnect

echo "INFO: Installed and activated Woocommerce and Cardconnect plugin"

wp option update woocommerce_card_connect_settings --format=json '{
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
    "void_avs":"yes",
    "void_cvv":"yes"
}'

echo "INFO: Set test credentials for Cardconnect gateway"

wp wc tool run install_pages --user=1 # Creates default woocommerce shop pages

wp option update woocommerce_allow_tracking "no"
wp option update woocommerce_currency "USD"
wp option update woocommerce_default_country "US:FL"
wp option update woocommerce_dimension_unit "in"
wp option update woocommerce_product_type "both"
wp option update woocommerce_store_address "123 Fake Street"
wp option update woocommerce_store_city "Testville"
wp option update woocommerce_store_postcode "12345"

echo "INFO: Woocommerce configured with default options"

wp wc product create \
    --name="Test Product 1" \
    --regular_price="111" \
    --stock_quantity=5 \
    --user=1

wp wc product create \
    --name="Test Product 2" \
    --regular_price="222" \
    --stock_quantity=5 \
    --user=1

wp wc product create \
    --name="Test Product 3" \
    --regular_price="333" \
    --stock_quantity=5 \
    --user=1

echo "INFO: Test products created:"

wp wc product list --user=1 --fields=id,name,permalink

echo "INFO: Site initialization complete!"
