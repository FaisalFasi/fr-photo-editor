"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { usePathname } from "next/navigation";
import { navLinks } from "@/constants";
import { Button } from "../ui/button";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="flex size-full flex-col gap-4">
        {/* logo */}
        <Link href="/" className="sidebar-logo">
          <Image
            className="w-[200px] h-auto"
            src={"/assets/cutom-imgs/logo-new.png"}
            alt="logo"
            priority
            width={200}
            height={20}
            style={{ cursor: "pointer", mixBlendMode: "multiply" }}
          />
        </Link>
        {/* navbar */}
        <nav className="sidebar-nav">
          {/* signed in user nav links */}
          <SignedIn>
            <ul className="sidebar-nav_elements">
              {navLinks.slice(0, 6).map((link) => {
                const isActive = link.route === pathname;
                return (
                  <li
                    key={link.route}
                    className={`sidebar-nav_element group ${
                      isActive
                        ? "bg-purple-gradient text-white bg-purple-700 hover:bg-purple-700"
                        : "text-gray-700"
                    } `}
                  >
                    <Link className="sidebar-link" href={link.route}>
                      <Image
                        src={link.icon}
                        alt={link.route}
                        width={24}
                        height={24}
                        className={`${isActive && "brightness-200"}`}
                      />
                      <label htmlFor="">{link.label}</label>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ul className=" sidebar-nav_elements">
              {navLinks.slice(6).map((link) => {
                const isActive = link.route === pathname;
                return (
                  <li
                    key={link.route}
                    className={`sidebar-nav_element group ${
                      isActive
                        ? "bg-purple-gradient text-white bg-purple-700 hover:bg-purple-700"
                        : "text-gray-700"
                    } `}
                  >
                    <Link className="sidebar-link" href={link.route}>
                      <Image
                        src={link.icon}
                        alt={link.route}
                        width={24}
                        height={24}
                        className={`${isActive && "brightness-200"}`}
                      />
                      <label htmlFor="">{link.label}</label>
                    </Link>
                  </li>
                );
              })}
              <li className="flex-center cursor-pointer gap-2 p-4">
                <UserButton afterSignOutUrl="/" showName />
              </li>
            </ul>
          </SignedIn>
          {/* signed out user  */}
          <SignedOut>
            <Button asChild className="button bg-purple-gradient bg-cover">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
