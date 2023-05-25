//default code
import puppeteer from 'puppeteer';
import fs from 'fs'

import { PuppeteerCrawler, Request, Dataset, log } from 'crawlee'
const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "/tmp"
});
const page = await browser.newPage();

//URL of product
// await page.goto('https://www.flipkart.com/apple-iphone-14-starlight-128-gb/p/itm3485a56f6e676?pid=MOBGHWFHABH3G73H&lid=LSTMOBGHWFHABH3G73HVXY5AV&marketplace=FLIPKART&q=iphone&store=tyy%2F4io&srno=s_1_2&otracker=search&otracker1=search&fm=organic&iid=fdd0db79-482f-4027-89e2-8ae1ec32b97f.MOBGHWFHABH3G73H.SEARCH&ppt=hp&ppn=homepage&ssid=3nh0p1lrds0000001684822638234&qH=0b3f45b266a97d70');
// await page.goto('https://www.flipkart.com/aroma-nb140-dhamaal-24-hours-playtime-deep-bass-made-india-truewiresless-bluetooth-headset/p/itmf2d694772181d?pid=ACCGKZPFMS4S5EYX&lid=LSTACCGKZPFMS4S5EYXUGGMKB&marketplace=FLIPKART&store=0pm&srno=b_1_2&otracker=hp_omu_Books%252C%2BToys%2B%2526%2BMore_1_32.dealCard.OMU_GPWXGD7P7DJW_18&otracker1=hp_omu_PINNED_neo%2Fmerchandising_Books%252C%2BToys%2B%2526%2BMore_NA_dealCard_cc_1_NA_view-all_18&fm=neo%2Fmerchandising&iid=en_EA1wgYcGQGfjbWfziIBCAwbcSH6G2iGxcztQauAaql%2B6oYCN6ny5BsI7NEAc3ED2IXBFWdE9zQ9JdeT7%2BaAtPg%3D%3D&ppt=browse&ppn=browse&ssid=6kdskv89zk0000001684919759988');
// await page.goto('https://www.flipkart.com/poco-c55-cool-blue-128-gb/p/itm26aca9fd143ba?pid=MOBGMXSWJHRVUWFE&lid=LSTMOBGMXSWJHRVUWFEKXH4XM&marketplace=FLIPKART&store=tyy%2F4io&srno=b_1_6&otracker=clp_metro_expandable_2_5.metroExpandable.METRO_EXPANDABLE_Shop%2BNow_mobile-phones-store_O1WYX08RHODP_wp4&fm=neo%2Fmerchandising&iid=81439e2b-1006-48b6-b770-9176107fa381.MOBGMXSWJHRVUWFE.SEARCH&ppt=clp&ppn=mobile-phones-store&ssid=cweqwfh5zk0000001684922369191');
await page.goto('https://www.flipkart.com/vivo-x90-breeze-blue-256-gb/p/itm59734ba5199c4?pid=MOBGZVNNPBYTWTHE&lid=LSTMOBGZVNNPBYTWTHEVLT4F5&marketplace=FLIPKART&store=tyy%2F4io&srno=b_1_1&otracker=clp_bannerads_1_19.bannerAdCard.BANNERADS_A_mobile-phones-store_84UMFMTQ1GNX&fm=neo%2Fmerchandising&iid=f989152f-c7a8-413a-a9b5-609657dd26db.MOBGZVNNPBYTWTHE.SEARCH&ppt=clp&ppn=mobile-phones-store&ssid=sjfha4vfrk0000001684923795529');

//code for finding total number of pages stored in limit
var total_page = await page.$$eval('div._3UAT2v', elements => elements.map(element => element.textContent));
console.log(total_page)
total_page = total_page[0].replace('[', '').replace(']', '')
total_page = total_page.split(' ');
var limit = (parseInt(total_page[1]))
var limit = Math.floor(limit/10) + 1
console.log(limit)

//search for the reviews button on the product page
const buttonSelector = 'text/reviews';
await page.waitForSelector(buttonSelector);
await page.click(buttonSelector);

//container that will store values
var productReviews = []
var cp = 0 //keep count of current page
var u = 0 //check for current page
// fetch the reviews starting from pages 1
while(cp<=limit){

  //loading time of 5 sec
  await new Promise(r => setTimeout(r, 5000));

  //checking current page
  await page.waitForSelector('div._2MImiq');
  var curr_page = await page.$$eval('div._2MImiq', elements => elements.map(element => element.textContent));
  curr_page = curr_page[0].replace('[', '').replace(']', '')
  curr_page = curr_page.split(' ');
  var cp = (parseInt(curr_page[1]))

  //fetching start
  if(u!=cp){
    u = cp
    var reviews = await page.$$eval('div.t-ZTKy', elements => elements.map(element => element.textContent));
    console.log("scanning done of page ", cp )
    console.log(reviews)
    console.log("\n")
    productReviews.push(reviews)

    reviews = JSON.stringify(reviews, null, 2).replace(/READ MORE/g, '').replace(/"/g, '').replace(/\[/g, '').replace(/\]/g, '');
    fs.appendFile('reviews.csv', reviews, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log('Content added of page ', cp);
      }
    })

  }
    if(cp<limit){
      const buttonSelector = 'text/Next';
      await page.waitForSelector(buttonSelector);
      await page.click(buttonSelector);
    }else{
      break;
    }
}

await new Promise(r => setTimeout(r, 5000));
await browser.close();

