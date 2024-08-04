"use client";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SignedIn, UserButton, SignedOut, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const MobileNav = () => {
  const { isLoaded } = useAuth();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set to true after first render to ensure client-side rendering
    setIsClient(true);
  }, []);

  // Show loading or placeholder while auth is not loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <header className="header">
      <Link href="/" className="flex items-center gap-2 md:py-2">
        <Image
          className="w-[180px] h-auto"
          src={"/assets/cutom-imgs/logo-new.png"}
          alt="logo"
          width={180}
          height={28}
        />
      </Link>
      <nav className="flex gap-2">
        {isClient && (
          <>
            <SignedIn>
              <UserButton afterSignOutUrl="/sign-in" />
              <Sheet>
                <SheetTrigger>
                  <Image
                    src={"/assets/icons/menu.svg"}
                    alt="menu"
                    width={32}
                    height={32}
                    className="cursor-pointer"
                  />
                </SheetTrigger>
                <SheetContent className="sheet-content sm:w-64 overflow-y-scroll">
                  <>
                    <Image
                      className="w-[152px] h-auto"
                      src={"/assets/cutom-imgs/logo-new.png"}
                      alt="logo"
                      width={152}
                      height={23}
                    />

                    <ul className="header-nav_elements">
                      {navLinks.map((link) => {
                        const isActive = link.route === pathname;
                        return (
                          <li
                            key={link.route}
                            className={`${
                              isActive && "gradient-text"
                            } p-18 flex whitespace-nowrap text-dark-700`}
                          >
                            <Link
                              className="sidebar-link cursor-pointer"
                              href={link.route}
                            >
                              <Image
                                src={link.icon}
                                alt={link.route}
                                width={24}
                                height={24}
                              />
                              {link.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                </SheetContent>
              </Sheet>
            </SignedIn>
            <SignedOut>
              <Button asChild className="button bg-purple-gradient bg-cover">
                <Link href="/sign-in">Login</Link>
              </Button>
            </SignedOut>
          </>
        )}
      </nav>
    </header>
  );
};

export default MobileNav;
