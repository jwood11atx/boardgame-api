// recommendations =
//         this.sortRecommendations(keys,
//         recommendationObj).reverse().splice(0,2);

  // sortRecommendations(arr, obj){
  //   const middleIndex = Math.floor(arr.length/2);
  //   const leftHalf = arr.splice(0, middleIndex);
  //   const rightHalf = arr;
  //
  //   if(arr.length === 1){
  //     return arr;
  //   }
  //   return this.merge(this.sortRecommendations(leftHalf, obj),
  //                     this.sortRecommendations(rightHalf, obj),
  //                     obj);
  // }
  //
  // merge(leftArr, rightArr, obj){
  //   const leftLength = leftArr.length;
  //   const rightLength = rightArr.length;
  //   let leftIndex = 0;
  //   let rightIndex = 0;
  //   let results = [];
  //
  //   while(leftIndex < leftLength || rightIndex < rightLength){
  //     const key = leftArr[leftIndex];
  //     const value = obj[leftArr[leftIndex]];
  //     if(leftIndex < leftLength && rightIndex < rightLength){
  //       if(obj[leftArr[leftIndex]] < obj[rightArr[rightIndex]]){
  //         results.push(leftArr[leftIndex]);
  //         leftIndex++;
  //       } else {
  //         results.push(rightArr[rightIndex]);
  //         rightIndex++;
  //       }
  //     } else if(leftIndex < leftLength){
  //       results.push(leftArr[leftIndex]);
  //       leftIndex++;
  //     } else {
  //       results.push(rightArr[rightIndex]);
  //       rightIndex++;
  //     }
  //   }
  //   return results;
  // }
