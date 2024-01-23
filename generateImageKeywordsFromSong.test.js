// generateImageKeywordsFromSong.test.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

test('generateImageKeywordsFromSong script produces correct output', done => {
    // Specify a test output directory
    const testOutputDir = path.join(__dirname, 'test_output2');
    const testOutputFile = path.join(testOutputDir, 'images.json');

    // Ensure the directory exists
    fs.mkdirSync(testOutputDir, { recursive: true });

    exec(`node generateImageKeywordsFromSong.js "Waka Waka" "Shakira" "The Sun Comes Out" "${testOutputDir}"`, (error, stdout, stderr) => {
        expect(error).toBeNull();
        expect(stderr).toBe('');

        // Validate output in the json
        const outputJson = JSON.parse(fs.readFileSync(testOutputFile, 'utf8'));
        expect(outputJson).toHaveProperty('description');
        expect(outputJson).toHaveProperty('song', 'Waka Waka');
        expect(outputJson).toHaveProperty('artist', 'Shakira');
        expect(outputJson).toHaveProperty('album', 'The Sun Comes Out');
        expect(outputJson).toHaveProperty('keywords');
        expect(Array.isArray(outputJson.keywords)).toBeTruthy();
        expect(outputJson).toHaveProperty('outputPath', testOutputDir);

        // Cleanup: Remove test output directory
        fs.rmSync(testOutputDir, { recursive: true });

        done();
    });
});
