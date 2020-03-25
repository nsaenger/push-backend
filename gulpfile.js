const gulp = require('gulp');
const clean = require('gulp-clean');
const {spawn} = require('child_process');
const kill = require('tree-kill');

let server = null;
let tsc = null;


gulp.task('clean', () => {
    return gulp.src('build/*', {read: false})
        .pipe(clean());
});

gulp.task('transpile-ts', (cb) => {
    tsc = spawn('tsc', {shell: true});

    tsc.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    tsc.stderr.on('data', (error) => {
        console.error(error.toString());
        cb(error.toString());
    });

    tsc.on('exit', cb);
});

gulp.task('resources', (cb) => {
    gulp.src(['./src/public/**/*']).pipe(gulp.dest('./build/public/'));
    gulp.src(['./src/resources/**/*']).pipe(gulp.dest('./build/resources/'));
    gulp.src('./package.json').pipe(gulp.dest('./build'));
    cb();
});

gulp.task('mail-templates', (cb) => {
    gulp.src(['./src/emails/**/*']).pipe(gulp.dest('./build/emails/'));
    cb();
});

gulp.task('server', (cb) => {
    if (server && server.pid) {
        kill(server.pid);
    }
    server = spawn('node', ['index.js'], {'cwd': 'build/', shell: true});

    server.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    server.stderr.on('data', (error) => {
        console.error(error.toString());
    });
    cb();
});

gulp.task('build', gulp.series(['clean', 'transpile-ts', 'resources', 'mail-templates']));

gulp.task('default', gulp.series(['build', 'server', () => {
    gulp.watch('./src/**/*', gulp.series(['build', 'server']));
}]));
