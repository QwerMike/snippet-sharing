import React, { Component } from "react";
import AceEditor from "react-ace";
import { Nav, Navbar, NavItem, Grid, Row, Col, DropdownButton, MenuItem } from "react-bootstrap"
import "brace/mode/jsx";
import "brace/ext/language_tools";
import "brace/ext/searchbox";

const languages = [
  "javascript",
  "java",
  "python",
  "xml",
  "ruby",
  "sass",
  "markdown",
  "mysql",
  "json",
  "html",
  "csharp",
  "typescript",
  "css"
];

const themes = [
  "monokai",
  "github",
  "tomorrow",
  "kuroir",
  "twilight",
  "xcode",
  "textmate",
  "solarized_dark",
  "solarized_light",
  "terminal"
];

languages.forEach(lang => {
  require(`brace/mode/${lang}`);
  require(`brace/snippets/${lang}`);
});

themes.forEach(theme => {
  require(`brace/theme/${theme}`);
});

const defaultValue = `Enter text here...`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: defaultValue,
      theme: "monokai",
      mode: "markdown",
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: false,
      fontSize: 14,
      showGutter: true,
      showPrintMargin: false,
      highlightActiveLine: true,
      enableSnippets: false,
      showLineNumbers: true
    };

    this.setTheme = this.setTheme.bind(this);
    this.setMode = this.setMode.bind(this);
    this.onChange = this.onChange.bind(this);
    this.setFontSize = this.setFontSize.bind(this);
    this.setBoolean = this.setBoolean.bind(this);
  }

  onChange(newValue) {
    this.setState({
      value: newValue
    });
  }

  setTheme(e) {
    this.setState({
      theme: e.target.value
    });
  }

  setMode(e) {
    this.setState({
      mode: e.target.value
    });
  }

  setBoolean(name, value) {
    this.setState({
      [name]: value
    });
  }

  setFontSize(e) {
    this.setState({
      fontSize: parseInt(e.target.value, 10)
    });
  }

  render() {
    return (
      <div>
        <Navigation />
        <Grid className={'content'}>
          <Row>
            <Col xs={12} md={9} >
              <AceEditor
                mode={this.state.mode}
                theme={this.state.theme}
                onChange={this.onChange}
                value={this.state.value}
                fontSize={this.state.fontSize}
                showPrintMargin={this.state.showPrintMargin}
                showGutter={this.state.showGutter}
                highlightActiveLine={this.state.highlightActiveLine}
                setOptions={{
                  enableBasicAutocompletion: this.state.enableBasicAutocompletion,
                  enableLiveAutocompletion: this.state.enableLiveAutocompletion,
                  enableSnippets: this.state.enableSnippets,
                  showLineNumbers: this.state.showLineNumbers,
                  tabSize: 2
                }}
              />
            </Col>
            <Col xs={12} md={3} >
              <div>
                <h2>Settings</h2>
              </div>
              <div className="field">
                <label>Language:</label>
                <p className="control">
                  <DropdownButton title={this.state.mode}>
                    <MenuItem
                      name="mode"
                      onChange={this.setMode}
                      value={this.state.mode}
                    >
                      {languages.map(lang => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </MenuItem>
                  </DropdownButton>
                </p>
              </div>

              <div className="field">
                <label>Theme:</label>
                <p className="control">
                  <DropdownButton title={this.state.theme}>
                    <MenuItem
                      name="theme"
                      onChange={this.setTheme}
                      value={this.state.theme}
                    >
                      {themes.map(lang => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </MenuItem>
                  </DropdownButton>
                </p>
              </div>

              <div className="field">
                <label>Font Size:</label>
                <p className="control">
                  <DropdownButton title={this.state.fontSize}>
                    <MenuItem
                      name="font"
                      onChange={this.setFontSize}
                      value={this.state.fontSize}
                    >
                      {[14, 16, 18, 20, 24, 28, 32, 40].map(lang => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </MenuItem>
                  </DropdownButton>
                </p>
              </div>

              <div className="field">
                <p className="control">
                  <span>
                    <label className="switch switch-pill switch-primary">
                      <input type="checkbox" className="switch-input"
                        checked={this.state.enableLiveAutocompletion}
                        onChange={e =>
                          this.setBoolean(
                            "enableLiveAutocompletion",
                            e.target.checked
                          )
                        }
                      />
                      <span className={'switch-slider'}></span>
                    </label>
                  </span>
                  <label className={'switch-label'}>Enable Live Autocomplete</label>
                </p>
              </div>

              <div className="field">
                <p className="control">
                  <span>
                    <label className="switch switch-pill switch-primary">
                      <input type="checkbox" className="switch-input"
                        checked={this.state.enableSnippets}
                        onChange={e =>
                          this.setBoolean("enableSnippets", e.target.checked)
                        }
                      />
                      <span className={'switch-slider'}></span>
                    </label>
                  </span>
                  <label className={'switch-label'}>Enable Snippets</label>
                </p>
              </div>
            </Col>
          </Row>
        </Grid>
        <div className="columns">
          <div className="examples column">

          </div>
        </div>
      </div >);
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
