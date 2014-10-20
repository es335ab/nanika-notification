module.exports = function(grunt) {
  grunt.initConfig({
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

    clean: ['build/**/*']

  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', [ 'concat', 'uglify', 'compass']);
};

