### ImageScraperSuite (ISS)

[![Node.js CI](https://github.com/raven2cz/ImageScraperSuite/actions/workflows/node.js.yml/badge.svg)](https://github.com/raven2cz/ImageScraperSuite/actions/workflows/node.js.yml)

**Note: While the abbreviation ISS might remind you of the International Space Station, in our case, it stands for ImageScraperSuite - a straightforward tool for downloading images, not a space expedition!**

ImageScraperSuite is a collection of Node.js scripts providing basic tools for downloading and managing images. This project is in its early development stage, aiming for gradual enhancement with diverse functionalities.

**Key Features:**
- **Image Downloading**: Allows for downloading images from the DuckDuckGo search engine based on keywords related to songs, artists, albums, or content associated with Spotify.
- **Duplicate Removal**: Includes functionality to identify and remove duplicate images, ensuring efficient management of your visual content.
- **Image Integrity Check**: Ensures that the downloaded images are not corrupted and are displayable.
- **Flexibility and Extensibility**: The tools can be customized or expanded according to the user's specific needs.

**Behind the Scenes:**
- While not a traditional contributor, ChatGPT, an AI developed by OpenAI, played a crucial role in shaping the project's direction and functionalities. Though it can't be listed as a contributor on GitHub, its input is embedded in the project's DNA.

**Ideal for**: This project is suitable for individuals or small teams looking to automate the process of downloading images for personal projects or small-scale marketing and graphic endeavors.

**Tags**: #ImageScraping #SpotifyImages #WebScraping #Automation #NodeJS

## Usage

### music_image_scraper Bash Script

We've introduced a new bash script `music_image_scraper` to streamline the process of downloading, processing, and managing images related to music. This script utilizes the ImageScraperSuite to automate the download of images based on song, artist, and album names, with the option to specify an output directory.

**Features:**
- Simplifies the usage of ImageScraperSuite by combining multiple steps into one command.
- Offers flexibility by allowing users to specify an album name and a custom output directory.

**Example Command:**
```bash
./music_image_scraper.sh "Waka Waka" "Shakira" --output-dir ~/MusicImages
```
This command downloads images related to Shakira's "Waka Waka", storing the results in the specified output directory. If you don't use `output-dir` option, the default directory is `~/.cache/ImageScraperSuite`.

### Combined Workflow

For a complete process of downloading, processing, and cleaning up images using the traditional method, run all scripts in sequence:

```bash
node generateImageKeywordsFromSong.js "Waka Waka" "Shakira" "The Sun Comes Out" && \
node scrapeImages.js && \
node removeDuplicateAndCorruptedImages.js
```

This command first generates keywords, then scrapes images based on these keywords, and finally removes any duplicates or corrupted images.

### Independent Usage

Each script can also be used independently. The communication between scripts is facilitated through the `images.json` file, which serves as a data bridge. This flexibility allows for customized usage depending on specific needs or steps of your workflow.
