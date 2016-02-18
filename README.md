AppVentusSymfony - Symfony2
===========================

generator-appventus-symfony is a [Yeoman Generator](http://yeoman.io/generators/) to scaffold Symfony2 projects with sensible defaults, common bundles and frontend workflow approved and daily used by the AppVentus core team.

It will create a new Symfony project, remove Assetic and replace it with a lovely Gulp Workflow. It will also ask you if you want to install [Victoire](https://github.com/Victoire/victoire) and its widgets, and some front-end components.

## Dependencies

Mandatory dependencies :

- [npm](http://nodejs.org/)
- [yo](http://yeoman.io/)
- [gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#getting-started)

## Generation steps
* Ask which version of Symfony do you want (The list of versions of symfony is available [here](https://symfony.com/versions.json))
* Removes Assetic for versions lower than 2.8
* Ask which gui bricks do you want to install
* Ask if you want to generate a `front/app` bundle
* Ask if you want to generate a `front/template` bundle
* Ask if you want to download [victoire](https://github.com/Victoire/victoire)
 * If yes, ask which widget do you want to install
* Download Symfony
* Remove Assetic
* Install Composer
* Install Gulp and a gulpfile with a presetted workflow
* Install some twig template for base layouts
* Install all the bundles required via composer

## Contribution
This is still a work in progress, if you want to help, you can follow the steps below to make it work locally
- Install globally yeoman : `npm install -g yo`
- Clone the project : `git clone https://github.com/AppVentus/generator-appventus-symfony`
- Link to npm (from the root of your project): `npm link`
- Run: `yo appventus-symfony`
