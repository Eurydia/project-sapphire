import type { LinkProps } from "@mui/material";
import { Link } from "@mui/material";
import type { LinkComponent } from "@tanstack/react-router";
import { createLink } from "@tanstack/react-router";
import { forwardRef } from "react";

const MUILinkComponent = forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => <Link ref={ref} {...props} />,
);

const LinkComponent = createLink(MUILinkComponent);

export const StyledLink: LinkComponent<typeof MUILinkComponent> = (props) => {
  return <LinkComponent preload={"intent"} {...props} />;
};
