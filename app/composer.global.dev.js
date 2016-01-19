'use strict';
module.exports = function() {
    var composer = {
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

    return composer;
};
