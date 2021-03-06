var webdriver = require("selenium-webdriver");
var firefox = require("selenium-webdriver/firefox");
var {firebase, database} = require("./firebase");

var db = { Designers: {},
           Categories: {},
           Mechanisms: {},
           Family: {}
         }

function getIndex(arr, str1, str2){
  return arr.indexOf(str1) != -1 ? arr.indexOf(str1) : arr.indexOf(str2)
}

function convertToObj(arr, id){
  var designersIndex = getIndex(arr, "Designers", "Designer");
  var artistsIndex = getIndex(arr, "Artists", "Artist");
  var publishersIndex = getIndex(arr, "Publishers", "Publisher");
  var categoriesIndex = getIndex(arr, "Categories", "Category");
  var mechanismsIndex = getIndex(arr, "Mechanisms", "Mechanism");
  var familyIndex = getIndex(arr, "Family");

  var designersArr = arr.slice(designersIndex+1, artistsIndex);
  var categoriesArr = arr.slice(categoriesIndex+1, mechanismsIndex);
  var mechanismsArr = arr.slice(mechanismsIndex+1, familyIndex);
  var familyArr = arr.slice(familyIndex+1, arr.length);

  var boardgameObj = { Designers:  designersArr,
                       Categories: categoriesArr,
                       Mechanisms: mechanismsArr,
                       Family:     familyArr
                     };

  database.ref(`Boardgames/${id}`)
          .set(JSON.stringify(boardgameObj));

  updateDatabase("Designers", cleanData(designersArr), id);
  updateDatabase("Categories", cleanData(categoriesArr), id);
  updateDatabase("Mechanisms", cleanData(mechanismsArr), id);
  updateDatabase("Family", cleanData(familyArr), id);

  database.ref("Designers").set(db.Designers);
  database.ref("Categories").set(db.Categories);
  database.ref("Mechanisms").set(db.Mechanisms);
  database.ref("Family").set(db.Family);
}

function cleanData(data){
  if(typeof data == "object"){
    return data.map(function(e){
      return e.split(/[\.#$/\]\[\s]/g).join("_");
    })
  } else {
    return data.split(/[\.#$/\]\[\s]/g).join("_");
  }
}

function updateDatabase(key, arr, id){
  arr.forEach(function(e){
    db[key][e] ? db[key][e].push(id) : db[key][e] = [id];
  })
}

//--------------------SCRAPE CODE---------------------//
// v-----------------CODE IS GOOD---------------------v
// //
var By = webdriver.By;
var until = webdriver.until;

var driver = new webdriver.Builder()
.forBrowser("firefox")
.build();

function getURLs(){
  var urls = [];
  driver.sleep(100)
  .then(function(){
    for(var i=1; 100>=i; i++){
      driver.findElement(By.css(`#results_objectname${i} > a`))
      .then(function(link){
        link.getAttribute("href")
        .then(function(url){
          urls.push(url + "/credits")
        })
      })
    }
  })
  return urls;
}

function getData(url){
  driver.get(url);

  driver.sleep(500)
  var bgArray = [];
  var bgID = null;
  driver.getCurrentUrl()
  .then(function(url){
    var urlArray = url.split("/");
    bgID = urlArray[urlArray.indexOf("boardgame")+1]
  })

  driver.findElements(By.css(".outline-item"))
  .then(function(arr){
    arr.map(function(e){
      e.getText()
      .then(function(text){
        bgArray.push(text);
      })
    })
  })

  driver.sleep(500)
  .then(function(){
    bgArray = bgArray.map(function(e){
      return e.split("\n")
    })
    bgArray = bgArray.join(",").split(",");
    var data = convertToObj(bgArray, bgID)
  })
}

function runMain(){
  var path = "";
  var pageNum = 1;
  for(var i=1; 30>=i; i++){
    driver.sleep(100)
    .then(function(){
      if(pageNum != 1){
        path = `/page/${pageNum}`
      }
      pageNum++;
      driver.get(`https://boardgamegeek.com/browse/boardgame${path}`)
      .then(function(){
        driver.sleep(2000)
        .then(function(){
          return getURLs();
        })
        .then(function(urls){
          urls.forEach(function(url){
            getData(url);
          })
        })
      })
    })
  }
}

runMain();

driver.quit()

// ^-----------------CODE IS GOOD---------------------^
module.exports = {cleanData};
