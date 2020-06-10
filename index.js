const fs = require("fs");
const JSONStream = require("JSONStream");
const es = require("event-stream");
const jsonProcessor = require("./objectProcessor");

const userJsonPath = "./users.json";
const votesJsonPath = "./votes.json";

function processJson(filePath, jsonMap, processorFunction) {
  return new Promise((resolve, reject) => {
    var inputStream = fs.createReadStream(filePath, {
      flags: "r",
      encoding: "utf-8",
    });
    inputStream
      .pipe(JSONStream.parse("*"))
      .pipe(
        es.through(function (data) {
          this.pause();
          processorFunction(data, jsonMap, this);
          return data;
        })
      )
      .on("end", () => {
        console.log("stream reading ended");
        resolve();
      });
  });
}

function printOutput(query_type, usersDataObj, userVotesCount) {
  const locations = [...new Set(usersDataObj.get(query_type))];
  let ans = [];

  locations.forEach((location) => {
    const userList = usersDataObj.get(location);

    const voteSentiment = userList.reduce((acc, curr) => {
      return acc + userVotesCount.get(curr);
    }, 0);

    ans.push({
      Segment: location,
      "Sentiment Score": voteSentiment,
      "Participation Percentage":
        (userList.length / usersDataObj.get("totalUsers")) * 100,
    });
  });

  console.table(ans);
}

async function main(query) {
  const usersDataObj = new Map();
  const userVotesCount = new Map();
  usersDataObj.set("totalUsers", 0);

  const promise1 = processJson(
    userJsonPath,
    usersDataObj,
    jsonProcessor.processOneUser
  );
  const promise2 = processJson(
    votesJsonPath,
    userVotesCount,
    jsonProcessor.processOneVote
  );

  await Promise.all([promise1, promise2]);

  printOutput(query, usersDataObj, userVotesCount);
}

const query_type = process.argv.slice(2)[0];

// Main Function
main(query_type);
