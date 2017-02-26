var db = { Designers: {},
           Artists: {},
           Publishers: {},
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
  var artistsArr = arr.slice(artistsIndex+1, publishersIndex);
  var publishersArr = arr.slice(publishersIndex+1, categoriesIndex);
  var categoriesArr = arr.slice(categoriesIndex+1, mechanismsIndex);
  var mechanismsArr = arr.slice(mechanismsIndex+1, familyIndex);
  var familyArr = arr.slice(familyIndex+1, arr.length);

  var boardgameObj = { Designers:  [designersArr],
                       Artists:    [artistsArr],
                       Publishers: [publishersArr],
                       Categories: [categoriesArr],
                       Mechanisms: [mechanismsArr],
                       Family:     [familyArr]
                     };

  database.ref(`Boardgames/${id}`)
          .set(JSON.stringify(boardgameObj));

  updateDatabase("Designers", cleanData(designersArr), id);
  updateDatabase("Artists", cleanData(artistsArr), id);
  updateDatabase("Publishers", publishersArr, id);
  updateDatabase("Categories", cleanData(categoriesArr), id);
  updateDatabase("Mechanisms", cleanData(mechanismsArr), id);
  updateDatabase("Family", cleanData(familyArr), id);

  database.ref("Designers").set(db.Designers);
  database.ref("Artists").set(db.Artists);
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
