import * as React from "react";
import { Form } from "./form/Form";
import { GlobalStyle } from "./Global";

declare function require(path: string): any;

class App extends React.Component {
  render() {
    return (
      <div>
        <GlobalStyle />
        <img src={require("../assets/logo.svg").default} />
        <h2>Style Docs</h2>
        <Form />
      </div>
    );
  }
}

export default App;
