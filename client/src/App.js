import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navigation from "./components/Navigation";
import Editor from "./components/Editor";
import "brace/mode/jsx";
import "brace/ext/language_tools";
import "brace/ext/searchbox";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navigation />
          <div>
            <Switch>
              <Route exact path="/" component={Editor} />
              <Route path="/snippet/:id" component={Editor} />
              <Route render={() => <h1>404 Error</h1>} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
