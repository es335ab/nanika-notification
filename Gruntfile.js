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
    build: 'build'
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

    concat: {
      dist: {
        src: ['<%= path.assets %>/js/**/*.js', '<%= path.assets %>/!bower_components/**/*'],
        dest: '<%= path.tmp %>/js/common.js'
      }
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

    clean: {
      tmp: '.tmp',
    },

    watch: {
      options: {
        nospawn: true
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: ['<%= path.assets %>/*.html'],
        css: {
          files: ['<%= path.assets %>/**/*.scss'],
          tasks: ['compass']
        },
        js: {
          files: ['<%= path.assets %>/**/*.js'],
          tasks: ['browserify']
        },
        build: {
          options: {
            livereload: '<%= connect.options.livereload %>'
          },
          files: ['<%= path.tmp %>/**']
        }
      }
    }

  });

  grunt.registerTask('server', function(target) {
    grunt.task.run([
      'clean:tmp',
      'copy:tmp',
      'browserify',
      'compass',
      'configureProxies',
      'connect:livereload',
      'watch'
    ])
  });

  /*
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', [ 'concat', 'uglify', 'compass']);
  */
};

