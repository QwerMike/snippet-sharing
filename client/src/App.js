import React from "react";
import "./App.css";
import { Button } from 'react-bootstrap';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: null,
      isEnabled: false
    };
  }

  handleChange() {
    this.setState({ isEnabled: !this.state.isEnabled })
  }

  render() {
    return (
      <div>
        <Navigation/>
        <div>
          <textarea
            rows={15}
            readOnly={this.state.isEnabled ? false : true}
          >
            {"html with multiple code snippets"}
          </textarea>
          <Button onClick={() => this.handleChange()}>
          </Button>
        </div>
      </div>
    );
  }
}

export default App;

function Navigation(props) {
  return (
  <Navbar inverse collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#brand">
          Snippet Share
        </a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <NavItem eventKey={1} href="#">
          About
      </NavItem>
      </Nav>
    </Navbar.Collapse>
  </Navbar>)
}
