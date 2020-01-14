import React from 'react';
import StockForm from './Components/StockForm'
import Price from './Components/Price'
import Graph from './Components/Graph'
import NewsContainer from './Components/NewsContainer'
import Prediction from './Components/Prediction'
import CompanyDetails from './Components/CompanyDetails'
import Register from './Components/Register'
import LoginForm from './Components/LoginForm'
import {
  BrowserRouter as Router,
  Route,
  Link,
} from "react-router-dom";
import './styles/App.css';
import './styles/CompanyDetails.css';
import './styles/Chart.css';
import './styles/NewsContainer.css';
import './styles/Price.css';
import './styles/StockForm.css';


class App extends React.Component {
  constructor(props) {
    super(props)
    this.handleSymbolChange = this.handleSymbolChange.bind(this);
    this.state = { symbol: "TSLA" }
  }

  handleSymbolChange(newSymbol) {
    this.setState({symbol: newSymbol})
  }

  authenticate = (res) => {
    console.log(res)
    sessionStorage.setItem("userId", res.user.id)
    sessionStorage.setItem("sessiondId", res.sessionId)
    sessionStorage.setItem("username", res.user.username)
    sessionStorage.setItem("token", res.token)
    sessionStorage.setItem("isAuthenticated,", true)
    console.log(sessionStorage)
    this.setState({isRejected : false})
    this.setState({message : "Login"})
    this.setState({didLogin : true})
  }

  signupLink = () => {
    let isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if(isAuthenticated != true) {
      return(
        <Link to="/register/">SignUp</Link>
      )
    }
  }

  loginLink = () => {
    let isAuthenticated = sessionStorage.getItem("isAuthenticated") // use JWT instead?
    if(isAuthenticated != true) {
      return(
        <Link to="/login/">Login</Link>
      )
    }
  }

  logoutLink = () => {
    let isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if(isAuthenticated) {
      return(
        <Link onClick={this.handleLogout}>Log Out</Link>
      )
    }
  }

  appendFailMessage = (event) => {
    if (this.state.isRejected && !this.state.diLogin) {
      return(
        <h1>Sign Up/ Login Failed</h1>
      )
    }
  }

  appendSuccessMessage = (event) => {
    if (this.state.didLogin && !this.state.isRejected) {
      return(
        <h1>{event} Succesful!</h1>
      )
    } else {
      return
    }
  }

  reject = (res) => {
    this.setState({isRejected : true})
    this.setState({didLogin : false})
    console.log(res)
  }

  render () {
    return (
      <div className="app-container">
        { this.appendFailMessage(this.state.message) }
        { this.appendSuccessMessage(this.state.message) }
        
        <h1>Welcome To CashCow</h1>
        <Router>
          { this.signupLink() }
          { this.loginLink() }

          <Link to="/app">Main</Link>
          <Route path="/register" component={() => 
            <Register 
              authenticate={this.authenticate} 
              reject={this.reject}
            />}>
          </Route> 

          <Route path='/login'>
            <LoginForm authenticate={this.authenticate} reject={this.reject}/>
          </Route>
          
          <Route path="/app">
            <div>
              < StockForm
                symbol={this.state.symbol}
                onSymbolChange={this.handleSymbolChange} />
            </div>
            <div className="main-container flex-item">
              <div className="price-details-container">
                <Price symbol={this.state.symbol}/>
                <CompanyDetails symbol={this.state.symbol}/>
              </div>
              <div className="news flex-item"><NewsContainer symbol={this.state.symbol}/></div>
              <div className="graph flex-item"><Graph symbol={this.state.symbol}/></div>
              <div className="prediction-container flex-item"><Prediction symbol={this.state.symbol}/></div>
            </div>
          </Route>
        </Router>
        
      </div>
    );
  }
}

export default App;
