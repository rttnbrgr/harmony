import * as React from "react";
import "../styles/ui.css";

declare function require(path: string): any;

class App extends React.Component {
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
        <img src={require("../assets/logo.svg").default} />
        <h2>Style Docs</h2>
        <button onClick={this.onCreateColorStyles} className="primary">
          Layer Styles
        </button>
        <button onClick={this.onCancel}>Cancel</button>
      </div>
    );
  }
}

export default App;
