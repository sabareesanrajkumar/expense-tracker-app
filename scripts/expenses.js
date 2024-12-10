let buyPremiumBtn = document.getElementById("rzp-button1");
let premiumFeatures = document.getElementById("premium-features");
let token;

window.addEventListener("DOMContentLoaded", () => {
  token = localStorage.getItem("token");
  let isPremiumUser = localStorage.getItem("isPremiumUser");
  console.log("ispremiumuser:", isPremiumUser);
  if (isPremiumUser === "true") {
    buyPremiumBtn.style.display = "none";
    premiumFeatures.style.display = "block";
  }
  getExpenses();
  getIncome();
});

document.getElementById("rzp-button1").onclick = async function (e) {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    "http://localhost:3000/purchase/premiummembership",
    { headers: { Authorization: token } }
  );
  console.log("pay pesponse", response);
  var options = {
    key: response.data.key_id,
    order_id: response.data.order.id,
    handler: async function (response) {
      const updateTransaction = await axios.post(
        "http://localhost:3000/purchase/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
          status: "SUCCESSFUL",
        },
        { headers: { Authorization: token } }
      );

      localStorage.setItem("isPremiumUser", true);

      alert("you're a premium user");
      window.location.reload();
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", async function (response) {
    await axios.post(
      "http://localhost:3000/purchase/updatetransactionstatus",
      {
        order_id: options.order_id,
        payment_id: null,
        status: "FAILED",
      },
      { headers: { Authorization: token } }
    );
    alert("sonething went wrong");
  });
};

document
  .getElementById("expense-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = {
      expense: event.target.expense.value,
      description: event.target.description.value,
      type: event.target.type.value,
    };
    resetForm();
    await axios.post("http://localhost:3000/expenses/addexpense", formData, {
      headers: { Authorization: token },
    });

    getExpenses();
  });

function resetForm() {
  document.getElementById("expense").value = "";
  document.getElementById("description").value = "";
  document.getElementById("type").value = "";
}

async function getExpenses() {
  const expensesContainer = document.getElementById("expenses");
  const getExpenseResponse = await axios.get(
    "http://localhost:3000/expenses/getexpenses",
    { headers: { Authorization: token } }
  );
  expensesContainer.innerHTML = ``;
  getExpenseResponse.data.forEach((expense) => {
    const expenseData = document.createElement("p");
    expenseData.innerHTML = `
        ${expense.expense} - ${expense.description} - ${expense.type}
        <button onclick = "deleteExpense(${expense.id})">Delete</button>
        `;
    expensesContainer.append(expenseData);
  });
}

async function deleteExpense(expenseId) {
  await axios.delete(`http://localhost:3000/expenses/delete/${expenseId}`, {
    headers: { Authorization: token },
  });
  getExpenses();
}

async function getLeaderBoard() {
  const leaderBoardResponse = await axios.get(
    "http://localhost:3000/premium/leaderboard",
    { headers: { Authorization: token } }
  );
  const leaderboardContainer = document.getElementById("leaderboard");
  leaderboardContainer.style.display = "block";
  leaderboardContainer.innerHTML = "";
  leaderBoardResponse.data.forEach((lead) => {
    const leader = document.createElement("p");
    leader.innerHTML = `Name: ${lead.userName}  -  total expense: ${lead.totalExpense}`;
    leaderboardContainer.append(leader);
  });
}

async function filterExpenses(period) {
  let filteredRecords = await axios.get(
    `http://localhost:3000/premium/filteredreport/${period}`,
    { headers: { Authorization: token } }
  );
  const recordsTable = document.getElementById("records-table");
  recordsTable.innerHTML = "";
  filteredRecords.data.forEach((record) => {
    const row = `<tr>
        <td>${record.updatedAt}</td>
        <td>${record.description}</td>
        <td>${record.type ? record.type : ""}</td>
        <td>${record.expense ? record.expense : "-"}</td>
        <td>${record.income ? record.income : "-"}</td>
    </tr>`;
    recordsTable.innerHTML += row;
  });
}

async function downloadReport() {
  document
    .getElementById("download-btn")
    .addEventListener("click", async function () {
      const downloadResponse = await axios.get(
        `http://localhost:3000/download/downloadreport`,
        { headers: { Authorization: token } }
      );
      console.log(downloadResponse);
      if (downloadResponse.status === 200 && downloadResponse.data.fileURL) {
        var a = document.createElement("a");
        a.href = downloadResponse.data.fileURL;
        a.download = "myexpenditures.csv";
        a.click();
      } else {
        console.error("No file URL received or download failed");
      }
    });
}

document
  .getElementById("income-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("income event listener");
    const formData = {
      income: event.target.income.value,
      description: event.target.description.value,
    };
    event.target.income.value = "";
    event.target.description.value = "";

    const incomeResponse = await axios.post(
      "http://localhost:3000/income/addincome",
      formData,
      {
        headers: { Authorization: token },
      }
    );

    getIncome();
  });

async function getIncome() {
  const incomeContainer = document.getElementById("income-container");
  const getIncomeResponse = await axios.get(
    "http://localhost:3000/income/getincome",
    { headers: { Authorization: token } }
  );

  incomeContainer.innerHTML = ``;
  getIncomeResponse.data.forEach((income) => {
    const incomeData = document.createElement("p");
    incomeData.innerHTML = `
        ${income.income} - ${income.description}
        <button onclick = "deleteIncome(${income.id})">Delete</button>
        `;

    incomeContainer.append(incomeData);
  });
}

async function deleteIncome(incomeId) {
  await axios.delete(`http://localhost:3000/income/delete/${incomeId}`, {
    headers: { Authorization: token },
  });
  getIncome();
}
