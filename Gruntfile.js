module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {                              // Task
            dist: {                            // Target
                options: {                       // Target options
                    style: 'expanded'
                },
                files: {                         // Dictionary of files
                    'css/bootstrap.css': 'assets/stylesheets/bootstrap.scss'
                }
            }
        },
        watch: {
            css: {
                files: '/Users/catrapture/dev/projects/georgi-snap/assets/stylesheets/bootstrap.scss',
                tasks: ['sass']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default',['watch']);

};