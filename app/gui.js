'use strict';
module.exports = function() {
    var gui = [
        {
            'name': 'bootstrap',
            'git': 'https://github.com/twbs/bootstrap-sass',
            'bower': 'bootstrap-sass',
            'scss': 'assets/stylesheets/bootstrap',
            'js': {
                'top': false,
                'bottom': 'assets/javascripts/bootstrap.min.js',
            },
            'gui': false,
            'bowerRequirement': {
                'js': {
                    'top': 'jquery/dist/jquery.min.js',
                    'bottom': false,
                },
            },
            'include': true,
        },
        {
            'name': 'cover',
            'git': 'https://github.com/LoicGoyet/cover',
            'bower': 'cover-component',
            'scss': 'cover.scss',
            'js': false,
            'gui': 'gui.html.twig',
            'bowerRequirement': false,
            'include': true,
        },
    ];

    return gui;
};
