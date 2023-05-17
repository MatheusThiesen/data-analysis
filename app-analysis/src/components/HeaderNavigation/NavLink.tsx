import {
  Link as CharkraLink,
  LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";
import { ActiveLink } from "./ActiveLink";

interface NavLinkProps extends ChakraLinkProps {
  children: string;
  href: string;
}

export function NavLink({ href, children, ...rest }: NavLinkProps) {
  return (
    <ActiveLink href={href}>
      <CharkraLink
        h="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        fontSize="large"
        _hover={{ textDecoration: "none" }}
        {...(rest as any)}
      >
        {children}
      </CharkraLink>
    </ActiveLink>
  );
}
