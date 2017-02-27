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

// app.get("/boardgames", function(req, res){
//   database.ref("Boardgames").once("value")
//     .then(function(snapshot){
//       res.json(snapshot.val())
//     })
// });

app.get(`/recommendation?`, function(req, res){
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




  // results.forEach(function(e, i){
  //   if(e["xml"]){
  //     var id = e["xml"];
  //     var result = null;
  //       request.get(`https://www.boardgamegeek.com/xmlapi2/thing?id=${id}`, function (error, response, body) {
  //       if (!error && response.statusCode == 200) {
  //         var json = xmlParser.toJson(body)
  //         json = JSON.parse(json);
  //         json = json["items"]["item"]["link"];
  //
  //         json = json.reduce((obj, e) => {
  //           switch (e.type) {
  //             case "boardgamedesigner":
  //             if (obj["Designers"]) {
  //               obj["Designers"].push(e.value);
  //               return obj;
  //             } else {
  //               obj["Designers"] = [e.value];
  //               return obj;
  //             }
  //
  //             case "boardgamecategory":
  //             if (obj["Categories"]) {
  //               obj["Categories"].push(e.value);
  //               return obj;
  //             } else {
  //               obj["Categories"] = [e.value];
  //               return obj;
  //             }
  //
  //             case "boardgamemechanic":
  //             if (obj["Mechanisms"]) {
  //               obj["Mechanisms"].push(e.value);
  //               return obj;
  //             } else {
  //               obj["Mechanisms"] = [e.value];
  //               return obj;
  //             }
  //
  //             case "boardgamefamily":
  //             if (obj["Family"]) {
  //               obj["Family"].push(e.value);
  //               return obj;
  //             } else {
  //               obj["Family"] = [e.value];
  //               return obj;
  //             }
  //
  //             default:
  //             return obj;
  //           }
  //         }, {})
  //         count++;
  //
  //         console.log("WHATKJ!@LK!JL@K$J!L@K$");
  //         results.push("laksdjf;abjeofabjoefbao;webfoabwefo")
  //       }
  //     })
  //   } else {
  //     count++;
  //   }
  //   if(results.length-1 == count){
  //     console.log(count);
  //     console.log(result);
  //     resolve()
  //   }
  // })



  // .then(function(){
  //   promise2;
  //   })
  //   // console.log(results);
  // })



  // var key = Object.keys(req.query);
  // var cleanValues = cleanData(req.query[key]).split(",");
  //
  // console.log(key);
  //
  // var results = []
  // cleanValues.forEach(function(value, index){
  //   database.ref(`${key}/${value}`).once("value")
  //   .then(function(snapshot){
  //     results.push(...snapshot.val());
  //   })
  //   .then(function(){
  //     if(cleanValues.length-1 === index){
  //       res.json(results)
  //     }
  //   })
  // })

// })

// function getMyData() {
//     var def=q.defer();
//     request.get('http://someurl/file.json', function(err, response, body) {
//         def.resolve(response.Name1.prop);
//     })
//     return def.promise();
// }


/////below will be a function to call when game id is not in firebase

// app.get(`/userBGlist?`, function(req, res){
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



  // var results = [];
  // idList.forEach(function(id, i){
  //   cleanKeys = {};
  //   getBoardgameList(id)
  //     .then(function(game){
  //       Object.keys(game).forEach(function(key){
  //         game[key].forEach(function(e){
  //           cleanKeys[key] = cleanData(e)
  //         })
  //       })
  //     })
  //     .then(function(){
  //       if(idList.length-1 === i){
  //         res.json(cleanKeys)
  //         var keyList = Object.keys(cleanKeys);
  //         keyList.forEach(function(key, i){
  //           var value = cleanKeys[key];
  //
  //           cleanKeys[key].forEach(function(value){
  //             database.ref(`${key}/${value}`).once("value")
  //             .then(function(snapshot){
  //               results.push(snapshot.val());
  //             })
  //             .then(function(){
  //               if(keyList.length-1 === i){
  //                 res.json(results)
  //               }
  //             })
  //           })
  //
  //         })
  //       }
  //     })
  //  })

  // getRecommendation(idList, res);

  // getRecommendation(idList).then(function(result){res.json(result)})

  // var response = [];
  // var results = [];
  // idList.forEach(function(id, index){
  //   database.ref(`Boardgames/${id}`).once("value")
  //     .then(function(snapshot){
  //       response.push(JSON.parse(snapshot.val()));
  //     })
  //     .then(function(){
  //       if(index === idList.length-1){
  //         response.forEach(function(game, i){
  //           Object.keys(game).forEach(function(key){
  //             game[key].forEach(function(e){
  //               var cleanKey = cleanData(e);
  //               cleanKey.forEach(function(value){
  //                 database.ref(`${key}/${value}`).once("value")
  //                 .then(function(snapshot){
  //                   results.push(snapshot.val());
  //                 })
  //                 .then(function(){
  //                   if(response.length-1 === i){
  //                     res.json(results);
  //                   }
  //                 })
  //               })
  //             })
  //           })
  //         })
  //       }
  //     })
  //   })

  // var response = [];
  // idList.forEach(function(id, index){
  //   database.ref(`Boardgames/${id}`).once("value")
  //     .then(function(snapshot){
  //       response.push(JSON.parse(snapshot.val()));
  //     })
  //     .then(function(){
  //       if(index === idList.length-1){
  //         res.json(response);
  //       }
  //     })
  //   })
// })

// var getRecommendation = function(idList, res){
//   var results = [];
//   idList.forEach(function(id, i){
//     arr = [];
//     getBoardgameList(id)
//       .then(function(game){
//         Object.keys(game).forEach(function(key){
//           game[key].forEach(function(e){
//             arr.push(e);
//           })
//         })
//       })
//       .then(function(){
//         if(idList.length-1 === i)
//           res.json(arr)
//       })
//    })
// }
//
var getBoardgameList = function(id){
  return database.ref(`Boardgames/${id}`).once("value")
          .then(function(snapshot){
            return JSON.parse(snapshot.val());
         })
}

  // res.json(recommendation.getRecommendation(idList))
    // .then(function(result){
    //   res.json(result)
    // })




  //
  // for(var i=0; artists.length>i; i++){
  //   database.ref(`Artists/${artists[i]}`).once("value")
  //     .then(function(snapshot){
  //       response.push(snapshot.val());
  //     })
  //
  // }
  // res.json(response);
// });


app.listen(3000, function(){
  console.log("listening to port 3000");
})


// var db = { Designers: {},
//            Artists: {},
//            Publishers: {},
//            Categories: {},
//            Mechanisms: {},
//            Family: {}
//          }
//
// function getIndex(arr, str1, str2){
//   return arr.indexOf(str1) != -1 ? arr.indexOf(str1) : arr.indexOf(str2)
// }
//
// function convertToObj(arr, id){
//   var designersIndex = getIndex(arr, "Designers", "Designer");
//   var artistsIndex = getIndex(arr, "Artists", "Artist");
//   var publishersIndex = getIndex(arr, "Publishers", "Publisher");
//   var categoriesIndex = getIndex(arr, "Categories", "Category");
//   var mechanismsIndex = getIndex(arr, "Mechanisms", "Mechanism");
//   var familyIndex = getIndex(arr, "Family");
//
//   var designersArr = arr.slice(designersIndex+1, artistsIndex);
//   var artistsArr = arr.slice(artistsIndex+1, publishersIndex);
//   var publishersArr = arr.slice(publishersIndex+1, categoriesIndex);
//   var categoriesArr = arr.slice(categoriesIndex+1, mechanismsIndex);
//   var mechanismsArr = arr.slice(mechanismsIndex+1, familyIndex);
//   var familyArr = arr.slice(familyIndex+1, arr.length);
//
//   var boardgameObj = { Designers:  [designersArr],
//                        Artists:    [artistsArr],
//                        Publishers: [publishersArr],
//                        Categories: [categoriesArr],
//                        Mechanisms: [mechanismsArr],
//                        Family:     [familyArr]
//                      };
//
//   database.ref(`Boardgames/${id}`)
//           .set(JSON.stringify(boardgameObj));
//
//   updateDatabase("Designers", cleanData(designersArr), id);
//   updateDatabase("Artists", cleanData(artistsArr), id);
//   updateDatabase("Publishers", publishersArr, id);
//   updateDatabase("Categories", cleanData(categoriesArr), id);
//   updateDatabase("Mechanisms", cleanData(mechanismsArr), id);
//   updateDatabase("Family", cleanData(familyArr), id);
//
//   database.ref("Designers").set(db.Designers);
//   database.ref("Artists").set(db.Artists);
//   database.ref("Categories").set(db.Categories);
//   database.ref("Mechanisms").set(db.Mechanisms);
//   database.ref("Family").set(db.Family);
// }
//
function cleanData(data){
  if(typeof data == "object"){
    return data.map(function(e){
      return e.split(/[\.#$/\]\[\s]/g).join("_");
    })
  } else {
    return data.split(/[\.#$/\]\[\s]/g).join("_");
  }
}
//
// function updateDatabase(key, arr, id){
//   arr.forEach(function(e){
//     db[key][e] ? db[key][e].push(id) : db[key][e] = [id];
//   })
// }
//
//
// //NOTE bgg api /thing/id doesn't give category, family, etc.
// //NOTE need to rethink user input data
// //NOTE check db-build for fake data
//
//
//
//

//
//
//
// //--------------------SCRAPE CODE---------------------//
// // v-----------------CODE IS GOOD---------------------v
// // //
// var By = webdriver.By;
// var until = webdriver.until;
//
// var driver = new webdriver.Builder()
// .forBrowser("firefox")
// .build();
//
// function getURLs(){
//   var urls = [];
//   driver.sleep(100)
//   .then(function(){
//     for(var i=61; 63>=i; i++){
//       driver.findElement(By.css(`#results_objectname${i} > a`))
//       .then(function(link){
//         link.getAttribute("href")
//         .then(function(url){
//           urls.push(url + "/credits")
//         })
//       })
//     }
//   })
//   return urls;
// }
//
// function getData(url){
//   driver.get(url);
//
//   driver.sleep(500)
//   var bgArray = [];
//   var bgID = null;
//   driver.getCurrentUrl()
//   .then(function(url){
//     var urlArray = url.split("/");
//     bgID = urlArray[urlArray.indexOf("boardgame")+1]
//   })
//
//   driver.findElements(By.css(".outline-item"))
//   .then(function(arr){
//     arr.map(function(e){
//       e.getText()
//       .then(function(text){
//         bgArray.push(text);
//       })
//     })
//   })
//
//   driver.sleep(500)
//   .then(function(){
//     bgArray = bgArray.map(function(e){
//       return e.split("\n")
//     })
//     bgArray = bgArray.join(",").split(",");
//     var data = convertToObj(bgArray, bgID)
//   })
// }
//
// function runMain(){
//   var path = "";
//   var pageNum = 35;
//   for(var i=1; 2>=i; i++){
//     driver.sleep(100)
//     .then(function(){
//       if(pageNum != 1){
//         path = `/page/${pageNum}`
//       }
//       pageNum++;
//       driver.get(`https://boardgamegeek.com/browse/boardgame${path}`)
//       .then(function(){
//         driver.sleep(2000)
//         .then(function(){
//           return getURLs();
//         })
//         .then(function(urls){
//           urls.forEach(function(url){
//             getData(url);
//           })
//         })
//       })
//     })
//   }
// }
//
// runMain();
//
// driver.quit()

// ^-----------------CODE IS GOOD---------------------^
