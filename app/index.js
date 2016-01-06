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

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.pkg = require('../package.json');
        var Appventus = chalk.red('\n    #                  #     #                                   \n   # #   #####  #####  #     # ###### #    # ##### #    #  ####  \n  #   #  #    # #    # #     # #      ##   #   #   #    # #      \n #     # #    # #    # #     # #####  # #  #   #   #    #  ####  \n ####### #####  #####   #   #  #      #  # #   #   #    #      # \n #     # #      #        # #   #      #   ##   #   #    # #    # \n #     # #      #         #    ###### #    #   #    ####   ####  \n ');
        var AppventusDesc = '\n\n Scaffolds a standard Symfony2 application with Yeoman and the Appventus Sauce\n\n Created by ' + chalk.red('@AppVentus ') + '\n ' + chalk.cyan('https://appventus.com/') + '\n';
        this.log(Appventus);
        this.log(AppventusDesc);
        this.conflicter.force = true;
    },

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
                                console.log('');
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
        removeSymfonyBase: function () {
            var done = this.async();
            var directory = this.destinationRoot() + '/Symfony';
            rmdir(directory, function (error) {
                if (null === error) {
                    done();
                }
            });
        },

        app: function () {
            this.template('_gulpfile.js', 'gulpfile.js');

            this.fs.copy(
                this.templatePath('_gitignore'),
                this.destinationPath('.gitignore')
            );
            this.template('_bower.json', 'bower.json');
            this.template('_package.json', 'package.json');
        },

        projectfiles: function () {
            this.fs.copy(
                this.templatePath('editorconfig'),
                this.destinationPath('.editorconfig')
            );
            this.fs.copy(
                this.templatePath('jshintrc'),
                this.destinationPath('.jshintrc')
            );
        }
    },

    end: {
        addBootStrapSass: function () {
            if (this.bootStrapSass && this.globalBower) {
                child_process.exec('bower install bootstrap-sass-official --save', function (error, stdout, stderr) {
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    } else {
                        console.log(chalk.green('[bootstrap-sass-official] installed!'));
                    }
                });
            }
        },

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

        updateAppKernel: function () {
            if (this.symfonyWithAssetic) {
                var appKernelPath = 'app/AppKernel.php';
                var appKernelContents = this.readFileAsString(appKernelPath);

                var newAppKernelContents = appKernelContents.replace('new Symfony\\Bundle\\AsseticBundle\\AsseticBundle(),', '');
                fs.writeFileSync(appKernelPath, newAppKernelContents);
            }
        },

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

        deleteAppBundle: function() {
            this.spawnCommand('rm', ['-r', 'src/AppBundle']);
            this.spawnCommand('rm', ['-r', 'app/Resources/views/default']);
            this.template('app/_appKernel.php', 'app/appKernel.php');
        },

        installFrontTemplate: function () {
            var generator = this;
            var bundlePath = 'src/' + generator.appBundleName + '/Front/TemplateBundle';
            var ls = this.spawnCommand('php', ['app/console', 'generate:bundle', '--namespace=' + this.appBundleName + '/Front/TemplateBundle', '--bundle-name=' + this.appBundleName + 'FrontTemplateBundle', '--no-interaction']);

            var copyBundlePartials = function (generator, partial) {
                generator.fs.copyTpl(
                    generator.templatePath('src/Acme/Front/TemplateBundle/' + partial),
                    generator.destinationPath(bundlePath + '/' + partial),
                    {
                        app: generator.appBundleName
                    }
                );
            };

            ls.on('close', function (code) {
                copyBundlePartials(generator, 'Resources');
                generator.spawnCommand('rm', ['-r', bundlePath + '/Controller']);
                copyBundlePartials(generator, 'Controller');
            });

            this.fs.copyTpl(
                this.templatePath('app/Resources/views/AcmeFrontTemplateBundle'),
                this.destinationPath('app/Resources/views/' + generator.appBundleName + 'FrontTemplateBundle'),
                {
                    app: this.appBundleName
                }
            );
        },

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
        },
    }
});
