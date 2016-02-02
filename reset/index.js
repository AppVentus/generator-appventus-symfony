'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.conflicter.force = true;
    },
    delete: function() {
        var dest = this.destinationRoot();
        this.fs.delete(dest + '**/*');
    },
    writing: function() {
        this.composeWith('appventus-symfony');
    }
});
