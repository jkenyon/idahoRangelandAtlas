/*
  Grunt file for minifying the javascript and css sources for a faster loading time.
*/

module.exports = function(grunt) {
  
  // Different configuration for the project
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Task for minifying javascript files
    uglify: {
      build: {
        src: 'src/js/*.js',
        dest: 'build/js/app.min.js'
      }
    },

    // Task for minifying css files
    cssmin: {
      build: {
        files: {
          'build/css/app.min.css' : ['src/css/*.css']
        }
      }
    }
  });

  // Load tasks from grunt plugin install via npm
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task.
  grunt.registerTask('default', ["uglify", "cssmin"]);
}
