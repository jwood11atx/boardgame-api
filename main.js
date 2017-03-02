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
  var xmlList = [];
  var count = 0;

  ids.forEach(function(id, i){
    database.ref(`Boardgames/${id}`).once("value")
    .then(function(snap){
      return JSON.parse(snap.val());
    })
    .then(function(result){
      count++;
      if(result === null){
        xmlList.push(id);
      } else {
        results.push(result);
      }
    })
    .then(function(){
      if (count === ids.length) {
        if(xmlList.length > 0){
          results.push({xml: xmlList})
          res.send(results);
        } else {
          res.send(results);
        }
      }
    })
  })
})

app.get(`/hotness`, function(req, res){
  request("https://bgg-json.azurewebsites.net/hot",
  function(error, response, body){
    if (!error && response.statusCode == 200){
      res.send(body);
    }
  })
})

app.get(`/list?`, function(req, res){
  var ids = req.query.id;

  request(`https://www.boardgamegeek.com/xmlapi2/thing?id=${ids}`,
  function(error, response, body){
    if (!error && response.statusCode == 200){
      var json = xmlParser.toJson(body);
      json = JSON.parse(json);
      if(json.items)
        res.send(json.items.item);
    }
  })
})

app.get(`/xml?`, function(req, res){
  var ids = req.query.id;
  var results = [];

  request(`https://www.boardgamegeek.com/xmlapi2/thing?id=${ids}`,
  function (error, response, body){
    if (!error && response.statusCode == 200){
      var json = xmlParser.toJson(body);
      json = JSON.parse(json);
      json.items.item.forEach(function(data){
        var newObj =
        data.link.reduce((obj, e) => {
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
        results.push(newObj);
      })
      res.send(results);
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

app.get(`/search?`, function(req, res){
  var search = req.query.id.split(" ").join("+");
  var exact = req.query.exact

  request(`https://www.boardgamegeek.com/xmlapi2/search?query=${search}&type=boardgame&exact=${exact}`,
  function (error, response, body){
    if (!error && response.statusCode == 200){
      var json = xmlParser.toJson(body);
      var gameList = JSON.parse(json);
      if(gameList.items.total == 0){
        res.send([])
      } else {
        gameList = gameList.items.item;
        if(gameList.length > 1){
          gameList = gameList.map(function(game){
            return game.id;
          })
          res.send(gameList);
        } else {
          res.send([gameList.id]);
        }
      }
    }
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
