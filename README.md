# Savings Calculator App

This is a **React.js** web application that allows you to calculate earnings from compound interest in savings accounts.

More than one savings account can be created by the user, where each account calculates and displays its own results.

To add a new account, simply click the **Add Account** button.

Earnings are calculated based on an account's **initial amount**, its **annual percentage rate (APR)**, **monthly contributions** to the account and the **number of months** that passes.

Compounding interest is applied *monthly*. Monthly contributions are added after applying the interest rate.

For calculations to occur, you must input the **number of months**.

After inputting values into an account, the account displays your **new amount** after your period of time and the **amount your account earned from interest only** (excluding monthly contributions).

If using multiple accounts, a **grand total** for new amounts and interest earned will display. 

As this app uses the React framework, the UI will dynamically change after each change in input.

There is a field called **Goal Amount** that allows you to input an account balance greater than the initial amount. An additional calculation will then determine the number of months and years required to reach the goal amount.

## Instructions

To run the app, enter `npm start` on your command line. Then open [http://localhost:3000](http://localhost:3000) to view it in the browser.

By default, fields are left empty when first running the app.

## Additional Notes

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).