import styled from "styled-components";

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    align-items: center;
    padding: 0.25rem 0;
    gap: 0.25rem;
  }

  .actions {
    gap: 1rem;
  }

  button {
    margin-top: 2rem;
  }
`;
