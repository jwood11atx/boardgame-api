var webdriver = require("selenium-webdriver");
var firefox = require("selenium-webdriver/firefox");
var {firebase, database} = require("./firebase");
var express = require("express");
var app = express();
var cors = require('cors');
var request = require("request");
var xmlParser = require("xml2json");
var Promises = require("promise");

var corsOptions = {
  origin: 'http://localhost:8080'
}

app.use(cors(corsOptions))

app.get(`/boardgames?`, function(req, res){
  var ids = req.query.id.split(",");
  var results = [];
  var count = 0;

  ids.forEach(function(id, i){
    database.ref(`Boardgames/${id}`).once("value")
    .then(function(snap){
      return JSON.parse(snap.val());
    })
    .then(function(result){
      count++;
      if(result === null){
        results.push({xml: id})
      } else {
        results.push(result);
      }
    })
    .then(function(){
      if (count === ids.length) {
        res.send(results)
      }
    })
  })
})

app.get(`/xml?`, function(req, res){
  var id = req.query.id;

  var result = null;
  request(`https://www.boardgamegeek.com/xmlapi2/thing?id=${id}`, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var json = xmlParser.toJson(body)
      json = JSON.parse(json);
      json = json["items"]["item"]["link"];

      json = json.reduce((obj, e) => {
        switch (e.type) {
          case "boardgamedesigner":
          if (obj["Designers"]) {
            obj["Designers"].push(e.value);
            return obj;
          } else {
            obj["Designers"] = [e.value];
            return obj;
          }

          case "boardgamecategory":
          if (obj["Categories"]) {
            obj["Categories"].push(e.value);
            return obj;
          } else {
            obj["Categories"] = [e.value];
            return obj;
          }

          case "boardgamemechanic":
          if (obj["Mechanisms"]) {
            obj["Mechanisms"].push(e.value);
            return obj;
          } else {
            obj["Mechanisms"] = [e.value];
            return obj;
          }

          case "boardgamefamily":
          if (obj["Family"]) {
            obj["Family"].push(e.value);
            return obj;
          } else {
            obj["Family"] = [e.value];
            return obj;
          }

          default:
          return obj;
        }
      }, {})
      res.send(json);
    }
  })
})


app.get(`/recommendation?`, function(req, res){

  var key = Object.keys(req.query)[0];
  var cleanValues = cleanData(req.query[key]).split(",");
  var results = []

  cleanValues.forEach(function(value, index){
    database.ref(`${key}/${value}`).once("value")
    .then(function(snapshot){
      if(snapshot.val() !== null){
        results.push(...snapshot.val());
      }
    })
    .then(function(){
      if(cleanValues.length-1 === index){
        res.json(results)
      }
    })
  })
})

function cleanData(data){
  if(typeof data == "object"){
    return data.map(function(e){
      return e.split(/[\.#$/\]\[\s]/g).join("_");
    })
  } else {
    return data.split(/[\.#$/\]\[\s]/g).join("_");
  }
}


app.listen(3000, function(){
  console.log("listening to port 3000");
})
