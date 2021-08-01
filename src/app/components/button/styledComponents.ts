import styled, { css } from "styled-components";

const primary = css`
  box-shadow: none;
  background: #18a0fb;
  color: white;
`;

export const StyledButton = styled.button<{ variant?: "primary" | "secondary"; type: any }>`
  border-radius: 5px;
  background: white;
  color: black;
  border: none;
  padding: 8px 15px;
  margin: 0 5px;
  box-shadow: inset 0 0 0 1px black;
  outline: none;

  &:focus {
    box-shadow: inset 0 0 0 2px #18a0fb;
  }

  ${({ variant }) => (variant === "primary" ? primary : css``)}
`;
