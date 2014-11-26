var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var mockConfig = {
      app: 'assets',  //作業ディレクトリ
      dist: 'build'   //ビルド後ディレクトリ
  };

  grunt.initConfig({
    mock: mockConfig,

    watch: {
      options: {
        nospawn: true
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= mock.app %>/*.html'
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
              mountFolder(connect, mockConfig.app)
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
        src: 'src/js/*.js',
        dest: 'build/js/common.js'
      }
    },
    uglify: {
      dist: {
        src: 'build/js/common.js',
        dest: 'build/js/common.min.js'
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: 'src/scss',
          cssDir: 'build/css',
          environment: 'production'
        }
      }
    },

    clean: {
      server: '.tmp',
    }

  });

  grunt.registerTask('server', function(target) {
    grunt.task.run([
      'clean:server',
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

