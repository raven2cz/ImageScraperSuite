const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const data = require('./images.json');

const removeDuplicateAndCorruptedImages = async () => {
    const dir = `${data.artist} - ${data.song}`;
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
            // Pokusíme se načíst obrázek pomocí sharp
            await sharp(filePath).metadata();

            if (fileSizes[size]) {
                console.log(`Duplicate found, deleting '${filePath}'`);
                fs.unlinkSync(filePath);
            } else {
                fileSizes[size] = filePath;
            }
        } catch (error) {
            // Pokud dojde k chybě při načítání, soubor je pravděpodobně poškozený
            console.log(`Corrupted image detected, deleting '${filePath}'`);
            fs.unlinkSync(filePath);
        }
    }
};

removeDuplicateAndCorruptedImages();
