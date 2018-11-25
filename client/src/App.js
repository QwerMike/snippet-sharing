import React from "react";
import "./App.css";
import { Button } from 'react-bootstrap';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: null,
      isEnabled: false};
  }

  handleChange() {
    this.setState({isEnabled: !this.state.isEnabled})
  }

  render() {
    return (
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
    );
  }
}

export default App;
