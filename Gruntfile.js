module.exports = function(grunt) {

  'use strict';

  //loads all grunt tasks from package.json
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  var pkgDetails = require('./package.json');

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    connect: {
      local: {
        options: {
          port: 8000,
          protocol: 'http',
          keepalive: true,
          base: './',
          hostname: '*',
          open: {
            target: 'http://localhost:8000'
          }
        }
      }
    },

    jshint: {
      grunt: {
        src: 'Gruntfile.js'
      },
      karma: {
        src: 'karma.conf.js'
      },
      src: {
        src: 'src/js/**/*.js'
      },
      test: {
        src: 'test/spec/**/*-spec.js'
      }
    },

    karma: {
      options: {
        configFile: 'karma.conf.js',
        plugins: [
          'karma-jasmine',
          'karma-phantomjs-launcher',
          'karma-coverage'
        ]
      },
      test: {
        browsers: ['PhantomJS'],
        port: 8001,
        singleRun: true,
        coverageReporter: {
          reporters: [
            { type: 'html' }
          ]
        },
      }
    },

    concat: {
      options: {
        stripBanners: true,
        sourceMap: true
      },
      src: {
        options: {
          banner: '/*! <%= pkg.name %>.js, v<%= pkg.version %>, created <%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        src: [
          'src/js/app.js',
          'src/js/ListController.js',
          'src/js/TodoService.js',
          'src/js/ngEnter.js'
        ],
        dest: 'ToDont.js'
      }
    },

    watch: {
      src: {
        files: ['src/js/**/*.js'],
        tasks: ['jshint:src', 'karma:test', 'concat:src']
      },
      test: {
        files: ['test/spec/**/*-spec.js'],
        tasks: ['jshint:test', 'karma:test']
      },
      grunt: {
        files: ['Gruntfile.js'],
        tasks: ['jshint:grunt']
      },
      karma: {
        files: ['karma.conf.js'],
        tasks: ['jshint:karma', 'karma:test']
      }
    }

  });

  grunt.registerTask('dev', ['jshint', 'karma:test', 'concat:src', 'watch']);
  grunt.registerTask('test', ['karma:test']);
  grunt.registerTask('serve', ['connect:local']);

};
