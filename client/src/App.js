import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navigation from './components/Navigation';
import Editor from './components/Editor';
import About from './components/About';
import Wooops from './components/Wooops';
import "brace/mode/jsx";
import "brace/ext/language_tools";
import "brace/ext/searchbox";
import ReactAI from 'react-appinsights';
import createHistory from 'history/createBrowserHistory'

const history = createHistory()
ReactAI.init({instrumentationKey:'17d57d05-6b83-4ed6-a422-25567f1ce658'}, history);

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navigation />
          <div className="main">
          <Switch>
            <Route exact path="/" component={Editor} />
            <Route path="/snippet/:id" component={Editor} />
            <Route path="/about" component={About} />
            <Route path="/*" component={Wooops} />
          </Switch>
          </div>
          <footer>
            <nav>
              <ul />
            </nav>
            <div>© 2018 SnippetShare.org</div>
          </footer>
        </div>
      </Router>
    );
  }
}

export default ReactAI.withTracking(App);
