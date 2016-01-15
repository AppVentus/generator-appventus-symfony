'use strict';
module.exports = function() {
    var aliases = {
        '@bower': 'src/<%= app %>/Front/TemplateBundle/Resources/public/bower_components',
        '@css': 'web/css',
    };

    return aliases;
};
