import * as React from "react";
import { StyledButton } from "./styledComponents";

export function Button({
  variant,
  type = "button",
  children,
  ...rest
}: React.HTMLAttributes<HTMLButtonElement> & {
  variant?: "primary";
  children: string;
  type?: "submit" | "button";
}) {
  return (
    <StyledButton type={type} variant={variant} {...rest}>
      {children}
    </StyledButton>
  );
}
