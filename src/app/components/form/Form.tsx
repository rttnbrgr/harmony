import React, { useCallback, useReducer } from "react";
import { FORM_FIELD_METADATA } from "./constants";
import { Actions } from "./types";
import { StyledForm } from "./styledComponents";
import { Button } from "../button/Button";

const initialState: { [key in Actions]: boolean } = {
  CREATE_COLOR_STYLES: true,
  CREATE_EFFECT_STYLES: true,
  CREATE_TEXT_STYLES: true,
};

function reducer(state, action) {
  return { ...state, [`${action.type}`]: !state[action.type] };
}

export function Form() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = useCallback(
    (event) => {
      console.log("event", event);
      event.preventDefault();
      const types = Object.keys(state).filter((key) => state[key]);
      parent.postMessage({ pluginMessage: { type: types, foo: "count" } }, "*");
    },
    [state]
  );

  const onCancel = useCallback(() => {
    parent.postMessage({ pluginMessage: { type: ["CANCEL"] } }, "*");
  }, []);

  return (
    <StyledForm onSubmit={handleSubmit}>
      {FORM_FIELD_METADATA.map(({ id, label }) => (
        <div key={id}>
          <input
            type="checkbox"
            name={id}
            id={id}
            checked={state[id]}
            onChange={(event) => dispatch({ type: id })}></input>
          <label htmlFor={id}>{label}</label>
        </div>
      ))}

      <div className="actions">
        <Button type="submit" variant="primary">
          Create
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
    </StyledForm>
  );
}
