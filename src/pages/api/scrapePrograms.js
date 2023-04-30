const puppeteer = require("puppeteer");
const fs = require("fs");
import channels from "../../data/channels.json";
import { add, set, isValid } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export default async function handler(req, res) {
  try {
    if (req.method != "GET") {
      res.status(405).json({ error: "Method not Allowed" });
      return;
    }

    if (!channels || channels.length == 0) {
      res.status(404).json({ error: "No programs found" });
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

    // Specify date
    const date = "2023-05-01";

    let scraped_infos = [];
    let programs = [];
    // for (let channel of channels) {
    for (let i = 0; i < 2; i++) {
      let { id, name, link } = channels[i];

      await page.goto(`${process.env.BASE_URL}/${link}?date=${date}`);
      console.log(`${process.env.BASE_URL}/${link}?date=${date}`);

      scraped_infos = await page.$$eval(
        "section.channel-page__content-program",
        (elements) => {
          let infos = [];
          let title, category_name, start_time, duration;
          for (let e of elements) {
            title = e.querySelector("h2.channel-page__info-title").innerText;
            category_name = e.querySelector(
              "p.channel-page__info-subtitle"
            ).innerText;
            start_time = e.querySelector("p.channel-page__hour").innerText;
            duration = e.querySelector("p.channel-page__picto-hour").innerText;

            infos.push({
              title,
              category_name,
              start_time,
              duration,
            });
          }
          return infos;
        }
      );

      for (let info of scraped_infos) {
        let { title, start_time, duration } = info;
        let start_date,
          start_year,
          start_month,
          start_day,
          start_hours,
          start_minutes,
          end_date,
          end_hours,
          end_minutes;

        if (start_time.includes(":")) {
          // set start date
          start_year = date.split("-")[0];
          start_month = parseInt(date.split("-")[1]) - 1;
          start_day = date.split("-")[2];
          start_hours = start_time.split(":")[0];
          start_minutes = start_time.split(":")[1];

          start_date = set(new Date(start_year, start_month, start_day), {
            hours: start_hours,
            minutes: start_minutes,
          });
          formatInTimeZone(
            start_date,
            "America/New_York",
            "yyyy-MM-dd HH:mm:ss zzz"
          );
          console.log("start_date", start_date, typeof start_date);
          console.log("valid", isValid(start_date));
        } else {
          throw new Error(`Start Time indetermined for program ${title}`);
        }

        if (duration.includes("h")) {
          end_hours = duration.split("h")[0];
          end_minutes = duration.split("h")[1];
          end_date = add(start_date, {
            hours: end_hours,
            minutes: end_minutes,
          });
          console.log("end_date", end_date, typeof end_date);
          console.log("valid1", isValid(end_date));
          formatInTimeZone(
            end_date,
            "America/New_York",
            "yyyy-MM-dd HH:mm:ss zzz"
          );
          info.start_date = start_date;
          info.end_date = end_date;
          delete info.start_time;
          delete info.duration;
        } else if (duration.includes("m")) {
          end_hours = 0;
          end_minutes = duration.split("m")[0];
          end_date = add(start_date, { minutes: end_minutes });
          console.log("end_date", end_date, typeof end_date);
          console.log("valid2", isValid(end_date));
          info.start_date = start_date;
          info.end_date = end_date;
          delete info.start_time;
          delete info.duration;
        } else {
          throw new Error(`Duration indetermined for program ${title}`);
        }
      }

      programs.push({ [id]: scraped_infos });
      console.log(`${name} program saved`);
    }

    // Save data to json file
    fs.writeFile("src/data/programs.json", JSON.stringify(programs), (err) => {
      if (err) throw err;
    });

    console.log("Programs file created");

    res.status(200).json({ programs });

    // Close browser.
    await browser.close();
  } catch (error) {
    console.log(error);
  }
}
