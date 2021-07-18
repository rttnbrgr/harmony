import * as React from "react";
import "../styles/ui.css";

declare function require(path: string): any;

class App extends React.Component {
  textbox: HTMLInputElement;

  countRef = (element: HTMLInputElement) => {
    if (element) element.value = "5";
    this.textbox = element;
  };

  onCreate = () => {
    const count = parseInt(this.textbox.value, 10);
    parent.postMessage(
      { pluginMessage: { type: "create-rectangles", count } },
      "*"
    );
  };

  onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  onCreateColorStyles = () => {
    parent.postMessage(
      { pluginMessage: { type: "CREATE_COLOR_STYLES", foo: "count" } },
      "*"
    );
  };

  render() {
    return (
      <div>
        <img src={require("../assets/logo.svg")} />
        <h2>Rectangle Creator</h2>
        <p>
          Count: <input ref={this.countRef} />
        </p>
        <button id="create" onClick={this.onCreate}>
          Create
        </button>
        <button onClick={this.onCreateColorStyles}>Layer Styles</button>
        <button onClick={this.onCancel}>Cancel</button>
      </div>
    );
  }
}

export default App;
