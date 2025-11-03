"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Link
} from "@nextui-org/react";
import ThemeToggle from "@/components/theme-toggle";

export default function AppNavbar() {
  return (
    <Navbar maxWidth="full" height="4.5rem" className="bg-background/80 backdrop-blur border-b border-divider">
      <NavbarBrand className="gap-2">
        <Button isIconOnly radius="full" className="bg-secondary/30" aria-label="Animal Sounds Home">
          <span role="img" aria-hidden="true">
            🐾
          </span>
        </Button>
        <div className="flex flex-col">
          <span className="text-small font-medium text-default-600">Animal Sounds</span>
          <span className="text-tiny text-default-400">Immersive wildlife soundboard</span>
        </div>
      </NavbarBrand>

      <NavbarContent justify="end" className="items-center gap-4">
        <NavbarItem className="hidden sm:flex">
          <Link href="#collection" color="foreground" className="text-sm font-medium">
            Collection
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden sm:flex">
          <Link href="#about" color="foreground" className="text-sm font-medium">
            About
          </Link>
        </NavbarItem>
        <NavbarItem>
          <ThemeToggle />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
