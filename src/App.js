import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { PortfolioProvider } from './context/PortfolioContext';
import Portfolio from './portfolio/Portfolio';
import AdminLogin from './admin/AdminLogin';
import AdminPanel from './admin/AdminPanel';
import './App.css';

function App() {
  return (
    <PortfolioProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Portfolio} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin" component={AdminPanel} />
        </Switch>
      </Router>
    </PortfolioProvider>
  );
}

export default App;
