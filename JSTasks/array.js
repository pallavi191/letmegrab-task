// Task 3: Concatenating variable number of arrays into one 

function concateArray(arr) {
    return arr.flat();
}

let arr = [[1, 5], [44, 67, 3], [2, 5], [7], [4], [3, 7], [6]];
console.log("result: ", concateArray(arr));