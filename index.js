import express from "express";

const app = express();
const port = 3000;

let entryLogs = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");


// getting index.ejs
app.get("/", (req, res) => {
    res.render("index");
});

// getting logs.ejs
app.get("/logs", (req, res) => {
    const averages = updateAverages(); // Get the calculated averages
    res.render("logs", {
        entryLogs: entryLogs,  // Pass the logs to render entries
        durationAvg: averages.durationAvg,
        distanceAvg: averages.distanceAvg,
        paceAvg: averages.paceAvg,
        zone5Avg: averages.zone5Avg,
        zone4Avg: averages.zone4Avg,
        zone3Avg: averages.zone3Avg,
        zone2Avg: averages.zone2Avg,
        zone1Avg: averages.zone1Avg,
        avgHrAvg: averages.avgHrAvg,
        maxHrAvg: averages.maxHrAvg,
        strainAvg: averages.strainAvg
    });
});


// Perfoming form submission
app.post("/submit", (req, res) => {
    let date = req.body.formDate;
    let description = req.body.formDescription;
    let hours = req.body.formHours;
    let minutes = req.body.formMinutes;
    let seconds = req.body.formSeconds;
    let distance = req.body.formDistance;
    let pace = req.body.formPace;
    let zone5 = req.body.form5;
    let zone4 = req.body.form4;
    let zone3 = req.body.form3;
    let zone2 = req.body.form2;
    let zone1 = req.body.form1;
    let avgHr = req.body.formAvgHr;
    let maxHr = req.body.formMaxHr;
    let strain = req.body.formStrain;

// add entries to entryLogs array
entryLogs.push({
    date: date,
    description: description,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    distance: distance,
    pace: pace,
    zone5: zone5,
    zone4: zone4,
    zone3: zone3,
    zone2: zone2,
    zone1: zone1,
    avgHr: avgHr,
    maxHr: maxHr,
    strain: strain
    });
    res.redirect("/logs");
    const averages = updateAverages();
});

// Function to calculate averages
function updateAverages() {
    let durationSum = 0, distanceSum = 0, paceSum = 0;
    let zone5Sum = 0, zone4Sum = 0, zone3Sum = 0, zone2Sum = 0, zone1Sum = 0;
    let avgHrSum = 0, maxHrSum = 0, strainSum = 0;
    let entryCount = 0;

    entryLogs.forEach(entry => {
        // Parsing values to numbers
        let hours = parseInt(entry.hours) || 0;
        let minutes = parseInt(entry.minutes) || 0;
        let seconds = parseInt(entry.seconds) || 0;

        // Convert duration to total seconds
        let totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
        durationSum += totalSeconds;

        distanceSum += parseFloat(entry.distance);
        paceSum += parseFloat(entry.pace);
        zone5Sum += parseFloat(entry.zone5);
        zone4Sum += parseFloat(entry.zone4);
        zone3Sum += parseFloat(entry.zone3);
        zone2Sum += parseFloat(entry.zone2);
        zone1Sum += parseFloat(entry.zone1);
        avgHrSum += parseFloat(entry.avgHr);
        maxHrSum += parseFloat(entry.maxHr);
        strainSum += parseFloat(entry.strain);

        entryCount++;  // Increment the count for each entry
    });

    // Calculate averages
    let durationAvgInSeconds = durationSum / entryCount;
    let distanceAvg = distanceSum / entryCount;
    let paceAvg = paceSum / entryCount;
    let zone5Avg = zone5Sum / entryCount;
    let zone4Avg = zone4Sum / entryCount;
    let zone3Avg = zone3Sum / entryCount;
    let zone2Avg = zone2Sum / entryCount;
    let zone1Avg = zone1Sum / entryCount;
    let avgHrAvg = avgHrSum / entryCount;
    let maxHrAvg = maxHrSum / entryCount;
    let strainAvg = strainSum / entryCount;

    // Convert average duration back to hours, minutes, and seconds
    let avgHours = Math.floor(durationAvgInSeconds / 3600);
    let avgMinutes = Math.floor((durationAvgInSeconds % 3600) / 60);
    let avgSeconds = Math.floor(durationAvgInSeconds % 60);

    let durationAvg = `${avgHours}:${avgMinutes}:${avgSeconds}`;

    // Return or display the averages
    return {
        durationAvg,
        distanceAvg,
        paceAvg,
        zone5Avg,
        zone4Avg,
        zone3Avg,
        zone2Avg,
        zone1Avg,
        avgHrAvg,
        maxHrAvg,
        strainAvg
    };
}
  
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

