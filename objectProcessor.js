function getVoteSentiment(vote) {
  if (vote == 5 || vote == 4) {
    return -1 * vote;
  } else if (vote == 1 || vote == 2) {
    return vote;
  } else return 0;
}
/*
  description - File to process the User json file and prepares the list of users for a percticular location, designation and department
*/
function processOneUser(data, jsonMap, es) {
  jsonMap.set("totalUsers", jsonMap.get("totalUsers") + 1);

  // location list
  if (jsonMap.has("location")) {
    jsonMap.get("location").push(data["location"]);
  } else {
    jsonMap.set("location", [data["location"]]);
  }

  // designation list
  if (jsonMap.has("designation")) {
    jsonMap.get("designation").push(data["designation"]);
  } else {
    jsonMap.set("designation", [data["designation"]]);
  }

  // department list
  if (jsonMap.has("department")) {
    jsonMap.get("department").push(data["department"]);
  } else {
    jsonMap.set("department", [data["department"]]);
  }

  // location
  if (jsonMap.has(data["location"])) {
    jsonMap.get(data["location"]).push(data["User"]);
  } else {
    jsonMap.set(data["location"], [data["User"]]);
  }

  // designation
  if (jsonMap.has(data["designation"])) {
    jsonMap.get(data["designation"]).push(data["User"]);
  } else {
    jsonMap.set(data["designation"], [data["User"]]);
  }

  // department
  if (jsonMap.has(data["department"])) {
    jsonMap.get(data["department"]).push(data["User"]);
  } else {
    jsonMap.set(data["department"], [data["User"]]);
  }
  es.resume();
}

/*
  description - File to process the Votes json file and calculate the user's vote sentiment
*/
function processOneVote(data, jsonMap, es) {
  if (jsonMap.has(data["userId"])) {
    let votes = jsonMap.get(data["userId"]);
    votes = votes + getVoteSentiment(data["Vote"]);
    jsonMap.set(data["userId"], votes);
  } else {
    jsonMap.set(data["userId"], getVoteSentiment(data["Vote"]));
  }
  es.resume();
}

exports.processOneUser = processOneUser;
exports.processOneVote = processOneVote;
