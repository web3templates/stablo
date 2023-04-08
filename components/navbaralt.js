"use client";

import { Fragment } from "react";
import { Menu, Transition, Disclosure } from "@headlessui/react";
import Container from "@/components/container";
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import cx from "clsx";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { myLoader } from "@/utils/all";
import SearchInput from "./ui/search";

export default function NavbarAlt(props) {
  const menu = [
    {
      label: "Home",
      href: "#",
      children: [
        { title: "Home Default", path: "/" },
        { title: "Home Alternate", path: "/home/alt" },
        { title: "Home Minimal", path: "/home/minimal" },
        { title: "Home Lifestyle", path: "/home/lifestyle" },
        { title: "Home Two Column", path: "/home/2-col" }
      ]
    },
    {
      label: "About",
      href: "/about"
    },
    {
      label: "Contact",
      href: "/contact"
    },
    {
      label: "Pages",
      href: "#",
      children: [
        {
          title: "Category Page",
          path: "/category/personal-growth"
        },
        {
          title: "Author Page",
          path: "/author/mario-sanchez"
        },
        {
          title: "Search Page",
          path: "/search?q=life"
        },
        { title: "Archive - Pagination", path: "/archive" },
        {
          title: "Single Post - Default",
          path: "/post/10-simple-practices-that-will-help-you-get-1-better-every-day"
        },
        {
          title: "Single Post - Minimal",
          path: "/post/minimal/architectural-engineering-wonders-of-the-modern-era-for-your-inspiration"
        },
        {
          title: "Single Post - Lifestyle",
          path: "/post/lifestyle/there-s-nothing-new-about-undermining-women-s-autonomy"
        },
        {
          title: "Single Post - Sidebar",
          path: "/post/sidebar/lessons-of-happiness-i-learned-from-a-mountain-village"
        }
      ]
    },
    {
      label: "Purchase",
      href: "https://web3templates.com/templates/stablo-minimal-blog-website-template",
      external: true
    }
  ];

  return (
    <Container className="!py-0">
      <nav className="my-4">
        <Disclosure>
          {({ open }) => (
            <>
              <div className="flex flex-wrap justify-between md:gap-10 lg:flex-nowrap">
                <div className="flex w-full items-center justify-between lg:w-auto">
                  <Link href="/" className="w-28 dark:hidden">
                    {props.logo ? (
                      <Image
                        src={urlForImage(props.logo)}
                        alt="Logo"
                        priority={true}
                        sizes="(max-width: 640px) 100vw, 200px"
                      />
                    ) : (
                      <span className="block text-center">
                        Stablo
                      </span>
                    )}
                  </Link>
                  <Link href="/" className="hidden w-28 dark:block">
                    {props.logoalt ? (
                      <Image
                        src={urlForImage(props.logoalt)}
                        alt="Logo"
                        priority={true}
                        sizes="(max-width: 640px) 100vw, 200px"
                      />
                    ) : (
                      <span className="block text-center">
                        Stablo
                      </span>
                    )}
                  </Link>
                  <Disclosure.Button
                    aria-label="Toggle Menu"
                    className="ml-auto rounded-md px-2 py-1 text-gray-500 focus:text-blue-500 focus:outline-none dark:text-gray-300 lg:hidden ">
                    <svg
                      className="h-6 w-6 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24">
                      {open && (
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                        />
                      )}
                      {!open && (
                        <path
                          fillRule="evenodd"
                          d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                        />
                      )}
                    </svg>
                  </Disclosure.Button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden w-full flex-col items-center lg:flex lg:w-auto lg:flex-row ">
                    {menu.map((item, index) => (
                      <>
                        {item.children && item.children.length > 0 ? (
                          <DropdownMenu
                            menu={item}
                            key={index + item.label}
                            items={item.children}
                            mobile={props.mobile}
                          />
                        ) : (
                          <Link
                            href={item.href}
                            key={index + item.label}
                            className="rounded-full px-5 py-2 font-medium text-gray-600 outline-none ring-blue-100 hover:text-blue-500 focus-visible:text-blue-500 focus-visible:ring-2 dark:text-gray-400"
                            target={item.external ? "_blank" : ""}
                            rel={item.external ? "noopener" : ""}>
                            {item.label}
                          </Link>
                        )}
                      </>
                    ))}
                  </div>
                  <div className="hidden lg:block">
                    <form action="/search" method="GET">
                      <SearchInput placeholder="Search Blog" />
                    </form>
                  </div>
                </div>
              </div>
              <Disclosure.Panel>
                <div className="order-2 -ml-5 mt-5 flex w-full flex-col items-start justify-start lg:hidden">
                  {menu.map((item, index) => (
                    <>
                      {item.children && item.children.length > 0 ? (
                        <DropdownMenu
                          menu={item}
                          key={index + item.label}
                          items={item.children}
                          mobile={true}
                        />
                      ) : (
                        <Link
                          href={item.href}
                          key={index + item.label}
                          className="rounded-full px-5 py-2 text-sm font-medium text-gray-600 outline-none ring-blue-100 hover:text-blue-500 focus-visible:text-blue-500 focus-visible:ring-2 dark:text-gray-400"
                          target={item.external ? "_blank" : ""}
                          rel={item.external ? "noopener" : ""}>
                          {item.label}
                        </Link>
                      )}
                    </>
                  ))}
                  <div className="mt-2 px-5">
                    <form action="/search" method="GET">
                      <SearchInput placeholder="Search Blog" />
                    </form>
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </nav>
    </Container>
  );
}

const DropdownMenu = ({ menu, items, mobile }) => {
  return (
    <Menu as="div" className="relative text-left">
      {({ open }) => (
        <>
          <Menu.Button
            className={cx(
              "flex items-center gap-x-1 rounded-full px-5 py-2  font-medium outline-none ring-blue-100 transition-all focus-visible:text-blue-500 focus-visible:ring-2",
              open
                ? "text-blue-500 hover:text-blue-500"
                : " text-gray-600 dark:text-gray-400 ",
              mobile
                ? "w-full px-4 py-2 text-sm"
                : "inline-block px-4 py-2"
            )}>
            <span>{menu.label}</span>
            <ChevronDownIcon className="mt-0.5 h-4 w-4" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="lg:transition lg:ease-out lg:duration-100"
            enterFrom="lg:transform lg:opacity-0 lg:scale-95"
            enterTo="lg:transform lg:opacity-100 lg:scale-100"
            leave="lg:transition lg:ease-in lg:duration-75"
            leaveFrom="lg:transform lg:opacity-100 lg:scale-100"
            leaveTo="lg:transform lg:opacity-0 lg:scale-95">
            <Menu.Items
              className={cx(
                "z-20 origin-top-left rounded-md  focus:outline-none  lg:absolute lg:left-0  lg:w-56",
                !mobile && "bg-white shadow-lg  dark:bg-gray-800"
              )}>
              <div className={cx(!mobile && "py-3")}>
                {items.map((item, index) => (
                  <Menu.Item as="div" key={index}>
                    {({ active }) => (
                      <Link
                        href={item?.path ? item.path : "#"}
                        className={cx(
                          "flex items-center space-x-2 px-5 py-2 text-sm lg:space-x-4",
                          active
                            ? "text-blue-500"
                            : "text-gray-700 hover:text-blue-500 focus:text-blue-500 dark:text-gray-300"
                        )}>
                        <span> {item.title}</span>
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};
