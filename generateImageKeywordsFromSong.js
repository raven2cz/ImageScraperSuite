const fs = require('fs');
const path = require('path');

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

function createJsonForKeywords(songName, artistName, albumName, outputPath, keywords) {
    return JSON.stringify({
        description: "Keywords for downloading images related to the song, artist, and album.",
        song: songName,
        artist: artistName,
        album: albumName,
        outputPath: outputPath,
        keywords: keywords
    }, null, 2);
}

const args = process.argv.slice(2);

if (args.length < 2) {
    console.error('Please provide at least a song name and an artist name.');
    process.exit(1);
}

let songName = args[0];
let artistName = args[1];
let albumName = '';
let outputPath = '~/.cache/ImageScraperSuite';

if (args.length > 2) {
    if (args.length === 4) {
        albumName = args[2];
        outputPath = args[3];
    } else {
        let thirdArg = args[2];
        if (thirdArg.startsWith('/') || thirdArg.startsWith('~')) {
            outputPath = thirdArg;
        } else {
            albumName = thirdArg;
        }
    }
}

const keywords = generateKeywords(songName, artistName, albumName);
const keywordsJson = createJsonForKeywords(songName, artistName, albumName, outputPath, keywords);

const resolvedOutputPath = outputPath.replace(/^~/, process.env.HOME);
const outputFilePath = path.join(resolvedOutputPath, 'images.json');

fs.writeFile(outputFilePath, keywordsJson, 'utf8', (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`Keywords saved to ${outputFilePath}`);
});
