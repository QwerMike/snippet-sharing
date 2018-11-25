import React, { Component } from "react";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { Link } from "react-router-dom";

class Navigation extends Component {
    render() {
      return (
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">
              <span>
                <img src='./snippets-hero-icon.png' alt='snippet share logo' width='30px' height='30px'/>
              </span>
                Snippet Share
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} href="/about">
                About
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      )
    }
  }

  export default Navigation;