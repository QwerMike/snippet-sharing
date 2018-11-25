import React, { Component } from "react";
import AceEditor from "react-ace";
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
      privateUid: "",
      publicUid: ""
    };

    this.setTheme = this.setTheme.bind(this);
    this.setMode = this.setMode.bind(this);
    this.onChange = this.onChange.bind(this);
    this.setFontSize = this.setFontSize.bind(this);
    this.setBoolean = this.setBoolean.bind(this);

    const id = this.props.match.params.id;
    if (id) {
      this.getSnippet(id);
    }
  }

  componentDidMount() {}

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

  async createSnippet() {
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
      this.setState({ privateUid: privateUid, publicLink: publicUid });
    }
  }

  generateUrls() {
    const { privateUid, publicUid } = this.state;
    const privateUrl = window.location.href.concat(`/snippet/${privateUid}`);
    const publicUrl = window.location.href.concat(`/snippet/${publicUid}`);
    return { privateURL: privateUrl, publicURL: publicUrl };
  }

  async getSnippet(id) {
    console.log(id);
    const response = await actions.getSnippetById(id);
    this.setState = {
      value: response.snippet.data,
      mode: response.snippet.type,
      title: response.snippet.title,
      author: response.snippet.author,
      readOnly: response.readOnly
    };
  }

  async deleteSnippet(id) {
    await actions.deleteSnippet(id);
    this.setState = {
      value: defaultValue,
      mode: "plain_text",
      title: "",
      author: "",
      readOnly: false,
      privateLink: "",
      publicLink: ""
    };
  }

  render() {
    return (
      <div className="columns">
        <div className="column">
          <div className="field">
            <label>Mode:</label>
            <p className="control">
              <span className="select">
                <select
                  name="mode"
                  onChange={this.setMode}
                  value={this.state.mode}
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </span>
            </p>
          </div>

          <div className="field">
            <label>Theme:</label>
            <p className="control">
              <span className="select">
                <select
                  name="Theme"
                  onChange={this.setTheme}
                  value={this.state.theme}
                >
                  {themes.map(lang => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </span>
            </p>
          </div>

          <div className="field">
            <label>Font Size:</label>
            <p className="control">
              <span className="select">
                <select
                  name="Font Size"
                  onChange={this.setFontSize}
                  value={this.state.fontSize}
                >
                  {[14, 16, 18, 20, 24, 28, 32, 40].map(lang => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </span>
            </p>
          </div>

          <div className="field">
            <p className="control">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={this.state.enableLiveAutocompletion}
                  onChange={e =>
                    this.setBoolean(
                      "enableLiveAutocompletion",
                      e.target.checked
                    )
                  }
                />
                Enable Live Autocomplete
              </label>
            </p>
          </div>

          <div className="field">
            <p className="control">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={this.state.enableSnippets}
                  onChange={e =>
                    this.setBoolean("enableSnippets", e.target.checked)
                  }
                />
                Enable Snippets
              </label>
            </p>
          </div>
        </div>

        <div className="examples column">
          <AceEditor
            mode={this.state.mode}
            theme={this.state.theme}
            onChange={this.onChange}
            value={this.state.value}
            fontSize={this.state.fontSize}
            showPrintMargin={this.state.showPrintMargin}
            showGutter={this.state.showGutter}
            highlightActiveLine={this.state.highlightActiveLine}
            readOnly={this.state.readOnly}
            setOptions={{
              enableBasicAutocompletion: this.state.enableBasicAutocompletion,
              enableLiveAutocompletion: this.state.enableLiveAutocompletion,
              enableSnippets: this.state.enableSnippets,
              showLineNumbers: this.state.showLineNumbers,
              tabSize: 2
            }}
          />
        </div>
      </div>
    );
  }
}

export default Editor;
