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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// procedures

const displayMovements = function (movements, sort = false) {
  // to set movements dummy inputs to empty
  containerMovements.innerHTML = '';

  const sortedMovements = sort
    ? movements.slice().sort((a, b) => a - b)
    : movements;

  // creating html with the movements information/transaction history
  sortedMovements.forEach(function (amount, i) {
    // to check if amount is greater than 0? then type = deposit else withdrawal
    const type = amount > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${amount} €</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//display total and display as current balance
const calcDisplayBalance = function (account) {
  // reduce
  account.balance = account.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${account.balance} €`;
};

//display total deposits, withdrawals and interest
const calcDisplaySummary = function (acc) {
  // displaying the total deposits
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr);
  labelSumIn.textContent = `${income}€`;

  // displaying total withdrawals
  const withdrawals = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = `${Math.abs(withdrawals)}€`;

  // displaying the interest
  // every deposit * 1.2 = interest
  // only if interest atleast 1 euro, if not exclude interest below 1 euro
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

//creating a function that makes acount user to its initials
const createUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (account) {
  // display movements
  displayMovements(account.movements);
  // display balance
  calcDisplayBalance(account);
  // display summary
  calcDisplaySummary(account);
};

// login functionality
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );

  // optional chaining to check if current user exist
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // clear user inputs
    inputLoginUsername.value = inputLoginPin.value = '';

    // to remove the focus of cursor in the inputs
    inputLoginPin.blur();

    // update UI
    updateUI(currentAccount);
  }
});

// transfer functionality
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  if (
    // amount is not negative
    amount > 0 &&
    // receiver exist?
    receiverAccount &&
    // balance is greater or equal to amount
    currentAccount.balance >= amount &&
    // receiver must not same current account, wont send to own account
    receiverAccount?.username !== currentAccount.username
  ) {
    // transfer process
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // update UI
    updateUI(currentAccount);
  }
});

// loan functionality
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  const isEligible = currentAccount.movements.some(mov => mov >= amount * 0.1);

  if (amount > 0 && isEligible) {
    // add movements
    currentAccount.movements.push(amount);

    // update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

//account close functionality
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      account => account.username === currentAccount.username
    );

    // delete the account
    accounts.splice(index, 1);
    // hide the UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

// sorting the movements
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// Coding Challenge #3
// Rewrite the 'calcAverageHumanAge' function from Challenge #2, but this time
// as an arrow function, and using chaining!
// Test data:
// § Data 1: [5, 2, 4, 1, 15, 8, 3]
// § Data 2: [16, 6, 10, 5, 6, 1, 4]

// Test data:
// Data 1: [5, 2, 4, 1, 15, 8, 3]

// const calcAverageHumanAge = ages => {
//   // making a new array for humanages
//   const humanAges = ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
//   return humanAges;
// };

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// result: 44

// find method
// const account = accounts.find(account => account.owner === 'Jessica Davis');

// // find but in for of loop
// const accountFor = function (accounts) {
//   for (const account of accounts) {
//     if (account.owner === 'Jessica Davis') {
//       console.log(account);
//     }
//   }
// };
// accountFor(accounts);

// console.log(account1.movements);
// // result: Array(8) [ 200, 450, -400, 3000, -650, -130, 70, 1300 ]

// /////// Equality
// console.log(account1.movements.includes(-130));
// // result: true

// /////// Some: Condition
// console.log(account1.movements.some(mov => mov === -130));
// // result: true

// // to check if any movements that is greater than zero
// const anyDeposits = account1.movements.some(mov => mov > 0);
// console.log(anyDeposits);
// // result: true

// /////// Every: Condition
// console.log(account1.movements.every(mov => mov > 0));
// // result: false

// const arr = [[1, 2], 3, 4, 5, [7, 8, 9]];
// console.log(arr.flat());
// // result: Array(8) [ 1, 2, 3, 4, 5, 7, 8, 9 ]

// const arrDeep = [[[2, 4], 9], 11, [12, [9, 7, 44]]];
// console.log(arrDeep.flat(2));
// // result: Array(8) [ 2, 4, 9, 11, 12, 9, 7, 44 ]

// // flat
// const overAllBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, curr) => acc + curr, 0);
// console.log(overAllBalance);
// //result: 17840

// // flatmap
// const overAllBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, curr) => acc + curr, 0);
// console.log(overAllBalance);
// //result: 17840

// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// // result: Array(4) [ "Adam", "Jonas", "Martha", "Zach" ]

// // numbers
// console.log(account1.movements);

// // return < 0, A, B (keep order)
// // return > 0, B, A (swap order)

// // Ascending
// // account1.movements.sort((a, b) => {
// //   if (a > b) return 1;
// //   if (a < b) return -1;
// // });

// account1.movements.sort((a, b) => a - b);
// console.log(account1.movements);
// // result: Array(8) [ -650, -400, -130, 70, 200, 450, 1300, 3000 ]

// // Descending
// // account1.movements.sort((a, b) => {
// //   if (a > b) return -1;
// //   if (a < b) return 1;
// // });

// account1.movements.sort((a, b) => b - a);
// console.log(account1.movements);
// // result: Array(8) [ 3000, 1300, 450, 200, 70, -130, -400, -650 ]

// // creating array manually
// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// // empty arrays + fill method
// const x = new Array(7);
// console.log(x);
// // result: Array(7) [ <7 empty slots> ]

// x.fill(1, 3, 5);
// console.log(x);
// // result: Array(7) [ <3 empty slots>, 1, 1, <2 empty slots> ]

// x.fill(1);
// console.log(x);
// // result: Array(7) [ 1, 1, 1, 1, 1, 1, 1 ]

// arr.fill(23, 2, 6);
// console.log(arr);
// // result: Array(7) [ 1, 2, 23, 23, 23, 23, 7 ]

// // creating an array programmatically
// // Array.from
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);
// // result: Array(7) [ 1, 1, 1, 1, 1, 1, 1 ]

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);
// // result: Array(7) [ 1, 2, 3, 4, 5, 6, 7 ]

// // coding exercise
// // create 100 dice rolls
// const diceRolls = Array.from(
//   { length: 100 },
//   () => Math.trunc(Math.random() * 6) + 1
// );
// console.log(diceRolls);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     // mapping
//     el => el.textContent.replace('€', '')
//   );

//   console.log(movementsUI);
//   // result: Array(8) [ "1300 ", "70 ", "-130 ", "-650 ", "3000 ", "-400 ", "450 ", "200 " ]

//   // can also be written but we can do mapping separately
//   const movementsUI2 = [document.querySelectorAll('.movements__value')];
//   console.log(movementsUI2);
//   // result: Array [ NodeList(8) ]
// });

// array methods practice
const bankDepositSum = accounts
  // gather all elements in movements array
  .flatMap(acc => acc.movements)
  // filter only positive numbers
  .filter(mov => mov > 0)
  // add all numbers
  .reduce((acc, curr) => acc + curr, 0);
console.log(bankDepositSum);
// result: 25180

// to check if there is deposit atleast 1000
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length;
console.log(numDeposits1000);
// result: 6

const numDeposits1000Reduce = accounts
  .flatMap(acc => acc.movements)
  // .reduce((count, curr) => (curr >= 1000 ? count + 1 : count), 0);
  .reduce((count, curr) => (curr >= 1000 ? ++count : count), 0);
console.log(numDeposits1000Reduce);
// result: 6

// get the sum of deposits and withdrawals in an object
// sums was destructured to { deposits, withdrawals }
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, curr) => {
      // curr > 0 ? (sums.deposits += curr) : (sums.withdrawals += curr);
      sums[curr > 0 ? 'deposits' : 'withdrawals'] += curr;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);
// result: Object { deposits: 25180, withdrawals: -7340 }
// result: 25180 -7340

// convert strings with upppercase first letter with exceptions
const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titleCase);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
// result:
// This Is a Nice Title
// This Is a Long Title but Not Too Long
// And Here Is Another Title with an Example
