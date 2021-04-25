import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
Calculates new amount for a savings account.
  parameters:
    * initAmt: initial amount of a savings account
    * apr: annual percentage rate
    * months: number of months that passes for interest to build
    * mContri: monthly contributions to account
  returns: newAmt
*/
function calculateNewAmount(initAmt, apr, months, mContri) {
  // Convert initAmt and mContri from dollars to cents to avoid loss of precison while calculating
  // Also serves to correct input values that contain more than 2 decimal places
  let newAmt = Math.round(initAmt * 100);
  mContri = Math.round(mContri * 100);

  // Monthly interest rate applied to account
  let mRate = 1 + (apr / 1200);

  // For each month that passes, interest rate is applied and then mContri is added to newAmt
  for (let i = 0; i < months; i++) {
    newAmt *= mRate;
    newAmt += mContri;
  }

  // Before returning, newAmt is rounded to remove decimal places.
  // Then the value is converted from cents to dollars.
  return Math.round(newAmt) / 100;
}

// React component that performs calculations and then displays calculated values.
function Amounts(props) {
  // New amount for savings account is calculated.
  const newAmt = calculateNewAmount(props.initAmt, props.apr, props.months, props.mContri);

  // The total monthly contributions are calculated too. Also converted from dollars to cents.
  // Used for next calculation.
  const totmContri = Math.round(props.mContri * props.months * 100);

  /*
  The amount of money earned exclusively through compound interest. Calculated through the following steps:
    1) Convert newAmt and initAmt from dollars to cents
    2) Subtract initAmt from newAmt
    3) Subtract totContri from newAmt
    4) Convert value from cents to dollars
  */
  const earned = ((newAmt * 100 - Math.round(props.initAmt * 100)) - totmContri) / 100;

  // Rendered component
  return (
    <div>
      <p>New amount after {props.months} months: <b>${newAmt.toFixed(2)}</b> </p>
      <p>Interest earned: <b>${earned.toFixed(2)}</b> </p>
    </div>
  );
}

/*
Determines the number of months required to reach a goal amount for a savings account.
  parameters:
    * initAmt: initial amount of a savings account
    * goalAmt: amount user wishes to reach in savings account
    * apr: annual percentage rate
    * mContri: monthly contributions to account
  returns: goalM
*/
function calculateMonthsToReachGoal(initAmt, goalAmt, apr, mContri) {
  // Returned value
  let goalM = 0;

  /*
  The following conditions must be met in order to calculate goalM:
    * goalAmt is not null
    * goalAmt is greater than initAmt
    * initAmt AND apr are both not null, OR mContri is not null
  These conditions prevent the function from entering an infinite loop because newAmt is not growing.
  */
  if (((initAmt && apr) || mContri) && goalAmt && goalAmt > initAmt) {
    // Convert initAmt, goalAmt and mContri from dollars to cents to avoid loss of precison while calculating
    // Also serves to correct input values that contain more than 2 decimal places
    let newAmt = Math.round(initAmt * 100);
    mContri = Math.round(mContri * 100);
    goalAmt = Math.round(goalAmt * 100);

    // Monthly interest rate applied to account
    let mRate = 1 + (apr / 1200);

    // Pre-condition: newAmt < goalAmt
    // Post-condition: newAmt >= goalAmt
    // For each loop iteration, goalM increments by 1 month.
    // When the post-condition is met, the final goalM value is our answer.
    while (newAmt < goalAmt) {
      newAmt *= mRate;
      newAmt += mContri;
      goalM++;
    }
  }
  
  return goalM;
}

// React component that displays the number of months and years required to reach a goal amount for a savings account.
function Goal(props) {
  // Number of months to reach goal is calculated.
  // If no goal amount is inputted or goal amount is less than the initial amount, the function returns 0.
  const months = calculateMonthsToReachGoal(props.initAmt, props.goalAmt, props.apr, props.mContri);

  // If no value is calculated, Goal component is not rendered.
  if (months === 0) {
    return null;
  }

  return (
    <div>
      <p>Time required to reach goal amount: <b>{months} months</b> <b>({(months / 12).toFixed(2)} years)</b></p>
    </div>
  );
}

// React component representing a savings account. Accepts user input and renders calculations.
class Account extends React.Component {

