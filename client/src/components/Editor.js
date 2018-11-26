import React, { Component } from "react";
import AceEditor from "react-ace";
import {
  Button,
  ButtonGroup,
  Grid,
  Row,
  Col,
  DropdownButton,
  MenuItem,
  Glyphicon,
  ButtonToolbar,
  Modal
} from "react-bootstrap";
import * as actions from "../apiQueries/queries";

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
  "css",
  "plain_text"
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

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      readOnly: props.readOnly || false,
      value: defaultValue,
      theme: "monokai",
      mode: "plain_text",
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: false,
      fontSize: 14,
      showGutter: true,
      showPrintMargin: false,
      highlightActiveLine: true,
      enableSnippets: false,
      showLineNumbers: true,
      currentId: this.props.match.params.id ? this.props.match.params.id : null,
      show: false
    };

    this.setTheme = this.setTheme.bind(this);
    this.setMode = this.setMode.bind(this);
    this.onChange = this.onChange.bind(this);
    this.setFontSize = this.setFontSize.bind(this);
    this.setBoolean = this.setBoolean.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id) {
      this.getSnippet(id);
    }
  }

  setMode(e) {
    this.setState({
      mode: e
    });
  }

  onChange(newValue) {
    this.setState({
      value: newValue
    });
  }

  setTheme(e) {
    this.setState({
      theme: e
    });
  }

  setBoolean(name, value) {
    this.setState({
      [name]: value
    });
  }

  setFontSize(e) {
    this.setState({
      fontSize: parseInt(e, 10)
    });
  }

  async createSnippet() {
      
      if(!this.state.currentId)
    {
        const { value, mode, author, title } = this.state;
    const createdSnippet = {
      data: value,
      type: mode,
      title: title,
      author: author
    };
    const response = await actions.createSnippet(createdSnippet);
    if (response) {
      const privateUid = response.privateUid;
      const publicUid = response.publicUid;
      this.setState({
        privateUid: privateUid,
        publicLink: publicUid,
        currentId: privateUid ? privateUid : publicUid,
      });
    }}
      this.setState({
        privateUid: this.state.privateUid,
        publicLink: this.state.publicLink,
        show: true
    })
  }

  handleHide() {
    this.setState({ show: false });
  }

  generateUrl(Uid) {
    const url = window.location.host.concat(`/snippet/${Uid}`);
    return url;
  }

  async getSnippet(id) {
    const response = await actions.getSnippetById(id);
    this.setState({
      value: response.snippet.data,
      mode: response.snippet.type,
      title: response.snippet.title,
      author: response.snippet.author,
      readOnly: response.readonly,
      privateUid: response.readonly ? undefined : id,
      publicLink: response.snippet.publicUid,
      currentId: id
    });
  }

  async deleteSnippet(id) {
    if (!this.state.readOnly) {
      await actions.deleteSnippet(id);
      this.setState({
        value: defaultValue,
        mode: "plain_text",
        title: "",
        author: "",
        readOnly: false,
        privateUid: null,
        publicUid: null
      });
    }
  }

  async updateSnippet(id) {
    const { value, mode, author, title } = this.state;
    const createdSnippet = {
      data: value,
      type: mode,
      title: title,
      author: author
    };
    await actions.updateSnippet(id, createdSnippet);
  }

  render() {
    return (
        <div>
      <Grid className={"content"}>
        <Row>
          <Col xs={12} md={9}>
            <ButtonToolbar hidden={this.state.readOnly}>
              <ButtonGroup bsSize="small" className="actionBtns pull-right">
                <Button onClick={() => this.createSnippet()} bsStyle="info">
                  <Glyphicon glyph="glyphicon glyphicon-share-alt" />
                </Button>
                <Button
                  onClick={() => this.updateSnippet(this.state.currentId)}
                  bsStyle="primary"
                >
                  <Glyphicon glyph="glyphicon glyphicon-floppy-disk" />
                </Button>
                <Button bsStyle="danger">
                  <Glyphicon
                    onClick={() => this.deleteSnippet(this.state.currentId)}
                    glyph="glyphicon glyphicon-remove"
                  />
                </Button>
              </ButtonGroup>
            </ButtonToolbar>
            <AceEditor
              readOnly={this.state.readOnly}
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
          <Col xs={12} md={3}>
            <div>
              <h2>Settings</h2>
            </div>
            <div className="field">
              <label>Language:</label>
              <div className="control">
                <DropdownButton
                  id="lanuage"
                  title={this.state.mode}
                  onSelect={this.setMode}
                >
                  {languages.map(lang => (
                    <MenuItem eventKey={lang} key={lang} value={lang}>
                      {lang}
                    </MenuItem>
                  ))}
                </DropdownButton>
              </div>
            </div>

            <div className="field">
              <label>Theme:</label>
              <div className="control">
                <DropdownButton
                  id="theme"
                  title={this.state.theme}
                  onSelect={this.setTheme}
                >
                  {themes.map(theme => (
                    <MenuItem eventKey={theme} key={theme} value={theme}>
                      {theme}
                    </MenuItem>
                  ))}
                </DropdownButton>
              </div>
            </div>

            <div className="field">
              <label>Font Size:</label>
              <div className="control">
                <DropdownButton
                  id="fontSize"
                  title={this.state.fontSize}
                  onSelect={this.setFontSize}
                >
                  {[14, 16, 18, 20, 24, 28, 32, 40].map(font => (
                    <MenuItem eventKey={font} key={font} value={font}>
                      {font}
                    </MenuItem>
                  ))}
                </DropdownButton>
              </div>
            </div>

            <div className="field">
              <div className="control">
                <span>
                  <label className="switch switch-pill switch-primary">
                    <input
                    disabled = {this.state.readOnly}
                      type="checkbox"
                      className="switch-input"
                      checked={this.state.enableLiveAutocompletion}
                      onChange={e =>
                        this.setBoolean(
                          "enableLiveAutocompletion",
                          e.target.checked
                        )
                      }
                    />
                    <span className={"switch-slider"} />
                  </label>
                </span>
                <label className={"switch-label"}>
                  Enable Live Autocomplete
                </label>
              </div>
            </div>

            <div className="field">
              <div className="control">
                <span>
                  <label className="switch switch-pill switch-primary">
                    <input
                    disabled = {this.state.readOnly}
                      type="checkbox"
                      className="switch-input"
                      checked={this.state.enableSnippets}
                      onChange={e =>
                        this.setBoolean("enableSnippets", e.target.checked)
                      }
                    />
                    <span className={"switch-slider"} />
                  </label>
                </span>
                <label className={"switch-label"}>Enable Snippets</label>
              </div>
            </div>
          </Col>
        </Row>
      </Grid>
      <Modal
          show={this.state.show}
          onHide={() => this.handleHide()}
          container={this}
          aria-labelledby="contained-modal-title"
          className="modal"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">
              Enjoy your links
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>
                Editable Link: 
            </h4>
            <p>{this.generateUrl(this.state.privateUid)}</p>
            <h4>
                Read-only Link: 
            </h4>
            <p>{this.generateUrl(this.state.publicLink)}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.handleHide()}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Editor;
