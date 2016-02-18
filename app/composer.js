'use strict';
module.exports = function() {
    var composer = {};
    composer.global = {
        'php'                                       : '>=5.3.3',
        'symfony/symfony'                           : '2.7.*',
        'doctrine/orm'                              : '~2.2,>=2.2.3',
        'doctrine/doctrine-bundle'                  : '~1.2',
        'twig/extensions'                           : '~1.0',
        'twig/twig'                                 : '~1.0',
        'symfony/assetic-bundle'                    : '~2.3',
        'symfony/swiftmailer-bundle'                : '~2.3',
        'symfony/monolog-bundle'                    : '~2.4',
        'sensio/distribution-bundle'                : '~3.0',
        'sensio/framework-extra-bundle'             : '~3.0',
        'incenteev/composer-parameter-handler'      : '~2.0',
        'appventus/assetic-injector-bundle'         : 'dev-master',
        'appventus/ajax-bundle'                     : 'dev-master',
        'appventus/alertify-bundle'                 : 'dev-master',
        'appventus/auto-form-fill-bundle'           : 'dev-master',
        'appventus/aviary-bundle'                   : 'dev-master',
        'appventus/swiftmailerdbbundle'             : 'dev-master',
        'appventus/spoolmailerbundle'               : 'dev-master',
        'appventus/shortcuts-bundle'                : 'dev-master',
        'doctrine/doctrine-fixtures-bundle'         : 'dev-master',
        'doctrine/data-fixtures'                    : 'dev-master',
        'friendsofsymfony/user-bundle'              : '2.0.*dev',
        'friendsofsymfony/jsrouting-bundle'         : '2.0.*@dev',
        'jms/i18n-routing-bundle'                   : '~1.1@dev',
        'jms/security-extra-bundle'                 : '1.5.*@dev',
        'jms/translation-bundle'                    : '1.1.*@dev',
        'knplabs/knp-menu'                          : '2.1.x-dev',
        'knplabs/knp-menu-bundle'                   : '2.1.x-dev',
        'knplabs/knp-components'                    : '1.3.*@dev',
        'lexik/form-filter-bundle'                  : '3.*@dev',
        'liip/imagine-bundle'                       : '1.0.*@dev',
        'mopa/bootstrap-bundle'                     : '3.x-dev',
        'nelmio/alice'                              : '1.*@dev',
        'fzaninotto/faker'                          : '1.*@dev',
        'pagerfanta/pagerfanta'                     : '1.0.*@dev',
        'stof/doctrine-extensions-bundle'           : '1.2.*@dev',
        'twbs/bootstrap'                            : '3.3.x-dev',
        'white-october/pagerfanta-bundle'           : '1.0.*@dev',
        'beberlei/doctrineextensions'               : '1.0.x-dev',
        'vlabs/media-bundle'                        : 'dev-master',
        'imagine/imagine'                           : 'v0.5.0',
        'appventus/ossus-bundle'                    : 'dev-master',
        'behat/mink'                                : '1.7.x-dev',
        'ekino/newrelic-bundle'                     : '^1.3@dev',
        'dizda/cloud-backup-bundle'                 : '^2.0@dev',
        'herzult/php-ssh'                           : '^1.0@dev',
        'willdurand/js-translation-bundle'          : '^2.5'
    };
    composer.dev = {
        'sensio/generator-bundle'           : '~2.3',
        'behat/behat'                       : '~3.0',
        'behat/mink-browserkit-driver'      : '*',
        'behat/mink-extension'              : '~2.0',
        'behat/mink-goutte-driver'          : '~1.1',
        'behat/mink-selenium2-driver'       : '~1.1',
        'behat/symfony2-extension'          : '~2.0',
        'knplabs/friendly-contexts'         : '0.5.*',
        'symfony/var-dumper'                : '~3.0@dev',
        'pugx/generator-bundle'             : '2.4.*',
        'emuse/behat-html-formatter'        : '^0.1.0',
        'friendsofvictoire/cookielaw-widget': 'dev-master',
        'jarnaiz/behat-junit-formatter'     : 'v1.3.1'
    };
    composer.victoire = {
        'victoire/victoire'                         : '1.3.x-dev',
    };

    return composer;
};
