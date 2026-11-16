document.addEventListener(
  "DOMContentLoaded",
  function () {


    const expenseForm =
      document.getElementById(
        "expenseForm"
      );


    const expenseList =
      document.getElementById(
        "expenseList"
      );


    const totalExpenseElement =
      document.getElementById(
        "totalExpense"
      );


    const totalReceivedElement =
      document.getElementById(
        "totalReceived"
      );


    const netExpenseElement =
      document.getElementById(
        "netExpense"
      );


    const clearAllButton =
      document.getElementById(
        "clearAll"
      );



    /*
     * Load saved transactions
     */

    let expenses = [];


    try {

      const saved =
        localStorage.getItem(
          "expenses"
        );


      if (saved) {

        const parsed =
          JSON.parse(saved);


        if (
          Array.isArray(parsed)
        ) {

          expenses = parsed;

        }

      }

    } catch (error) {

      console.error(
        "Error loading expenses:",
        error
      );

      expenses = [];

    }



    /*
     * Save transactions
     */

    function saveExpenses() {

      try {

        localStorage.setItem(
          "expenses",
          JSON.stringify(
            expenses
          )
        );

      } catch (error) {

        console.error(
          "Error saving expenses:",
          error
        );

        alert(
          "Transaction save nahi ho paya."
        );

      }

    }



    /*
     * Add transaction
     */

    expenseForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();


        const itemInput =
          document.getElementById(
            "item"
          );


        const amountInput =
          document.getElementById(
            "amount"
          );


        const receivedAmountInput =
          document.getElementById(
            "receivedAmount"
          );


        const categoryInput =
          document.getElementById(
            "category"
          );



        const item =
          itemInput.value.trim();


        const amount =
          Number(
            amountInput.value || 0
          );


        const receivedAmount =
          Number(
            receivedAmountInput
              .value || 0
          );


        const category =
          categoryInput.value;



        /*
         * Validate item
         */

        if (item === "") {

          alert(
            "Item name enter karo."
          );

          itemInput.focus();

          return;

        }



        /*
         * Validate expense amount
         */

        if (
          !Number.isFinite(
            amount
          ) ||
          amount < 0
        ) {

          alert(
            "Valid expense amount enter karo."
          );

          amountInput.focus();

          return;

        }



        /*
         * Validate received amount
         */

        if (
          !Number.isFinite(
            receivedAmount
          ) ||
          receivedAmount < 0
        ) {

          alert(
            "Valid received amount enter karo."
          );

          receivedAmountInput.focus();

          return;

        }



        /*
         * At least one amount
         * is required
         */

        if (
          amount === 0 &&
          receivedAmount === 0
        ) {

          alert(
            "Expense ya Received Amount me se kam se kam ek amount enter karo."
          );

          amountInput.focus();

          return;

        }



        /*
         * Create transaction
         */

        const transaction = {

          id:
            Date.now(),

          item:
            item,

          amount:
            amount,

          receivedAmount:
            receivedAmount,

          category:
            category,

          date:
            new Date()
              .toLocaleDateString(
                "en-IN"
              )

        };



        /*
         * Add to array
         */

        expenses.push(
          transaction
        );



        /*
         * Save
         */

        saveExpenses();



        /*
         * Render
         */

        renderExpenses();



        /*
         * Reset form
         */

        expenseForm.reset();


        receivedAmountInput
          .value = "0";


        itemInput.focus();

      }
    );



    /*
     * Render transactions
     */

    function renderExpenses() {

      expenseList.innerHTML =
        "";


      let totalExpense =
        0;


      let totalReceived =
        0;



      /*
       * Empty state
       */

      if (
        expenses.length === 0
      ) {

        expenseList.innerHTML = `
          <p class="empty">
            No transactions yet.
          </p>
        `;


        totalExpenseElement
          .textContent = "0";


        totalReceivedElement
          .textContent = "0";


        netExpenseElement
          .textContent = "0";


        return;

      }



      /*
       * Render every transaction
       */

      expenses.forEach(
        function (expense) {


          const expenseAmount =
            Number(
              expense.amount
            ) || 0;


          /*
           * Compatibility with
           * old transactions
           */

          const receivedAmount =
            Number(
              expense.receivedAmount
            ) || 0;


          const netAmount =
            expenseAmount -
            receivedAmount;



          totalExpense +=
            expenseAmount;


          totalReceived +=
            receivedAmount;



          const div =
            document.createElement(
              "div"
            );


          div.className =
            "expense";



          div.innerHTML = `

            <div class="expense-top">

              <span class="item-name">

                ${escapeHTML(
                  expense.item
                )}

              </span>


              <span class="amount">

                ₹${formatMoney(
                  expenseAmount
                )}

              </span>

            </div>


            <div class="received">

              Received:

              ₹${formatMoney(
                receivedAmount
              )}

            </div>


            <div class="net">

              Net Balance:

              ₹${formatMoney(
                netAmount
              )}

            </div>


            <div class="category">

              ${escapeHTML(
                expense.category ||
                "Other"
              )}

              •

              ${escapeHTML(
                expense.date ||
                ""
              )}

            </div>

          `;


          expenseList.appendChild(
            div
          );

        }
      );



      /*
       * Calculate net balance
       */

      const netBalance =
        totalExpense -
        totalReceived;



      /*
       * Update summary
       */

      totalExpenseElement
        .textContent =
        formatMoney(
          totalExpense
        );


      totalReceivedElement
        .textContent =
        formatMoney(
          totalReceived
        );


      netExpenseElement
        .textContent =
        formatMoney(
          netBalance
        );

    }



    /*
     * Format money
     */

    function formatMoney(
      amount
    ) {

      return Number(
        amount
      ).toLocaleString(
        "en-IN"
      );

    }



    /*
     * Escape HTML
     */

    function escapeHTML(
      text
    ) {

      const div =
        document.createElement(
          "div"
        );


      div.textContent =
        String(text);


      return div.innerHTML;

    }



    /*
     * Clear all
     */

    clearAllButton.addEventListener(
      "click",
      function () {


        if (
          expenses.length === 0
        ) {

          return;

        }



        const confirmDelete =
          confirm(
            "Kya aap saare transactions delete karna chahte ho?"
          );



        if (
          !confirmDelete
        ) {

          return;

        }



        expenses = [];


        saveExpenses();


        renderExpenses();

      }
    );



    /*
     * Initial render
     */

    renderExpenses();

  }
);