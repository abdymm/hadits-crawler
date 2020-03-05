// main.js
const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

let url = "";
const naratorHaditsPaths = [
  "/dawud/",
  "/bukhari/",
  "/muslim/",
  "/tirmidzi/",
  "/nasai/",
  "/majah/"
];

let naratorIndex = 0;
let haditsNumber = 1;
//fetchDetailUrl();
let listOfHadits = [];
function fetchDetailUrl() {
  naratorPath = naratorHaditsPaths[naratorIndex];
  if (naratorIndex < naratorHaditsPaths.length) {
    url = "https://www.hadits.id/hadits" + naratorPath + haditsNumber;

    console.log("URL: " + url);
    fetchData(url).then(res => {
      if (!res) {
        //the hadits not available
        haditsNumber = 0;
        naratorIndex++;
        console.log("+++++++++++Change Narator+++++++++++"); //need to stop
      } else {
        const html = res.data;
        const $ = cheerio.load(html);
        const title = $("h1").text();
        const subTitle = $("h2").text();
        const contentArab = $(".hadits-content p")
          .eq(0)
          .text();
        const contentInd = $(".hadits-content p")
          .eq(1)
          .text();

        let response = {
          haditsNumber: haditsNumber,
          narator: naratorPath.replace("/", "").replace("/", ""),
          title: title,
          subTitle: subTitle,
          contentArab: contentArab,
          contentInd: contentInd
        };
        listOfHadits.push(response);
        console.log("response " + JSON.stringify(response));
      }

      haditsNumber++;
      fetchDetailUrl();
    });
  } else {
    //finish crawl
    console.log(listOfHadits);
    fs.appendFile("hadits.json", JSON.stringify(listOfHadits), function(err) {
      if (err) throw err;
      console.log("Saved!");
    });
  }
}
async function fetchData(url) {
  console.log("=================================");
  console.log("Crawl...");
  // make http call to url
  let response = await axios(url).catch(err => false);

  if (response.status !== 200) {
    return;
  }
  return response;
}
