import { Typography } from "@mui/material";
import { FC, ReactNode } from "react";
import { Link, LinkProps } from "react-router";

type StyledLinkProps = {
  to: LinkProps["to"];
  children: ReactNode;
};
export const StyledLink: FC<StyledLinkProps> = (props) => {
  const { to, children } = props;
  return (
    <Typography
      component={Link}
      to={to}
      color="textPrimary"
      sx={{
        "textDecoration": "none",
        "&:hover": { textDecorationLine: "underline" },
      }}
    >
      {children}
    </Typography>
  );
};
