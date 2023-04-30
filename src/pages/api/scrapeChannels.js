const puppeteer = require("puppeteer");
const fs = require("fs");
import { v4 as uuid } from "uuid";

export default async function handler(req, res) {
  try {
    if (req.method != "GET") {
      res.status(405).json({ error: "Method not Allowed" });
      return;
    }

    // Launch the browser
    const browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium-browser",
      headless: false,
      slowMo: 250,
    });

    // Create a page
    const page = await browser.newPage();

    // Go to the program page for a specific date and channel
    await page.goto(process.env.CHANNELS_LIST_URL);

    // Scrape program data
    const channels = await page.$$eval(
      "section.channel-page__logo-container",
      (items) =>
        items.map((e) => ({
          name: e.querySelector("p.channel-page__name-channel").innerText,
          link: e
            .querySelector(".channel-page__logo-container a")
            .href.split("/")[5],
        }))
    );

    if (!channels || channels.length == 0) {
      res.status(404).json({ error: "No channels found" });
      return;
    }

    for (let channel of channels) {
      channel.id = uuid();
    }

    // Save data to json file
    fs.writeFile("src/data/channels.json", JSON.stringify(channels), (err) => {
      if (err) throw err;
    });

    console.log("Channels file created");

    res.status(200).json({ channels });

    // Close browser.
    await browser.close();
  } catch (error) {
    console.log(error);
  }
}
