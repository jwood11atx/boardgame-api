var {firebase, database} = require("./firebase");

var getRecommendation = function(idList, res){
  var results = [];
  idList.forEach(function(id, i){
    getBoardgameList(id)
      .then(function(game){
        // var arr = [];
        // Object.keys(game).forEach(function(key){
        //   game[key].forEach(function(e){
        //     arr.push(e);
        //   })
        // })
        // // return arr;
      })
      .then(function(test){
        if(idList.length-1 == i){
          res.json(test);
        }
      })
   })
}

var getBoardgameList = function(id){
  return database.ref(`Boardgames/${id}`).once("value")
          .then(function(snapshot){
            return JSON.parse(snapshot.val());
         })
}




// //-------------THIS CODE BELONGS IN THE APP----------------//
//
// function recommendations(entryArr){
//   var results = [];
//
//   entryArr.forEach(function(entry, i){
//     var obj = convertToObj(entry, null, "entry");
//     Object.keys(obj).forEach(function(key){
//       obj[key].forEach(function(val){
//         if (database[key][val]) {
//           database[key][val].forEach(function(id){
//             results.push(id);
//           })
//         }
//       })
//     })
//   })
//   results = results.reduce(function(obj, id){
//     var newObj = obj;
//     if (obj[id]){
//       newObj[id]++;
//     } else {
//       newObj[id] = 1;
//     }
//     return newObj;
//   }, {})
//   return results;
// }
//
// // var recommendationObj = recommendations([fakeEntry.stubENTRY1, fakeEntry.stubENTRY2]);
// //
// // console.log(recommendationObj);
//


module.exports = getRecommendation;
