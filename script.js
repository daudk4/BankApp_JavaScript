'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`;
    const html = `
  <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">Rs. ${mov}/-</div>
        </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `Rs. ${acc.balance}/- `;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `Rs. ${incomes}/-`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `Rs. ${Math.abs(out)}/-`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate)
    .filter(intt => intt >= 100)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `Rs. ${interest}/-`;
};

const createUserNames = function (accs) {
  accs.forEach(function (mov) {
    mov.username = mov.owner
      .toLowerCase()
      .split(' ')
      .map(mov => mov[0])
      .join('');
  });
};
createUserNames(accounts);

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);
  //Display balance
  displayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

//Event Handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  // Used Optional chaining here (?.)
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //Clear input fields and remove the focus from pin box:
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    //update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const usernameEntered = inputCloseUsername.value;
  const pinEntered = Number(inputClosePin.value);
  if (
    currentAccount.username === usernameEntered &&
    currentAccount.pin === pinEntered
  ) {
    const index = accounts.findIndex(acc => acc.username === usernameEntered);

    //Delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;

    //Welcome Text
    labelWelcome.textContent = 'Login to get started';
  }
  //Clear fields:
  inputClosePin.value = inputCloseUsername.value = '';
  inputClosePin.blur();
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// const createUser = function (i) {
//   const username = i
//     .toLowerCase()
//     .split(' ')
//     .map(mov => mov[0])
//     .join('');
//   return username;
// };
// const user = 'Steven Thomas Williams';
// console.log(createUser(user));

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets 

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
*/

// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];

// const checkDogs = function (dogsJulia, dogsKate) {
//   const dogsJuliaCorrected = dogsJulia;
//   // dogsJuliaCorrected.splice(0, 1);
//   // dogsJuliaCorrected.splice(-2);
//   const dogsJuliaCorrected2 = dogsJuliaCorrected.slice(1, 3);

//   const dogs = dogsJuliaCorrected2.concat(dogsKate);

//   dogs.forEach(function (mov, i) {
//     if (mov >= 3) {
//       console.log(`Dog number ${i + 1} is an adult, and is ${mov} years old.`);
//     } else {
//       console.log(
//         `Dog number ${i + 1} is still a puppy 🐶, and is ${mov} years old`
//       );
//     }
//   });
// };

// checkDogs(dogsJulia, dogsKate);

//////////////////////////////////////////////////////////////////////////////////////////
// MAP METHOD (using arrow function)

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const usdToPkr = 2;
// const conversion = movements.map(mov => mov * usdToPkr);
// console.log(movements);
// console.log(conversion);

//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const movementsDescription = movements.map(
//   (mov, i) =>
//     `Movements ${i + 1}: You ${mov > 0 ? `deposited` : `Withdrew`} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movementsDescription);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const withdrawal = movements.filter(mov => mov < 0);
// console.log(withdrawal);

// //Reduce method
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const balance = movements.reduce((acc, mov, i) => acc + mov, 0);

// console.log(balance);

// //Min value in array using reduce Method:
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const min = movements.reduce(function (acc, mov) {
//   if (acc < mov) return acc;
//   else return mov;
// }, movements[0]);
// console.log(min);

// //Max value in array using reduce Method:
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);
// console.log(max);

// const ages = [5, 2, 4, 1, 15, 8, 3];
// const ages2 = [16, 6, 10, 5, 6, 1, 4];
// const calcAverageHumanAge = function (movement) {
//   const humanAges = movement.map(dogAge => {
//     if (dogAge <= 2) return 2 * dogAge;
//     else return 16 + dogAge * 4;
//   });
//   const adults = humanAges.filter(mov => mov >= 18);
//   console.log(adults);
//   console.log(humanAges);
//   const average =
//     adults.reduce((acc, mov, i, arr) => acc + mov, 0) / adults.length;
//   return average;
// };

// const avg1 = calcAverageHumanAge(ages);
// const avg2 = calcAverageHumanAge(ages2);
// console.log(avg1, avg2);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const totalDeposits = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * 2)
//   .reduce((acc, mov, i, arr) => acc + mov, 0);

// console.log(movements);
// console.log(totalDeposits);

// //Challenge 3:
// const ages = [5, 2, 4, 1, 15, 8, 3];
// const ages2 = [16, 6, 10, 5, 6, 1, 4];
// const calcAverageHumanAge = movement =>
//   movement
//     .map(dogAge => {
//       if (dogAge <= 2) return 2 * dogAge;
//       else return 16 + dogAge * 4;
//     })
//     .filter(mov => mov >= 18)
//     .reduce((acc, mov, i, arr) => acc + mov / arr.length, 0);
// const avg1 = calcAverageHumanAge(ages);
// const avg2 = calcAverageHumanAge(ages2);
// console.log(avg1, avg2);

// const person = [];
// for (const mov of accounts) {
//   if (mov.owner === `Jessica Davis`) console.log(mov);
// }

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // includes method is For equlaity only
// console.log(movements.includes(-400));

// // some Method is for other conditions too (like greater than or smaller than etc)
// const print = movements.some(mov => mov < 200);
// console.log(print);

// // every Method checks that if all the elements of array passes the condition we have passed.
// const print2 = movements.every(mov => mov > 200);
// console.log(print2);

// // using every method for account4 movements since all the elements of this array are greater than 0
// const print3 = account4.movements.every(mov => mov > 0);
// console.log(print3);

// // Separate callback
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// // flat Method
// console.log(accounts);
// const accountsMovements = accounts.map(mov => mov.movements);
// const allMovements = accountsMovements.flat();
// const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(accountsMovements);
// console.log(allMovements);
// console.log(overallBalance);

// // flat Method
// const overallBalance2 = accounts
//   .map(mov => mov.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance2);

// // flatMap Method (goes only one level deep, so if you want to go more deep  use flat() instead of flatMap Method

// const overallBalance3 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance3);

// sort Method:

const names = new Array('Daud', 'Hannan', 'Bilal', 'Saad', 'Parsa', 'Hafsa');
// sorting strings:
names.sort();
console.log(names);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
movements.sort((a, b) => a - b);
console.log(movements);
