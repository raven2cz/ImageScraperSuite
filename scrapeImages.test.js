// scrapeImages.test.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

test('scrapeImages script runs without errors', done => {
    const testData = {
        artist: "Shakira",
        song: "Waka Waka",
        album: "The Sun Comes Out",
        keywords: [
            "Shakira",
            "Shakira The Sun Comes Out",
            "The Sun Comes Out album artwork",
            "Waka Waka Shakira",
            "Shakira concert",
            "Shakira fan art",
            "Waka Waka theme",
            "Shakira music visual"
        ]
    };
    fs.writeFileSync('images.json', JSON.stringify(testData));

    // Spuštění skriptu
    exec('node scrapeImages.js', (error, stdout, stderr) => {
        expect(error).toBeNull();
        expect(stderr).toBe('');

        // validate results
        const dir = path.join(__dirname, `${testData.artist} - ${testData.song}`);
        expect(fs.existsSync(dir)).toBe(true);
        const downloadedFiles = fs.readdirSync(dir);
        expect(downloadedFiles.length).toBeGreaterThan(0);

        // clear after test
        downloadedFiles.forEach(file => fs.unlinkSync(path.join(dir, file)));
        fs.rmdirSync(dir);
        fs.unlinkSync('images.json');

        done();
    });
}, 60000);
