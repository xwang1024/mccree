var resource = require('./resource.json');

var gulp        = require('gulp'),
    $           = require('gulp-load-plugins')(),
    runSequence = require('run-sequence'),
    del         = require('del');

var isProduction = false;
var assetTasks = [];

gulp.task('marko:cache', (callback) => {
  log('Generate marko cache...');
  gulp.src('app/templates/**/*.marko')
    .pipe(gulp.dest('.marko_cache/'))
    .on('end', callback);
});

gulp.task('marko:compile', (callback) => {
  log('Compiling marko templates...');
  gulp.src('.marko_cache/**/*.marko')
    .pipe($.markoc({preserveWhitespace: true})
    .on('error', handleError))
    .pipe(gulp.dest('lib/views'))
    .on('end', callback);
});

// compile script
if(resource.script) {
  for(var k in resource.script) {
    ((k) => {
      gulp.task(`script:${k}`, (callback) => {
        log(`Compiling script ${k}...`);
        gulp.src(resource.script[k])
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
          .pipe($.if(isProduction, $.md5Plus(10, '.marko_cache/partials/scripts.marko')))
          .pipe(gulp.dest('public/js/'))
          .on('end', callback);
      });
      assetTasks.push(`script:${k}`);
    })(k);
  }
} else {
  log('There is no script attribute in resource.json');
}

var cssnanoOpts = {
  safe: true,
  discardUnused: false, // not remove @font-face
  reduceIdents: false // not change on @keyframes names
}
// compile style
if(resource.style) {
  for(var k in resource.style) {
    ((k) => {
      gulp.task(`style:${k}`, (callback) => {
        log(`Compiling style ${k}...`);
        gulp.src(resource.style[k])
          .pipe($.less())
          .on("error", handleError)
          .pipe($.if(isProduction, $.cssnano(cssnanoOpts)))
          .pipe($.if(isProduction, $.md5Plus(10, '.marko_cache/partials/styles.marko')))
          .pipe(gulp.dest('public/css/'))
          .on('end', callback);
      });
      assetTasks.push(`style:${k}`);
    })(k);
  }
} else {
  log('There is no style attribute in resource.json');
}

// copy vendor
if(resource.vendor) {
  gulp.task('vendor', (callback) => {
    log('Copying vendors...');
    gulp.src(resource.vendor)
      .pipe(gulp.dest('public/vendor'))
      .on('end', callback);
  });
  assetTasks.push('vendor');
} else {
  log('There is no vendor attribute in vendor.json');
}

gulp.task('clean', (callback) => {
  var delPaths = [ '.marko_cache/', 'lib/views/', 'public/css/', 'public/js/' ];
  log(`Cleaning: ${delPaths.join(', ')}`);
  del(delPaths, {force: true}, callback);
  log(`Done!`);
});

gulp.task('dev-build', (callback) => {
  runSequence('marko:cache', assetTasks, 'marko:compile', function() {
    log("******************");
    log("* IT'S HIGH NOON * Dev build done!");
    log("******************");
    callback();
  });
});

gulp.task('release-build', (callback) => {
  isProduction = true;
  runSequence('marko:cache', assetTasks, 'marko:compile', function() {
    log("******************");
    log("* IT'S HIGH NOON * Release build done!");
    log("******************");
    callback();
  });
});

gulp.task('default', (callback) => {
  // TODO
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