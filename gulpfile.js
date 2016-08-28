var vendor = require('./vendor.json');

var gulp     = require('gulp'),
    $        = require('gulp-load-plugins')(),
    gulpsync = $.sync(gulp);

var isProduction = true;

// compile marko to marko.js 
gulp.task('marko', function() {
  return gulp.src('app/templates/*.marko')
             .pipe($.markoc({preserveWhitespace: true})
             .on('error', handleError))
             .pipe(gulp.dest('lib/views'))
});

// compile script
gulp.task('script', function() {
  if(!vendor.script) {
    return log('There is no script attribute in vendor.json');
  }
  for(var k in vendor.script) {
    ((k) => {
      log('Compiling script ' + k + '...');
      gulp.src(vendor.script[k])
          .pipe($.eslint({
            rules: { 'strict': 2 },
            globals: [ 'jQuery', '$' ],
            envs: ["browser", "node", "es6"],
            ecmaVersion: 6,
            ecmaFeatures: { "modules": true, "jsx": true }
          }))
          .pipe($.eslint.format())
          .pipe($.eslint.failAfterError())
          .on('error', handleError)
          .pipe($.babel({ presets: ['es2015'] }))
          .on('error', handleError)
          .pipe($.if( isProduction, $.uglify() ))
          .pipe($.concat(k))
          .pipe(gulp.dest('public/js/'))
          .pipe($.print(()=>($.util.colors.blue( k + " compiled!" ))));
    })(k);
  };
});

// compile style
gulp.task('style', function() {
  log('style');
});

// copy vendor
gulp.task('vendor', function() {

});

gulp.task('default', gulpsync.sync(['marko', 'script', 'style']), function() {
  log('Finished')
});

// Error handler
function handleError(err) {
  log(err.toString());
  this.emit('end');
}

// log to console using 
function log(msg) {
  $.util.log( $.util.colors.blue( msg ) );  
}