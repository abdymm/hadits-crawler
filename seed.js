const fs = require("fs");
const mysql = require("mysql");

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "one_day_"
});

conn.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  let haditsData = fs.readFileSync("result/hadits-tirmidzi.json");
  let hadits = JSON.parse(haditsData);
  hadits.forEach((element, index) => {
    const haditsNumber = element.haditsNumber;
    const narrator = element.narator;
    const title = element.title.replace(/'/g, "\\'");
    const subTitle = element.subTitle.replace(/'/g, "\\'");
    const arabic = element.contentArab;
    const bahasa = element.contentInd.replace(/'/g, "\\'");

    const sql = `INSERT INTO hadits(number, narrator, title, sub_title, content_arabic, content_bahasa) VALUES ('${haditsNumber}','${narrator}','${title}','${subTitle}','${arabic}','${bahasa}')`;
    conn.query(sql, function(err, result) {
      console.log(sql);
      if (err) throw err;

      console.log(haditsNumber + " record inserted");
    });
  });
});
