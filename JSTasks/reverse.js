// Task 1:- Reverse Only Letters

let s = prompt("Enter string to be reversed: "); //"ab-cd";

// Extract letters from the string s
let str = s.match(/[A-Za-z]/g);

// Traverse the original string s
// Traverse the extracted string str also in reversed order
// Copy boh strings in new str reverseStr
let reverseStr = [];
for(let i = 0, j = str.length - 1; i < s.length; i++) {
    // s[i] matched with letters copy to reverseStr
    if(s[i].match(/[A-Za-z]/)) {
        reverseStr[i] = str[j];
        j--;
    } else
        reverseStr[i] = s[i]; // copy non-letters
}
reverseStr = reverseStr.join("")
console.log("Reverse String: ", reverseStr);