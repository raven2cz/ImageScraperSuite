const puppeteer = require("puppeteer");
const fs = require("fs");
const data = require("./images.json");
const sharp = require("sharp");
const https = require("https");
const http = require("http");

const MAX_DIMENSION_SIZE = 1000;

const script = async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    const dir = `${data.artist} - ${data.song}`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    try {
        for (let keyword of data.keywords) {
            console.log(`Start downloading for keyword: ${keyword}`);
            const url = `https://duckduckgo.com/?q=${keyword.replaceAll(" ", "+")}&va=b&t=hc&iar=images&iax=images&ia=images`;

            try {
                await page.goto(url);
                await page.waitForNavigation();
                await page.waitForSelector(".tile--img__media");

                await page.evaluate(() => {
                    const firstImage = document.querySelector(".tile--img__media");
                    firstImage.click();
                }, { delay: 400 });

                await page.waitForSelector(".detail__media__img-link");
                const link = await page.evaluate(() => {
                    const links = document.querySelectorAll(".detail__media__img-link");
                    const linkImage = links[0];
                    return linkImage?.getAttribute("href");
                }, { delay: 250 });
                console.log(`Link for ${keyword} successfully retrieved: ${link}`);

                const downloadAndResize = new Promise((resolve, reject) => {
                    const imagePath = `${dir}/${keyword}.jpg`;
                    const tempImagePath = `${dir}/${keyword}-temp.jpg`;
                    const stream = fs.createWriteStream(imagePath);
                    const getFunction = link.startsWith("https:") ? https.get : http.get;

                    getFunction(link, function (response) {
                        response.pipe(stream);
                        stream.on("finish", () => {
                            const stats = fs.statSync(imagePath);
                            if (stats.size === 0) {
                                console.log(`Downloaded image '${keyword}' is empty, skipping...`);
                                fs.unlinkSync(imagePath);
                                resolve();
                                return;
                            }

                            console.log(`Download of '${keyword}' completed, saved to '${imagePath}'`);

                            sharp(imagePath).metadata()
                                .then(metadata => {
                                    const width = metadata.width;
                                    const height = metadata.height;
                                    const isLandscape = width >= height;
                                    const resizeWidth = isLandscape ? MAX_DIMENSION_SIZE : null;
                                    const resizeHeight = isLandscape ? null : MAX_DIMENSION_SIZE;

                                    return sharp(imagePath)
                                        .resize(resizeWidth, resizeHeight)
                                        .toFile(tempImagePath);
                                })
                                .then(() => {
                                    fs.renameSync(tempImagePath, imagePath);
                                    console.log(`Resizing of '${keyword}' completed, resized image saved to '${imagePath}'`);
                                    resolve();
                                })
                                .catch(error => {
                                    console.error(`Error during resizing of '${keyword}': ${error}`);
                                    reject(error);
                                });
                        });
                    });
                });

                try {
                    await downloadAndResize;
                } catch (error) {
                    console.error(`Error during processing of '${keyword}': ${error}`);
                }
            } catch (e) {
                console.log(`Error during scraping for keyword '${keyword}': ${e}`);
            }
        }
    } catch (error) {
        console.error(`Error during overall processing: ${error}`);
    } finally {
        await browser.close();
    }
};

script().then(() => console.log("Script completed."));
