const fs = require("fs");
const { parse } = require("csv-parse");

const nextLecture = (req, res) => {
    let count = 0;
    const teacherId = req.params.teacherId;
    let filePath = `data/${teacherId}.csv`
    fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
          console.log('File does not exist.');
          count++;
      }
    });
    console.log(count)
    if(count>1){
        return res.status(404).send('Requested URL does not exist');
    }
    let csvStream = fs.createReadStream(filePath);
    csvStream.pipe(parse({ delimiter: ",", from_line: 1 }))
        .on("data", function (row) {
            let day = row[0];
            let time = new Date();
            let currDay = time.getDay();
            if(currDay != day){
                return
            }
        
            let subject = row[1];
            let hours = parseInt(row[2]);
            let minutes = parseInt(row[3]);
            let classroom = row[4];
            
            let currHour = time.getHours();
            let currMin = time.getMinutes();
            let currTime = currHour*60 + currMin;
            let lecTime = hours*60 + minutes;
            console.log(currTime, lecTime)
            if(currTime+5 >= lecTime && lecTime-5 <= currTime && count==0){
              console.log(`Time to go to class ${classroom} for ${subject}`);
              count++;
              csvStream.unpipe();
              return res.send(`Time to go to class ${classroom} for ${subject}`);
            }
        })
        .on("error", function (error) {
          return res.status(500).send(error.message);
        })
}

module.exports = nextLecture

let count=0;
let csvStream = fs.createReadStream("data/JohnDoe.csv");
csvStream.pipe(parse({ delimiter: ",", from_line: 1 }))
  .on("data", function (row) {
    let day = row[0];
    let time = new Date();
    let currDay = time.getDay();
    if(currDay != day){
        return
    }

    let subject = row[1];
    let hours = parseInt(row[2]);
    let minutes = parseInt(row[3]);
    let classroom = row[4];
    
    let currHour = time.getHours();
    let currMin = time.getMinutes();
    let currTime = currHour*60 + currMin;
    let lecTime = hours*60 + minutes;
    if(currTime+5 >= lecTime && lecTime-5 <= currTime && count==0){
      console.log(`Time to go to class ${classroom} for ${subject}`);
      count++;
      csvStream.unpipe();
    }
  })
  .on("error", function (error) {
    console.log(error.message);
  })
