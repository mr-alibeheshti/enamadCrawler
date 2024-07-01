import axios from 'axios';
import * as cheerio from 'cheerio';
import mongoose from 'mongoose';
import Website from './models/websites';

mongoose.connect('mongodb://localhost:27017/enamad-data');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

async function crawlEnamadWebsites() {
  try {
    const promises: any[] = [];
    for (let a = 2; a <= 3; a++) {
      const url = `https://enamad.ir/DomainListForMIMT/Index/${a}`;
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);

      for (let i = 1; i <= 30; i++) {
        $(`#Div_Content > div:nth-child(${i})`).each((index, element) => {
          const promise = (async () => {
            const name = $(element).find('div.col-sm-12.col-md-3').text().trim();
            const domain = $(element).find('div:nth-child(2) > a').text().trim();
            let stars = $(element).find('div:nth-child(6) img').length;
            if (isNaN(stars)) {
              stars = 0;
            }
            const expirationDate = $(element).find('div:nth-child(8)').text().trim();
            const city = $(element).find('div:nth-child(4)').text().trim();
            const existingWebsite = await Website.findOne({ domain });
            if (existingWebsite) {
              console.log(`Domain ${domain} already exists. Skipping...`);
            } else {
              const website = new Website({ name, domain, city, stars, expirationDate });
              await website.save();
              console.log(`Saved ${domain}`);
            }
          })();
          promises.push(promise);
        });
      }
    }
    await Promise.all(promises);
    console.log('Crawl completed correctly :)');
  } catch (error) {
    console.error('Error while crawling Enamad websites:', error);
  }
}

crawlEnamadWebsites();
