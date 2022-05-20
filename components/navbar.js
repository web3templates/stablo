import React from "react";
import Container from "@components/container";
import Link from "next/link";
import Image from "next/image";
import Logo from "/public/img/logo.svg";
import LogoWhite from "/public/img/logo-white.svg";

export default function Navbar() {
  return (
    <Container>
      <nav>
        <div className="flex flex-wrap justify-between md:gap-10 md:flex-nowrap">
          <div className="flex flex-col items-center justify-start order-1 w-full md:flex-row md:justify-end md:w-auto md:order-none md:flex-1">
            <Link href="#">
              <a className="px-5 py-2 text-sm font-medium text-gray-600 ">
                Home
              </a>
            </Link>
            <Link href="#">
              <a className="px-5 py-2 text-sm font-medium text-gray-600 ">
                About
              </a>
            </Link>
            <Link href="#">
              <a className="px-5 py-2 text-sm font-medium text-gray-600 ">
                Categories
              </a>
            </Link>
          </div>
          <div className="flex justify-between w-full md:w-auto">
            <Link href="/">
              <a className="w-28 dark:hidden">
                <Image src={Logo} alt="logo" />
              </a>
            </Link>
            <Link href="/">
              <a className="hidden w-28 dark:block">
                <Image src={LogoWhite} alt="logo" />
              </a>
            </Link>
            <button className="md:hidden">Menu</button>
          </div>

          <div className="flex flex-col items-center justify-start order-2 w-full md:flex-row md:w-auto md:flex-1 md:order-none">
            <Link href="#">
              <a className="px-5 py-2 text-sm font-medium text-gray-600 ">
                Archive
              </a>
            </Link>
            <Link href="#">
              <a className="px-5 py-2 text-sm font-medium text-gray-600 ">
                Github
              </a>
            </Link>
            <Link href="#">
              <a className="px-5 py-2 text-sm font-medium text-gray-600 ">
                Download
              </a>
            </Link>
          </div>
        </div>
      </nav>
    </Container>
  );
}
