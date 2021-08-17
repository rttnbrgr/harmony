import * as React from "react";
import { GlobalStyle } from "./Global";

declare function require(path: string): any;

class App extends React.Component {
  render() {
    return (
      <div>
        <GlobalStyle />
        <img src={require("../assets/logo.svg").default} />
        <h2>New Plugin</h2>
      </div>
    );
  }
}

export default App;
