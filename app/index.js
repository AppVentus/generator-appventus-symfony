'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var path = require('path');
var yaml = require('js-yaml');
var fs = require('fs-extra');
var rmdir = require('rimraf');
var child_process = require('child_process');
var request = require('request');
var _ = require('lodash');
var Download = require('download');
var mkdirp = require('mkdirp');
var gui = require('./gui')();

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        /**
         * Ascii introduction
         */
        this.log(chalk.red('\n    #') + '                  #     #                                   \n' + chalk.red('   # #   #####  #####') + '  #     # ###### #    # ##### #    #  ####  \n' + chalk.red('  #   #  #    # #    #') + ' #     # #      ##   #   #   #    # #      \n' + chalk.red(' #     # #    # #    #') + ' #     # #####  # #  #   #   #    #  ####  \n' + chalk.red(' ####### #####  #####') + '   #   #  #      #  # #   #   #    #      # \n' + chalk.red(' #     # #      #') + '        # #   #      #   ##   #   #    # #    # \n' + chalk.red(' #     # #      #') + '         #    ###### #    #   #    ####   ####');
        this.log('\n Scaffolds a standard Symfony2 application with Yeoman and the Appventus Sauce\n\n Created by ' + chalk.red('@AppVentus ') + '\n ' + chalk.cyan('https://appventus.com/') + '\n');

        this.pkg = require('../package.json');
        this.conflicter.force = true;
        this.gui = gui;
    },

    /**
     * Ask the wanted version of Symfony for the project, install it, relocate
     * it on terminal current folder (and not into the ./Symfony path)
     */
    askSymfonyStandard: function () {
        var done = this.async();

        this.SymfonyStandardDistribution = {
            host: 'https://symfony.com/download?v=Symfony_Standard_Vendors_',
            commit: 'lts',
            ext: 'zip'
        };

        var prompts = [{
            type: 'confirm',
            name: 'symfonyStandard',
            message: 'Would you like to use the Symfony "Standard Edition" distribution ' + this.SymfonyStandardDistribution.commit,
            default: true
        }];

        this.prompt(prompts, function (answers) {
            if (answers.symfonyStandard) {
                this.symfonyDistribution = this.SymfonyStandardDistribution;
            } else {
                this.symfonyDistribution = null;
            }
            done();
        }.bind(this));
    },

    getTagSymfony: function () {
        var done = this.async();
        var invalidEntries = 0;

        function filterByTag(obj) {
            if ('installable' === obj || 'non_installable' === obj) {
                invalidEntries++;
                return false;
            } else {
                return true;
            }
        }

        request('https://symfony.com/versions.json', function (error, response, body) {
            if (!error && response.statusCode === 200) {
                this.parsed = JSON.parse(body);
                var filtered = Object.keys(this.parsed);
                this.versionSf2 = filtered.filter(filterByTag);
                done();
            } else {
                console.log(chalk.red('A problem occurred'), error);
            }
        }.bind(this));
    },

    askSymfonyCustom: function () {
        if (this.symfonyDistribution === null) {
            var done = this.async();
            console.log('Please provide GitHub details of the Symfony distribution you would like to use.');

            var prompts = [{
                type: 'list',
                name: 'symfonyCommit',
                message: 'Commit (commit/branch/tag)',
                default: 'lts',
                choices: this.versionSf2
            }];

            this.prompt(prompts, function (answers) {
                this.symfonyDistribution = {
                    host: 'https://symfony.com/download?v=Symfony_Standard_Vendors_',
                    commit: answers.symfonyCommit,
                    ext: 'zip'
                };

                done();
            }.bind(this));
        }
    },

    /**
     * Ask the equivalment of `Acme` to set bundle namespace
     */
    askAppBundleName: function() {
        var done = this.async();
        var prompts = [{
            type: 'input',
            name: 'appBundleName',
            message: 'What is the name of App group bundles',
            default: 'Acme',
        }];

        this.prompt(prompts, function (answers) {
            this.appBundleName = answers.appBundleName;
            done();
        }.bind(this));
    },

    /**
     * Ask which presetted gui bricks will be auto implemented
     */
    askGuiBricks: function() {
        var choices = [];
        for (var key in gui) {
            var component = gui[key];
            var choice = choices.push({
                name: component.name + ' (' + component.git + ')',
                value: component.name,
                checked: component.include
            });
        }

        var done = this.async();
        var prompts = [{
            type: 'checkbox',
            name: 'guiBricks',
            message: 'Which bricks do you want to include ?',
            choices: choices
        }];

        this.prompt(prompts, function (answers) {
            function hasFeature(feat) {
                return answers.guiBricks.indexOf(feat) !== -1;
            }

            for (var key in gui) {
                var component = gui[key];
                component.include = hasFeature(component.name);
            }
            done();
        }.bind(this));
    },

    /**
     * Install Symfony, relocate it on terminal current folder (and not into the
     * ./Symfony path)
     */
    _unzip: function (archive, destination, opts, cb) {
        if (_.isFunction(opts) && !cb) {
            cb = opts;
            opts = { extract: true };
        }

        opts = _.assign({ extract: true }, opts);

        var log = this.log.write()
        .info('... Fetching %s ...', archive)
        .info(chalk.yellow('This might take a few moments'));

        var download = new Download(opts)
        .get(archive)
        .dest(destination)
        .use(function (res) {
            res.on('data', function () {});
        });

        download.run(function (err) {
            if (err) {
                return cb (err);
            }

            log.write().ok('Done in ' + destination).write();
            cb();
        });
    },

    symfonyBase: function () {
        var done = this.async();
        var symfonyCommit = this.parsed[this.symfonyDistribution.commit];

        var appPath = this.destinationRoot();
        var repo = this.symfonyDistribution.host + symfonyCommit  + '.' + this.symfonyDistribution.ext;

        this._unzip(repo, appPath, function (err, remote) {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log(' 👍 ' + chalk.green(' Download success ! '));
                done();
            }
        });
    },

    moveSymfonyBase: function () {
        var done = this.async();
        var directory = this.destinationRoot() + '/Symfony';
        this.directory(directory, '.');
        fs.move('./Symfony/', '.', function (err) {
            done();
        });

        /// Rm the initial target of the dl
        rmdir(directory, function (error) {
            if (null === error) {
                done();
            }
        });
    },

    symfonyWithAsseticInstalled: function () {
        var symfonyVersionAssetic = ['2.3', '2.6', '2.7'];
        var checkVersion = symfonyVersionAssetic.indexOf(this.symfonyDistribution.commit);
        this.symfonyWithAssetic = (checkVersion !== -1) ? true : false ;
    },

    installComposer: function () {
        if (this.symfonyWithAssetic) {
            var done = this.async();
            this.pathComposer = 'php ./composer.phar';
            child_process.exec('php -r "readfile(\'https://getcomposer.org/installer\');" | php', function (error, stdout, stderr) {
                console.log(chalk.green('Installing composer locally.'));
                console.log('See ' + chalk.yellow('http://getcomposer.org')  + ' for more details on composer.');
                console.log('');
                done();
            });
        }
    },

    /**
     * Check if bower is installed as a npm global package, if not it will be
     * installed as a local project module.
     */
    checkBower: function () {
        this.globalBower = false;

        var done = this.async();

        child_process.execFile('bower', ['-v'], function (error, stdout, stderr) {
            if (error !== null) {
                var prompts = [{
                    type: 'confirm',
                    name: 'checkBower',
                    message: chalk.red('WARNING: No global bower installation found. We will install it locally if you decide to continue. Continue ?'),
                    default: true
                }];
                this.prompt(prompts, function (answers) {
                    if (answers.checkBower) {
                        child_process.exec('npm install -g bower', function (error, stdout, stderr) {
                            if (error !== null) {
                                console.log('exec error: ' + error);
                            } else {
                                console.log(chalk.green('Installing bower locally.'));
                                console.log('See ' + chalk.yellow('http://bower.io/') + ' for more details on bower.');
                                this.globalBower = true;
                                done();
                            }
                        }.bind(this));
                    } else {
                        console.log(chalk.red('Bower did not installed locally!'));
                        done();
                    }
                }.bind(this));
            } else {
                this.globalBower = true;
                done();
            }
        }.bind(this));
    },

    writing: {
        /**
         * Init all the files for the git workflow
         */
        gitWorkflow: function () {
            this.template('_gitignore', '.gitignore');
        },

        /**
         * Init all the files for the IDEs & text editors workflow
         */
        ideWorkflow: function() {
            this.template('editorconfig', '.editorconfig');
        },

        /**
         * Init all the files for the front workflow
         */
        frontWorkflow: function() {
            this.fs.copyTpl(
                this.templatePath('gulpfile.js'),
                this.destinationPath('gulpfile.js'),
                {
                    app: this.appBundleName
                }
            );

            this.template('bower.json', 'bower.json');
            this.template('_package.json', 'package.json');
            this.template('_scss-lint.yml', '.scss-lint.yml');
            this.template('jshintrc', '.jshintrc');
        },
    },

    install: {
        /**
         * Install via bower the gui bricks selected by the user and presetted
         * into the app/gui.js module.
         */
        installGuiBricks: function() {
            for (var key in gui) {
                var component = gui[key];

                if (component.include && this.globalBower) {
                    child_process.exec('bower install ' + component.bower + ' --save', function (error, stdout, stderr) {
                        if (error !== null) {
                            console.log('exec error: ' + error);
                        } else {
                            console.log(chalk.green('[' + component.name + '] installed!'));
                        }
                    });
                }
            }
        },

        /**
         * Install views layout
         */
        installLayout: function () {
            this.fs.copyTpl(
                this.templatePath('app/Resources/views/base.html.twig'),
                this.destinationPath('app/Resources/views/base.html.twig'),
                {
                    app: this.appBundleName,
                    gui: this.gui,
                }
            );
        },

        /**
         * Install new AppKernel based on which bundle has been generated
         */
        installAppKernel: function () {
            if (this.symfonyWithAssetic) {
                var appKernelPath = 'app/AppKernel.php';
                var appKernelContents = this.readFileAsString(appKernelPath);

                var newAppKernelContents = appKernelContents.replace('new Symfony\\Bundle\\AsseticBundle\\AsseticBundle(),', '');
                fs.writeFileSync(appKernelPath, newAppKernelContents);
            }
        },

        /**
         * Install Acme\Front\TemplateBundle
         */
        installFrontTemplate: function () {
            var generator = this;
            var bundlePath = 'src/' + generator.appBundleName + '/Front/TemplateBundle';
            var ls = this.spawnCommand('php', ['app/console', 'generate:bundle', '--namespace=' + this.appBundleName + '/Front/TemplateBundle', '--bundle-name=' + this.appBundleName + 'FrontTemplateBundle', '--no-interaction']);

            var copyBundlePartials = function (generator, partial) {
                generator.fs.copyTpl(
                    generator.templatePath('src/Acme/Front/TemplateBundle/' + partial),
                    generator.destinationPath(bundlePath + '/' + partial),
                    {
                        app: generator.appBundleName,
                        gui: generator.gui,
                    }
                );
            };

            ls.on('close', function (code) {
                copyBundlePartials(generator, 'Resources');
                generator.spawnCommand('rm', ['-r', bundlePath + '/Controller']);
                copyBundlePartials(generator, 'Controller');
                mkdirp.sync('src/' + generator.appBundleName + '/Front/TemplateBundle/Resources/public/bower_components');

                /*
                 * Copy config.yml in order to add twig 'bower_components' path
                 */
                generator.fs.copyTpl(
                    generator.templatePath('app/config/config.yml'),
                    generator.destinationPath('app/config/config.yml'),
                    { app: generator.appBundleName }
                );

                /*
                 * generates bowerrc that will target src @AcmeFrontTemplateBundle/Resources/public/bower_components
                 */
                generator.fs.copyTpl(
                    generator.templatePath('_bowerrc'),
                    generator.destinationPath('.bowerrc'),
                    { app: generator.appBundleName }
                );
            });

            this.fs.copyTpl(
                this.templatePath('app/Resources/views/AcmeFrontTemplateBundle'),
                this.destinationPath('app/Resources/views/' + generator.appBundleName + 'FrontTemplateBundle'),
                {
                    app: this.appBundleName,
                    gui: this.gui,
                }
            );
        },
    },

    end: {
        cleanConfig: function () {
            if (this.symfonyWithAssetic) {
                var confDev = yaml.safeLoad(fs.readFileSync('app/config/config_dev.yml'));
                delete confDev.assetic;
                var newConfDev = yaml.dump(confDev, {indent: 4});
                fs.writeFileSync('app/config/config_dev.yml', newConfDev);

                var conf = yaml.safeLoad(fs.readFileSync('app/config/config.yml'));
                delete conf.assetic;
                var newConf = yaml.dump(conf, {indent: 4});
                fs.writeFileSync('app/config/config.yml', newConf);
            }
        },

        deleteAppBundle: function() {
            this.spawnCommand('rm', ['-r', 'src/AppBundle']);
            this.spawnCommand('rm', ['-r', 'app/Resources/views/default']);

            var appKernelPath = 'app/AppKernel.php';
            var appKernelContents = this.readFileAsString(appKernelPath);

            var newAppKernelContents = appKernelContents.replace('new AppBundle\\AppBundle(),', '');
            fs.writeFileSync(appKernelPath, newAppKernelContents);
        },

        /**
         * Remove Assetic if the Symfony's version is with it
         */
        cleanComposer: function () {
            if (this.symfonyWithAssetic) {
                var removeAssetic = this.pathComposer + ' remove ' + 'symfony/assetic-bundle';

                child_process.exec(removeAssetic, function (error, stdout, stderr) {
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    } else {
                        console.log(chalk.green('[symfony/assetic-bundle] deleted!'));
                    }
                });
            }
        },

        /**
         * Install new routing based on which bundle has been generated
         */
        generateRouting: function() {
            this.spawnCommand('rm', ['-r', 'app/config/routing.yml']);

            this.fs.copyTpl(
                this.templatePath('app/_routing.yml'),
                this.destinationPath('app/config/routing.yml'),
                {
                    app: this.appBundleName,
                    app_lower: this.appBundleName.toLowerCase(),
                }
            );
        }
    }
});
