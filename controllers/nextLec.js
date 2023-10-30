const fs = require("fs");
const { parse } = require("csv-parse");

const nextLecture = (req, res) => {
    // console.log("Hit")
    let count = 0;
    const teacherId = req.params.teacherId;
    let filePath = `data/${teacherId}.csv`

    if (!fs.existsSync(filePath)) {
        console.log('File does not exist.');
        // count += 1;
        return res.status(404).send('Requested URL does not exist');
    }

    let csvStream = fs.createReadStream(filePath);
    csvStream.pipe(parse({ delimiter: ",", from_line: 1 }))
        .on("data", function async (row) {
            let day = row[0];
            let time = new Date();
            let currDay = time.getDay();
            if (currDay != day) {
                return
            }

            let subject = row[1];
            let hours = parseInt(row[2]);
            let minutes = parseInt(row[3]);
            let classroom = row[4];

            let currHour = time.getHours();
            let currMin = time.getMinutes();
            let currTime = currHour * 60 + currMin;
            let lecTime = hours * 60 + minutes;
            // console.log(currTime, lecTime, lecTime - currTime, count, lecTime - currTime > 0, lecTime - currTime <= 5)
            if (lecTime - currTime > 0 && lecTime - currTime <= 5 && count == 0) {
                count++;
                return res.send(`class ${classroom} subject ${subject}`);
            }
        })
        .on('end', () => {
            // This event is triggered when you've reached the end of the stream.
            if(count == 0){
                return res.send("");
            }
          })
        .on("error", function (error) {
            return res.status(500).send(error.message);
        })
}

module.exports = nextLecture