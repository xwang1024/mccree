var resource = require('./resource.json');

var gulp     = require('gulp'),
    $        = require('gulp-load-plugins')(),
    gulpsync = $.sync(gulp);

var isProduction = false;

// compile marko to marko.js 
gulp.task('marko', function() {
  return gulp.src('app/templates/*.marko')
    .pipe(pLog('Compiling marko templates...'))
    .pipe($.markoc({preserveWhitespace: true})
    .on('error', handleError))
    .pipe(gulp.dest('lib/views'))
    .pipe(pLog('Marko templates all compiled!'));
});

// compile script
gulp.task('script', function() {
  if(!resource.script) {
    return log('There is no script attribute in resource.json');
  }
  for(var k in resource.script) {
    ((k) => {
      gulp.src(resource.script[k])
          .pipe($.print(()=>($.util.colors.blue( 'Compiling script ' + k + '...' ))))
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
          .pipe(pLog(k + ' compiled!'));
    })(k);
  };
});

var cssnanoOpts = {
  safe: true,
  discardUnused: false, // no remove @font-face
  reduceIdents: false // no change on @keyframes names
}
// compile style
gulp.task('style', function() {
  if(!resource.style) {
    return log('There is no style attribute in resource.json');
  }
  for(var k in resource.style) {
    ((k) => {
      gulp.src(resource.style[k])
        .pipe($.print(()=>($.util.colors.blue( 'Compiling style ' + k + '...' ))))
        .pipe($.less())
        .on("error", handleError)
        .pipe($.if(isProduction, $.cssnano(cssnanoOpts)))
        .pipe(gulp.dest('public/css/'))
        .pipe(pLog(k + ' compiled!'));
    })(k);
  }
});

// copy vendor
gulp.task('vendor', function() {
  if(!resource.vendor) {
    return log('There is no vendor attribute in vendor.json');
  }
  return gulp.src(resource.vendor)
    .pipe(pLog('Copying vendors...'))
    .pipe(gulp.dest('public/vendor'))
    .pipe(pLog('Vendors all copied!'));
});

gulp.task('default', ['marko', 'script', 'style', 'vendor'], function() {
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

function pLog(msg) {
  return $.print(()=>( $.util.colors.blue( msg )) );
}