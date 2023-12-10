const fs = require('fs');

function generateKeywords(songName, artistName, albumName) {
    const keywords = [];

    keywords.push(artistName);
    if (albumName) {
        keywords.push(`${artistName} ${albumName}`);
        keywords.push(`${albumName} album artwork`);
    }
    keywords.push(`${songName} ${artistName}`);
    keywords.push(`${artistName} concert`);
    keywords.push(`${artistName} fan art`);
    keywords.push(`${songName} theme`);
    keywords.push(`${artistName} music visual`);
    keywords.push(`${songName} soundtrack`);
    keywords.push(`${songName} movie theme`);
    keywords.push(`${artistName} movie theme`);

    return keywords;
}

function createJsonForKeywords(songName, artistName, albumName, keywords) {
    return JSON.stringify({
        description: "Keywords for downloading images related to the song, artist, and album.",
        song: songName,
        artist: artistName,
        album: albumName,
        keywords: keywords
    }, null, 2);
}

const args = process.argv.slice(2);
if (args.length < 2) {
    console.error('Please provide at least a song name and an artist name.');
    process.exit(1);
}

const [songName, artistName, albumName] = args;

const keywords = generateKeywords(songName, artistName, albumName);
const keywordsJson = createJsonForKeywords(songName, artistName, albumName, keywords);

fs.writeFile('images.json', keywordsJson, 'utf8', (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Keywords saved to images.json');
});
