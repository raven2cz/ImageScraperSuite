// generateImageKeywordsFromSong.test.js
const { exec } = require('child_process');

test('generateImageKeywordsFromSong script produces correct output', done => {
    exec('node generateImageKeywordsFromSong.js "Waka Waka" "Shakira" "The Sun Comes Out"', (error, stdout, stderr) => {
        expect(error).toBeNull();
        expect(stderr).toBe('');
        // todo validate output in the json
        done();
    });
});
