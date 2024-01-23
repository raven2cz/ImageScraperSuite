const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const removeDuplicateAndCorruptedImages = async (outputDir) => {
    const dataPath = path.join(outputDir, 'images.json');
    if (!fs.existsSync(dataPath)) {
        console.error(`File 'images.json' not found in the specified output directory: ${ outputDir }`);
        return;
    }

    const data = require(dataPath);
    const dir = path.join(outputDir, `${data.artist} - ${data.song}`);

    if (!fs.existsSync(dir)) {
        console.log(`Directory '${dir}' does not exist.`);
        return;
    }

    let files = fs.readdirSync(dir);
    let fileSizes = {};

    for (let file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        const size = stats.size;

        try {
            await sharp(filePath).metadata();

            if (fileSizes[size]) {
                console.log(`Duplicate found, deleting '${filePath}'`);
                fs.unlinkSync(filePath);
            } else {
                fileSizes[size] = filePath;
            }
        } catch (error) {
            console.log(`Corrupted image detected, deleting '${filePath}'`);
            fs.unlinkSync(filePath);
        }
    }

};

const args = process.argv.slice(2);
const outputDir = args.length > 0 ? args[0] : path.join(process.env.HOME, '.cache/ImageScraperSuite');

removeDuplicateAndCorruptedImages(outputDir);
