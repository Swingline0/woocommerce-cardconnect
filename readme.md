WooCommerce CardConnect Gateway
===

This is the official SOF development repository for the WooCommerce CardConnect payment gateway.  
If you wish to download or install this plugin, you should do so via the offical WordPress plugin repository.

[WordPress.org Plugin Page](https://wordpress.org/plugins/cardconnect-payment-module/)

## Development Prerequisites

Ensure the following utilities are available in order to streamline setup:

| Tool | Version | More Info |
| --- | --- | --- |
| NodeJS | \>= 8.11 | Download directly [here](https://nodejs.org/en/) or use [NVM](https://github.com/creationix/nvm) |
| Docker Community Edition | Engine: >= 18.03.1-ce / Compose: >= 1.21.1 | [Official Site](https://www.docker.com/community-edition)

## Development

In order to provide a consistent environment for dev/testing, the `docker-compose.yml` file
defines an application stack which includes everything needed to work with the extension. On
each launch, an init script will execute which will configure the Wordpress site as such:

* Perform WP install, with admin credentials of:
  * Username: test
  * Password: test
* Install/activate Woocommerce
* Configure basic Woocommerce settings
  * Store info
  * Default shop pages
* Activate/Configure CardConnect gateway

### Getting Started

To get started, follow the steps below:

1. Verify dependency versions:
   * `node -v` should return >= v10.6.0
   * `docker -v` should return >= 18.03.1-ce
   * `docker-compose -v` should return >= 1.21.1
1. Clone this repository, `git clone git@github.com:jl455/woocommerce-cardconnect.git`
1. Run `npm install` in the project directory to install dependencies
1. Run `npm run build` to compile typescript (or `npm run watch` to compile on save,
   during development)
1. Run `docker-compose up` to launch the development stack
1. Wait to see the following log messages:
   ```
    wp-cli_1      | INFO: Site initialization complete!
    wp-cli_1      | INFO: Visit http://localhost:8080 to view test site
   ```
1. Open http://localhost:8080/ to view test site

To stop the application, press `Ctrl-c` or run `docker-compose stop` from a separate
shell.

### Testing

This application uses the [Cypress](https://www.cypress.io/) platform to run end-to-end
tests and validate functionality. In order to run tests locally:

1. Ensure that the application stack is running (Site is accessible at http://localhost:8080)
1. Run `npm test`

Tests will run in a headless instance of Chrome and the results will be returned in the
terminal. If tests fail, the return will report as such and export screenshots and a video
of the failure in the following locations:

* `cypress/screenshots/`
* `cypress/videos/`

This feature should be used frequently during development to ensure no regressions are
inadvertently introduced.

#### Maintaining Tests

Integration tests can be found in `cypress/integration`, every file in this directory
will be evaluated during testing. If you wish to debug existing tests or begin creating
your own, run `npm run test:open`. This will launch a separate window in which you can
visually step through each test.

Cypress Resources:

* [Writing your first test](https://docs.cypress.io/guides/getting-started/writing-your-first-test.html#)
* [API documentation](https://docs.cypress.io/api/introduction/api.html#)

### Developer Notes

* Apache will attempt to map to port 8080 on the host system
* Phpmyadmin is mapped to port 9090 if needed, credentials are:
  * Username: root
  * Password: TEST
* To reset the test site while it's running, run `npm run init`. This
will perform the same process as when the application is started.
* WP-CLI commands may be run using the following format:
  * `npm run wp -- <<command here>>`  
    e.g. `npm run wp -- option get home`
 * The initialization script can be found in `./scripts/init.sh` and may be
 updated as needed to ensure other developers have a consistent environment.

## Releases

In order to prepare the plugin for release on the WP Plugin Repository, run
the `./scripts/build.sh` script to prepare all required artifacts. The script
will populate the `./build` directory with everything that should be shipped.

## Contributing
Pull requests welcome!

## License
GNU General Public License v2  
http://www.gnu.org/licenses/gpl-2.0.html
