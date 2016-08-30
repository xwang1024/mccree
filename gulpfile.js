var resource = require('./resource.json');

var gulp     = require('gulp'),
    $        = require('gulp-load-plugins')(),
    gulpsync = $.sync(gulp);

var isProduction = false;
var gulpTasks = [];
var gulpTaskPromises = [];

// compile marko to marko.js 

gulp.task('marko', function() {
  gulpTaskPromises.push(new Promise(function(resolve, reject) {
    gulp.src('app/templates/*.marko')
      .pipe(pLog('Compiling marko templates...'))
      .pipe($.markoc({preserveWhitespace: true})
      .on('error', handleError))
      .pipe(gulp.dest('lib/views'))
      .pipe(pLog('Marko templates all compiled!'))
      .on('end', resolve);
  }));
});
gulpTasks.push('marko');

// compile script
if(resource.script) {
  for(var k in resource.script) {
    ((k) => {
      gulp.task('script:'+k, function() {
        gulpTaskPromises.push(new Promise(function(resolve, reject) {
          gulp.src(resource.script[k])
              .pipe(pLog( 'Compiling script ' + k + '...' ))
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
              .pipe(pLog(k + ' compiled!'))
              .on('end', resolve);
        }));
      });
      gulpTasks.push('script:'+k);
    })(k);
  }
} else {
  log('There is no script attribute in resource.json');
}

var cssnanoOpts = {
  safe: true,
  discardUnused: false, // no remove @font-face
  reduceIdents: false // no change on @keyframes names
}
// compile style
if(resource.style) {
  for(var k in resource.style) {
    ((k) => {
      gulp.task('style:'+k, function() {
        gulpTaskPromises.push(new Promise(function(resolve, reject) {
          gulp.src(resource.style[k])
            .pipe($.print(()=>($.util.colors.blue( 'Compiling style ' + k + '...' ))))
            .pipe($.less())
            .on("error", handleError)
            .pipe($.if(isProduction, $.cssnano(cssnanoOpts)))
            .pipe(gulp.dest('public/css/'))
            .pipe(pLog(k + ' compiled!'))
            .on('end', resolve);
        }));
      });
      gulpTasks.push('style:'+k);
    })(k);
  }
} else {
  log('There is no style attribute in resource.json');
}

// copy vendor
if(resource.vendor) {
  gulp.task('vendor', function() {
    gulpTaskPromises.push(new Promise(function(resolve, reject) {
      gulp.src(resource.vendor)
        .pipe(pLog('Copying vendors...'))
        .pipe(gulp.dest('public/vendor'))
        .pipe(pLog('Vendors all copied!'))
        .on('end', resolve);
    }));
  });
  gulpTasks.push('vendor');
} else {
  log('There is no vendor attribute in vendor.json');
}



gulp.task('default', gulpTasks, function() {
  Promise.all(gulpTaskPromises).then(() => {
    log('Finished')
  });
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