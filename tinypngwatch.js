const fs = require('fs');
const chokidar = require('chokidar');
const tinify = require('tinify');
const path = require('path');

tinify.key = '';

let timestamp = new Date().toISOString().
    replace(/T/, ' '). // Replace T with a space
    replace(/[\s-:]/g, ''). // Delete spaces, -, and : in entire string
    replace(/\..+/, '') // Delete everything after dot

// Watch directory for file changes

// Ignores .dotfiles
chokidar
    .watch([__dirname + '/*.png', __dirname + '/*.jpg'], {
    ignored: /(^|[\/\\])\../
    // Fire When .jpg or .png files are added
})
    .on('add', (fullFilePath) => {

        let tinifiedDestination = __dirname + '/tinified-' + timestamp + '/';
        // Creates /tinified-TIME/ if it doesn't exist. Will create new directory each time file(s) are added.
        if (!fs.existsSync(tinifiedDestination)) {
            fs.mkdir(tinifiedDestination, (err) => {
                if (err) throw err;
            });
        }
        
        console.log('Added ' + fullFilePath);
        let imageName = path.basename(fullFilePath);

        // Run tinify to convert files and move to converted file to desination directory
        tinify
            .fromFile(fullFilePath)
            .toFile(tinifiedDestination + imageName)
            .then(() => {
                console.log('\x1b[30m\x1b[46m%s\x1b[0m', 'Tinification complete!')
            })
            .catch(e => {console.log(e);});

        // Apply date suffix to directory
    })
    .on('error', error => console.log(error));