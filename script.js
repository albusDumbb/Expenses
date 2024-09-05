// Function to update the total expenses in the DOM
function updateTotalExpenses(newTotal) {
  const totalExpensesBody = document.querySelector("#totalExpenses h3");
  totalExpensesBody.innerHTML = `$${newTotal !== undefined ? newTotal : 0}`; // Default to 0 if newTotal is undefined
}

// Fetching all data when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost/markTutorial/index.php")
    .then((dataFetched) => dataFetched.json())
    .then((data) => {
      if (data.status === "Success!") {
        // Display the initial total expenses
        updateTotalExpenses(data.totalExpenses); // Updated to use the updateTotalExpenses function

        const tableBody = document.querySelector("#expenseTable ul");
        data.data.forEach((item) => {
          const row = document.createElement("li");

          row.innerHTML = `
          <div class="icons">
            <img class="icon" src="images/bag.png" alt="">
          </div>
          <div class="content">
            <span class="spanItemName">${item.item}<p>purchased</p></span>
            <span>
              <span class="price">${item.price}</span>
              <button class="delete-btn" data-id="${item.item_id}">
                <img class="deleteIcon" src="images/delete-svgrepo-com (1).png" alt="">
              </button>
            </span>
          </div>
          `;
          tableBody.appendChild(row);
        });

        // Add event listeners to all delete buttons
        document.querySelectorAll(".delete-btn").forEach((button) => {
          button.addEventListener("click", (event) => {
            const itemId = event.target.closest("button").dataset.id;
            const itemPrice = parseFloat(
              event.target.closest("li").querySelector(".price").textContent
            ); // Get the price of the item being deleted

            fetch("http://localhost/markTutorial/delete.php", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ item_id: itemId }),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.status === "success!") {
                  event.target.closest("li").remove();
                  updateTotalExpenses(data.totalExpenses); // Update the total expenses after deletion
                } else {
                  alert(data.message);
                }
              });
          });
        });

        document
          .querySelector("#expenseForm")
          .addEventListener("submit", (event) => {
            event.preventDefault();

            const formData = new FormData(
              document.querySelector("#expenseForm")
            );

            fetch("http://localhost/markTutorial/add.php", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.status === "success!") {
                  const tableBody = document.querySelector("#expenseTable ul");
                  const row = document.createElement("li");

                  row.innerHTML = `
                <div class="icons">
                  <img src="images/confirm-purchase-svgrepo-com.svg" class="icon" alt="" />
                </div>
                <div class="content">
                  <span class="spanItemName">${formData.get(
                    "item"
                  )}<p>purchased</p></span>
                  <span>
                    <span class="price">${formData.get("price")}</span>
                    <button class="delete-btn" data-id="${data.item_id}">
                      <img class="deleteIcon" src="images/delete-svgrepo-com (1).png" alt="">
                    </button>
                  </span>
                </div>
                `;

                  tableBody.appendChild(row);

                  // Update total expenses after adding the new item
                  updateTotalExpenses(data.totalExpenses); // Updated to use the updateTotalExpenses function

                  // Clear the form inputs
                  document.querySelector("#itemName").value = "";
                  document.querySelector("#itemPrice").value = "";
                } else {
                  alert(data.message);
                }
              });
          });
      }
    });
});

// Form button
function formButton() {
  var button = document.getElementById("form");
  if (button.style.display === "none") {
    button.style.display = "flex";
  } else {
    button.style.display = "none";
  }
}
