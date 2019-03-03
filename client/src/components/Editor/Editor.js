import React from "react";
import AceEditor from "react-ace";
import {
  Button,
  ButtonGroup,
  Grid,
  Row,
  Col,
  Glyphicon,
  ButtonToolbar
} from "react-bootstrap";

import Settings from './Settings';
import Preferences from './Preferences';
import Links from '../Links'
import * as actions from "../../apiQueries";

const defaultValue = `Enter text here...`;

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      readOnly: props.readOnly || false,
      value: defaultValue,
      settings: new Preferences(),
      currentId: this.props.match.params.id || null,
      show: false
    };
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id) {
      this.loadSnippet(id);
    }
    else {
      this.setState({
        value: defaultValue,
        readOnly: false
      });
    }
  }

  setSettings = (name, value) => {
    this.setState({
      settings: { ...this.state.settings, [name]: value }
    });
  }

  onChange = (newValue) => {
    this.setState({
      value: newValue
    });
  }

  hideModal= () => {
    this.setState({ show: false });
  }

  generateUrl(Uid) {
    const url = window.location.host.concat(`/snippet/${Uid}`);
    return url;
  }

  async createSnippet() {
    if (!this.state.currentId) {
      const { value, settings, author, title } = this.state;
      const createdSnippet = {
        data: value,
        type: settings.mode,
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
      }
    }

    this.setState({
      privateUid: this.state.privateUid,
      publicLink: this.state.publicLink,
      show: true
    })
  }

  async loadSnippet(id) {
    const response = await actions.getSnippetById(id);
    this.setState({
      value: response.snippet.data,
      settings: { ...this.state.settings, mode: response.snippet.type },
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
        settings: { ...this.state.settings, mode: "plain_text" },
        title: "",
        author: "",
        readOnly: false,
        privateUid: null,
        publicUid: null
      });
      this.props.history.push('/');

    }
  }

  async updateSnippet(id) {
    const { value, settings, author, title } = this.state;
    const createdSnippet = {
      data: value,
      type: settings.mode,
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
                  <Button onClick={() => this.deleteSnippet(this.state.currentId)} bsStyle="danger">
                    <Glyphicon
                      glyph="glyphicon glyphicon-remove"
                    />
                  </Button>
                </ButtonGroup>
              </ButtonToolbar>
              <AceEditor
                readOnly={this.state.readOnly}
                onChange={this.onChange}
                value={this.state.value}
                mode={this.state.settings.mode}
                theme={this.state.settings.theme}
                fontSize={this.state.settings.fontSize}
                showPrintMargin={this.state.settings.showPrintMargin}
                showGutter={this.state.settings.showGutter}
                highlightActiveLine={this.state.settings.highlightActiveLine}
                setOptions={{
                  enableBasicAutocompletion: this.state.settings.enableBasicAutocompletion,
                  enableLiveAutocompletion: this.state.settings.enableLiveAutocompletion,
                  enableSnippets: this.state.settings.enableSnippets,
                  showLineNumbers: this.state.settings.showLineNumbers,
                  tabSize: 2
                }}
              />
            </Col>
            <Col xs={12} md={3}>
              <Settings
                readOnly={this.state.readOnly}
                settings={this.state.settings}
                setSettings={this.setSettings} 
              />
            </Col>
          </Row>
        </Grid>
        <Links 
        show={this.state.show}
        privateLink={this.generateUrl(this.state.privateUid)}
        publicLink={this.generateUrl(this.state.publicLink)}
        hide={this.hideModal}
         />
        {/* <Modal
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
        </Modal> */}
      </div>
    );
  }
}

export default Editor;
