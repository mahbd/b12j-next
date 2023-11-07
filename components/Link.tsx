import React from "react";
import NextLink from "next/link";

interface Props {
  href: string;
  children: string;
}

const Link = ({ href, children }: Props) => {
  return (
    <NextLink href={href} passHref legacyBehavior>
      <a className="link-secondary">{children}</a>
    </NextLink>
  );
};

export default Link;
