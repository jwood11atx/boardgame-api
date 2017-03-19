const webdriver = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const getIndex = (arr, str1, str2) => {
  return arr.indexOf(str1) != -1 ? arr.indexOf(str1) : arr.indexOf(str2)
}

const convertToObj = (arr, id) => {
  const designersIndex = getIndex(arr, "Designers", "Designer");
  const artistsIndex = getIndex(arr, "Artists", "Artist");
  const publishersIndex = getIndex(arr, "Publishers", "Publisher");
  const categoriesIndex = getIndex(arr, "Categories", "Category");
  const mechanismsIndex = getIndex(arr, "Mechanisms", "Mechanism");
  const familyIndex = getIndex(arr, "Family");

  const designersArr = arr.slice(designersIndex+1, artistsIndex);
  const categoriesArr = arr.slice(categoriesIndex+1, mechanismsIndex);
  const mechanismsArr = arr.slice(mechanismsIndex+1, familyIndex);
  const familiesArr = arr.slice(familyIndex+1, arr.length);

  const title = arr[getIndex(arr, "Primary Name")+1];
  const boardgame = {title, id, created_at: new Date()};

  database("boardgames").insert(boardgame)
  .then(() => {
    database("boardgames").select();
  });

  updateTypeTables(designersArr, "designers", "designer_id", id);
  updateTypeTables(categoriesArr, "categories", "category_id", id);
  updateTypeTables(mechanismsArr, "mechanisms", "mechanism_id", id);
  updateTypeTables(familiesArr, "families", "family_id", id);
}

const updateTypeTables = (typeArr, typeStr, type_id, boardgame_id) => {
  typeArr.forEach((type) => {
    database(typeStr).where("type", type).select()
      .then((selection) => {
        if(selection.length === 0){
          database(typeStr).insert({type, created_at: new Date()})
            .then(() => {
              updateJoinTables(type, typeArr, typeStr, type_id, boardgame_id);
            })
        } else {
          updateJoinTables(type, typeArr, typeStr, type_id, boardgame_id, selection);
        }
      });
  })
}

const insertData = (typeStr, type_id, boardgame_id, result) => {
  database(`boardgame_${typeStr}`).insert(
    {
      boardgame_id,
      [type_id]: result[0].id,
      created_at: new Date()
    }
  )
    .then(() => {
      database(`boardgame_${typeStr}`).select();
    })
}

const updateJoinTables = (type, typeArr, typeStr, type_id, boardgame_id, result) => {
  let dataObj = {};
  if (result) {
    insertData(typeStr, type_id, boardgame_id, result)
  } else {
    database(typeStr).where("type", type).select()
    .then((result) => {
      insertData(typeStr, type_id, boardgame_id, result)
    })
  }
}


//--------------------SCRAPE CODE---------------------//
// v-----------------CODE IS GOOD---------------------v
// //
const By = webdriver.By;
const until = webdriver.until;

const driver = new webdriver.Builder()
.forBrowser("firefox")
.build();

getURLs = () => {
  let urls = [];
  driver.sleep()
  .then(() => {
    for(let i=1; 100>=i; i++){
      driver.findElement(By.css(`#results_objectname${i} > a`))
      .then((link) => {
        link.getAttribute("href")
        .then((url) => {
          urls.push(url + "/credits")
        })
      })
    }
  })
  return urls;
}

const getData = (url) => {
  driver.get(url);

  driver.sleep()
  let bgArray = [];
  let bgID = null;
  driver.getCurrentUrl()
  .then((url) => {
    const urlArray = url.split("/");
    bgID = urlArray[urlArray.indexOf("boardgame")+1]
  })

  driver.findElements(By.css(".outline-item"))
  .then((arr) => {
    arr.map((e) => {
      e.getText()
      .then((text) => {
        bgArray.push(text);
      })
    })
  })

  driver.sleep()
  .then(() => {
    bgArray = bgArray.map((e) => {
      return e.split("\n")
    })
    bgArray = bgArray.join(",").split(",");
    convertToObj(bgArray, bgID);
  })
}

 runMain = () => {
  let path = "";
  let pageNum = 1;
  for(let i=1; 30>=i; i++){
    driver.sleep()
    .then(() => {
      if(pageNum != 1){
        path = `/page/${pageNum}`
      }
      pageNum++;
      driver.get(`https://boardgamegeek.com/browse/boardgame${path}`)
      .then(() => {
        driver.sleep(1000)
        .then(() => {
          return getURLs();
        })
        .then((urls) => {
          urls.forEach((url) => {
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
