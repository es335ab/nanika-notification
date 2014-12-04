var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var path = {
    assets: 'assets',
    tmp: '.tmp',
    build: 'build',
    spec: 'spec'
  }

  grunt.initConfig({
    path: path,

    copy: {
      tmp: {
        files: [
          {
            expand: true,
            cwd: '<%= path.assets %>',
            src: [
              '**/*.!(scss|js|md)',
              '!img/sprites/**'
            ],
            dest: '<%= path.tmp %>'
          }
        ]
      }
    },

    connect: {
      options: {
        port: 9000,
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              proxySnippet,
              mountFolder(connect, path.tmp)
            ];
          }
        }
      },
      proxies: [{
        context: '/api',
        host: 'localhost',
        port: '3000',
        https: false,
        changeOrigin: false
      }],
    },

    uglify: {
      dist: {
        src: '<%= path.tmp %>/js/common.js',
        dest: '<%= path.build %>/js/common.js'
      }
    },

    compass: {
      dist: {
        options: {
          sassDir: '<%= path.assets %>/scss',
          cssDir: '<%= path.tmp %>/css',
          environment: 'development'
        }
      }
    },

    sprite: {
      create: {
        src: '<%= path.assets %>/img/sprites/*.png',
        destImg: '<%= path.tmp %>/img/sprite.png',
        destCSS: '<%= path.assets %>/scss/var/_sprite.scss',
        imgPath: '../img/sprite.png',
        algorithm: 'binary-tree',
        engine: 'pngsmith',
        padding: 8
      }
    },

    browserify: {
      options: {
        transform: ['browserify-shim', 'jstify'],
        watch: true
      },
      common: {
        options: {
          require: ['backbone', 'backbone.marionette', 'jquery', 'underscore']
        },
        files: {
          '<%= path.tmp %>/js/common.js': '<%= path.assets %>/js/common.js'
        }
      },
      pages: {
        options: {
          external: ['backbone', 'backbone.marionette', 'jquery', 'underscore']
        },
        expand: true,
        cwd: '<%= path.assets %>/js',
        src: ['*.js', '!common.js'],
        dest: '<%= path.tmp %>/js'
      }
    },

    mochaTest: {
      test: {
        options: {
          require: ['jquery']
        },
        src: '<%= path.spec %>/**/*Spec.js'
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      src: [
        '<%= path.assets %>/js/**/*.js'
      ]
    },

    clean: {
      tmp: '.tmp',
    },

    watch: {
      options: {
        spawn: false,
        livereload: '<%= connect.options.livereload %>'
      },
      html: {
        files: ['<%= path.assets %>/**/*.html'],
        tasks: ['newer:copy:tmp']
      },
      js: {
        files: ['<%= path.assets %>/**/*.js'],
        tasks: ['browserify']
      },
      css: {
        files: ['<%= path.assets %>/scss/**'],
        tasks: ['compass']
      },
      sprite: {
        files: ['<%= path.assets %>/img/sprites/*.png'],
        tasks: ['sprite']
      },
      build: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: ['<%= path.tmp %>/**']
      }
    }

  });

  grunt.registerTask('server', function(target) {
    grunt.task.run([
      'clean:tmp',
      'browserify',
      'sprite',
      'compass',
      'copy:tmp',
      'configureProxies',
      'connect:livereload',
      'watch'
    ])
  });

};

