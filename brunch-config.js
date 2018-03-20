'use strict';

exports.config = {
    npm: {
        styles: {
            bootstrap: ['dist/css/bootstrap.css']
        },
        globals: {
            "jQuery": "jquery"
        },
        static: [
            "node_modules/jquery-validation/dist/jquery.validate.js"
        ]
    },
    files: {
        javascripts: {
            joinTo: {
                'js/app.js': /^app\/js/,
                'js/vendor.js': /^node_modules/
            }
        },
        stylesheets: {
            joinTo: {
                'css/app.css': 'app/scss/main.scss',
                'css/vendor.css': /^node_modules/
			}
        }
    },
    conventions: {
        assets: /(assets|pages)[\\/]/
    },
    watcher: {
        awaitWriteFinish: true
    },
    plugins: {
        staticHandlebars: {
            outputDirectory: 'app/pages'
        },
        autoReload: {
            enabled: true
        }
    }
};
