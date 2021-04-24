import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calculateNewAmount(initAmt, apr, months, mContri) {
  let newAmt = Math.round(initAmt * 100);
  mContri = Math.round(mContri * 100);
  let mRate = 1 + (apr / 1200);
  for (let i = 0; i < months; i++) {
    newAmt *= mRate;
    newAmt += mContri;
  }
  return Math.round(newAmt) / 100;
}


function Amounts(props) {
  const newAmt = calculateNewAmount(props.initAmt, props.apr, props.months, props.mContri);
  const totmContri = Math.round(props.mContri * props.months * 100);
  const earned = ((newAmt * 100 - Math.round(props.initAmt * 100)) - totmContri) / 100;
  return (
    <div>
      <p>New amount after {props.months} months: <b>${newAmt.toFixed(2)}</b> </p>
      <p>Interest earned: <b>${earned.toFixed(2)}</b> </p>
    </div>
  );
}

function calculateMonthsToReachGoal(initAmt, goalAmt, apr, mContri) {
  let goalM = 0;
  if (((initAmt && apr) || mContri) && goalAmt && goalAmt > initAmt) {
    let newAmt = Math.round(initAmt * 100);
    mContri = Math.round(mContri * 100);
    goalAmt = Math.round(goalAmt * 100);
    let mRate = 1 + (apr / 1200);
    while (newAmt < goalAmt) {
      newAmt *= mRate;
      newAmt += mContri;
      goalM++;
    }
  }
  
  return goalM;
}

function Goal(props) {
  const months = calculateMonthsToReachGoal(props.initAmt, props.goalAmt, props.apr, props.mContri)
  if (months === 0) {
    return null;
  }
  return (
    <div>
      <p>Time required to reach goal amount: <b>{months} months</b> <b>({(months / 12).toFixed(2)} years)</b></p>
    </div>
  );
}

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initAmt: null,
      apr: null,
      mContri: null,
      months: null,
      goalAmt: null,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({[name]: value});
  }

  render() {
    return (
      <div class="account">
        <label>
          Initial Amount ($):
          <input
            type="number"
            name="initAmt"
            value={this.state.initAmt}
            onChange={this.handleInputChange}
            min="0" />
        </label>
        <br />
        <label>
          APR (Annual Percentage Rate, %):
          <input
            type="number"
            name="apr"
            value={this.state.apr}
            onChange={this.handleInputChange}
            min="0" />
        </label>
        <br />
        <label>
          Interest Period (months):
          <input
            type="number"
            name="months"
            value={this.state.months}
            onChange={this.handleInputChange}
            min="0" />
        </label>
        <br />
        <label>
          Monthly Contribution ($): 
          <input
            type="number"
            name="mContri"
            value={this.state.mContri}
            onChange={this.handleInputChange}
            min="0" />
        </label>
        <br />
        <label>
          Goal Amount ($):
          <input
            type="number"
            name="goalAmt"
            value={this.state.goalAmt}
            onChange={this.handleInputChange}
            min="0" />
        </label>
        <Amounts 
          initAmt={this.state.initAmt}
          apr={this.state.apr}
          months={this.state.months}
          mContri={this.state.mContri} />
        <Goal 
          initAmt={this.state.initAmt}
          apr={this.state.apr}
          mContri={this.state.mContri}
          goalAmt={this.state.goalAmt} />
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <h1 id="title">Savings Calculator</h1>
        <h3 id="credit">Created by Jacob Wharrie</h3>
        <Account />
      </div>
    );
  }
}

ReactDOM.render(
    <App />,
  document.getElementById('root')
);