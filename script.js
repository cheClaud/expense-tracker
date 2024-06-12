const expenseName = document.getElementById("expensename");
const amount = document.getElementById("amount");
const date = document.getElementById("date");
const addExpenseButton = document.getElementById("add");
const expenseList = document.getElementById("expense-list");
const clearButton = document.getElementById("clear");
const clearButtonContainer = document.getElementById("filter-clear");
const filterInputEl = document.getElementById("filter");
let totalAmount = 0;
const totalAmountDisplay = document.getElementById("total-amount");

//creating the expense and adding it to the expense list.
function addExpenseToDomAndLocalStorage(e) {
  e.preventDefault();
  if (expenseName.value === "") {
    alert("Insert an expense name please");
    return;
  }
  if (amount.value === "") {
    alert("Insert the price please");
    return;
  }
  if (date.value === "") {
    alert("Insert the date please");
    return;
  }
  const expenseValue = `${expenseName.value} - $${amount.value} - ${date.value}`;
  makeNewExpense(expenseValue);
  addExpenseToStorage(expenseValue);
  checkExpenses();
}

// this function creates a new expense by creating elements on the fly and inserting in the DOM
function makeNewExpense(item) {
  const expenseContainer = document.createElement("div");
  expenseContainer.className = "added-expense";
  const expenseItem = document.createElement("p");
  expenseItem.className = "expense-details";
  expenseItem.textContent = item;
  const icon = document.createElement("i");
  icon.className = "fa-solid fa-trash";
  expenseContainer.appendChild(expenseItem);
  expenseContainer.appendChild(icon);
  expenseList.appendChild(expenseContainer);
  //updating the total amount
  const amountText = item.split(" - ")[1];
  totalAmount += parseFloat(amountText.replace("$", ""));
  totalAmountDisplay.textContent = totalAmount.toFixed(2);
  expenseName.value = "";
  amount.value = "";
  date.value = "";
}

//this function will display expenses from the local storage at all times the Dom loads
function displayExpenses() {
  const itemsFromStorage = getExpensesFromStorage();
  itemsFromStorage.forEach((item) => makeNewExpense(item));
  checkExpenses();
}

// function to delete expense using event deligation
function deleteExpense(e) {
  if (e.target.classList.contains("fa-trash")) {
    if (
      confirm("Are you sure you want to delete this expense from your list?")
    ) {
      const expenseItem = e.target.parentElement;
      const expenseText =
        expenseItem.querySelector(".expense-details").innerText;
      expenseItem.remove();
      // Extract the amount from the deleted expense and subtract it from the total amount

      const amountText = expenseText.split(" - ")[1];
      totalAmount -= parseFloat(amountText.replace("$", ""));
      totalAmountDisplay.textContent = totalAmount.toFixed(2);
      //removing from the dom and localstorage
      expenseItem.remove();
      removeExpenseFromStorage(expenseText);
      filterInputEl.value = "";
      checkExpenses();
    }
  }
}

//function to filter expenses , that is to look for a particular expense
function filterExpenses() {
  const filterText = filterInputEl.value.toLowerCase();
  const expenses = expenseList.querySelectorAll(".added-expense");

  expenses.forEach((expense) => {
    const expenseText = expense
      .querySelector(".expense-details")
      .innerText.toLowerCase();
    if (expenseText.includes(filterText)) {
      expense.style.display = "";
    } else {
      expense.style.display = "none";
    }
  });
}

//clear expense list
function clearExpenses() {
  if (confirm("Are you sure you want to clear your expense list")) {
    expenseList.innerHTML = "";
    localStorage.removeItem("expenses");
    checkExpenses();
  }
}

//check if expenses exist and then you display the filter input and clear button
function checkExpenses() {
  if (expenseList.children.length <= 1) {
    clearButtonContainer.style.display = "none";
  } else {
    clearButtonContainer.style.display = "flex";
  }
}

//function to add expense to local storage
function addExpenseToStorage(expense) {
  const expensesFromStorage = getExpensesFromStorage();

  /*if (localStorage.getItem("expenses") === null){
    expensesFromStorage = [];
  }else{
    //putting localstorage items in a string object befor getting dem from localstorage
    expensesFromStorage = JSON.parse(localStorage.getItem("expenses"));
  } */

  //add a new item to array
  expensesFromStorage.push(expense);

  //convert to JSON string and set to local storage
  localStorage.setItem("expenses", JSON.stringify(expensesFromStorage));
}

//function to get expenses from storage
function getExpensesFromStorage() {
  let expensesFromStorage;

  if (localStorage.getItem("expenses") === null) {
    expensesFromStorage = [];
  } else {
    //putting localstorage items in a string object befor getting dem from localstorage
    expensesFromStorage = JSON.parse(localStorage.getItem("expenses"));
  }
  return expensesFromStorage;
}

// function to remove expense from local storage
function removeExpenseFromStorage(expense) {
  let expensesFromStorage = getExpensesFromStorage();
  expensesFromStorage = expensesFromStorage.filter((item) => item !== expense);
  localStorage.setItem("expenses", JSON.stringify(expensesFromStorage));
}

addExpenseButton.addEventListener("click", addExpenseToDomAndLocalStorage);
expenseList.addEventListener("click", deleteExpense);
clearButton.addEventListener("click", clearExpenses);
filterInputEl.addEventListener("input", filterExpenses);
document.addEventListener("DOMContentLoaded", displayExpenses);
checkExpenses();