  /*
  Account component renders input fields, Amounts component and Goal component.
  Each input field has its corresponding state passed into it as part of props.
  handleInputChange() is also passed into each input field to respond to input changes.
  Minimum values are set to 0 for each input field.
  For Amounts and Goals components, arguments required for calculations are passed from Account state as props.
  */
  render() {
    return (
      <div class="account" id={this.props.accID}>
        <label>
          Initial Amount ($):
          <input
            type="number"
            name="initAmt"
            value={this.props.initAmt}
            onChange={this.props.handleInputChange}
            min="0" />
        </label>
        <br />
        <label>
          APR (Annual Percentage Rate, %):
          <input
            type="number"
            name="apr"
            value={this.props.apr}
            onChange={this.props.handleInputChange}
            min="0" />
        </label>
        <br />
        <label>
          Interest Period (months):
          <input
            type="number"
            name="months"
            value={this.props.months}
            onChange={this.props.handleInputChange}
            min="0" />
        </label>
        <br />
        <label>
          Monthly Contribution ($): 
          <input
            type="number"
            name="mContri"
            value={this.props.mContri}
            onChange={this.props.handleInputChange}
            min="0" />
        </label>
        <br />
        <label>
          Goal Amount ($):
          <input
            type="number"
            name="goalAmt"
            value={this.props.goalAmt}
            onChange={this.props.handleInputChange}
            min="0" />
        </label>
        <Amounts 
          initAmt={this.props.initAmt}
          apr={this.props.apr}
          months={this.props.months}
          mContri={this.props.mContri} />
        <Goal 
          initAmt={this.props.initAmt}
          apr={this.props.apr}
          mContri={this.props.mContri}
          goalAmt={this.props.goalAmt} />
      </div>
    );
  }
}

// React component that renders app title, credits and all Account components belonging to user.
// States live in App component
class App extends React.Component {
  constructor(props) {
    super(props);

    // State contains array of all user accounts. Each entry is used to render its own Account component.
    this.state = {
      accounts: [createAccount()],
    };

    // Binds addAccount() and handleInputChange() to `this` keyword
    this.addAccount = this.addAccount.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  // Adds new account when user clicks "Add Account" button.
  addAccount() {
    // Makes array copy of current accounts in App's state
    const accounts = this.state.accounts;

    // Create updated accounts array by concatenating new account to accounts copy.
    const updatedAccounts = accounts.concat([createAccount()]);

    // Set App account state to updatedAccounts.
    this.setState({accounts: updatedAccounts});
  }

  /*
  Updates state each time input changes.
  Applicable to all values of an account entry.
  Passed into each input element as onChange property.
  */
  handleInputChange(e) {
    // Grab input's name, value and id of its parent div element
    const name = e.target.name;
    const value = e.target.value;
    const id = e.target.closest('div').id;

    // Get copy of state's accounts array
    let accounts = this.state.accounts;

    // Modify object's value in array using id as index and name as property
    accounts[id][name] = value;

    // Set state's account array to modified copy array.
    this.setState({accounts: accounts});
  }

  render() {
    /*
    JSX object containing one or more accounts is created by applying mapping onto accounts in App state.
    For each account acc in accounts state:
      * Account component is created
      * component's key is index of acc (i)
      * values of acc are passed into Account component as props
      * handleInputChange is passed as prop
    */
    let accounts = this.state.accounts.map((acc, i) => {
      return (
          <Account 
            key={i}
            accID={i}
            initAmt={acc.initAmt}
            apr={acc.apr}
            mContri={acc.mContri}
            months={acc.months}
            goalAmt={acc.goalAmt}
            handleInputChange={this.handleInputChange} />
      );
    });

    // Renders title, credits, JSX object accounts and button that adds a new Account component.
    return (
      <div>
        <h1 id="title">Savings Calculator</h1>
        <h3 id="credit">Created by Jacob Wharrie</h3>
        <div class="accContainer">
          {accounts}
        </div>
        <button id="addAccBtn" onClick={this.addAccount}>Add Account</button>
      </div>
    );
  }
}

// Creates a new account when "Add Account" button is pressed.
function createAccount() {
  // Each state is initialized as null to leave input fields blank.
  return {
    initAmt: null,
    apr: null,
    mContri: null,
    months: null,
    goalAmt: null,
  };
}

// Rendering of App component occurs here.
ReactDOM.render(
    <App />,
  document.getElementById('root')
);