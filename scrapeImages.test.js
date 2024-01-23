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

    const testOutputDir = path.join(__dirname, 'test_output');
    fs.mkdirSync(testOutputDir, { recursive: true });

    const dataPath = path.join(testOutputDir, 'images.json');
    fs.writeFileSync(dataPath, JSON.stringify(testData));

    exec(`node scrapeImages.js "${testOutputDir}"`, (error, stdout, stderr) => {
        expect(error).toBeNull();
        expect(stderr).toBe('');

        // Validate results
        const dir = path.join(testOutputDir, `${testData.artist} - ${testData.song}`);
        expect(fs.existsSync(dir)).toBe(true);
        const downloadedFiles = fs.readdirSync(dir);
        expect(downloadedFiles.length).toBeGreaterThan(0);

        // Clear after test
        downloadedFiles.forEach(file => fs.unlinkSync(path.join(dir, file)));
        fs.rmSync(dir, { recursive: true });
        fs.unlinkSync(dataPath);
        fs.rmSync(testOutputDir, { recursive: true });

        done();
    });
}, 60000);
