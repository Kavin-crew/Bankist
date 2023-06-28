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

const diplayMovements = function (movements) {
  // to set movements dummy inputs to empty
  containerMovements.innerHTML = '';

  // creating html with the movements information/transaction history
  movements.forEach(function (amount, i) {
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

diplayMovements(account1.movements);

//display total and display as current balance
const calcDisplayBalance = function (movements) {
  // reduce
  const balance = movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${balance} €`;
};
calcDisplayBalance(account1.movements);

//display total deposits, withdrawals and interest
const calcDisplaySummary = function (movements) {
  // displaying the total deposits
  const income = movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr);
  labelSumIn.textContent = `${income}€`;

  // displaying total withdrawals
  const withdrawals = movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = `${Math.abs(withdrawals)}€`;

  // displaying the interest
  // every deposit * 1.2 = interest
  // only if interest atleast 1 euro, if not exclude interest below 1 euro
  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * 1.2) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};
calcDisplaySummary(account1.movements);

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

const movements = account1.movements;

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
