// Task 2:- Power of Four

let n = prompt("Enter a number: "); // 16;

while(n % 4 == 0) {
    n /= 4;
}

if(n == 1)
console.log("True");
else
console.log("False");
