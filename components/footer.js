import Container from "@components/container";
import ThemeSwitch from "@components/themeSwitch";
import Image from "next/image";
import { myLoader } from "@utils/all";
import VercelLogo from "../public/img/vercel.svg";

export default function Footer(props) {
  return (
    <Container className="mt-10 border-t border-gray-100 dark:border-gray-800">
      <div className="text-sm text-center">
        Copyright © {new Date().getFullYear()} {props?.copyright}. All
        rights reserved.
      </div>
      <div className="flex justify-center gap-1 mt-1 text-sm text-center text-gray-500 dark:text-gray-600">
        <span>
          {" "}
          Made by{" "}
          {/*  // ** 🙏  Can I ask you a favor? 🙏 **
            // Please do not remove the below link.
           // It helps us to grow & continue our work. Thank you.
          // OR Purchase PRO version for commercial license.  */}
          <a
            href="https://web3templates.com/?ref=stablo-template"
            rel="noopener"
            target="_blank">
            Web3Templates
          </a>
        </span>
        <span>&middot;</span>
        <span>
          {" "}
          <a
            href="https://github.com/web3templates/stablo"
            rel="noopener"
            target="_blank">
            Github
          </a>
        </span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="mt-5">
          <a
            href="https://vercel.com/?utm_source=web3templates&utm_campaign=oss"
            target="_blank"
            rel="noopener"
            className="relative block w-44">
            <Image
              src={VercelLogo}
              layout="fixed"
              loader={myLoader}
              alt="Powered by Vercel"
              unoptimized={true}
              width="150"
              height="25"
            />
          </a>
        </div>
        <ThemeSwitch />
      </div>
      <Backlink />
    </Container>
  );
}

const Backlink = () => {
  return (
    <a
      href="https://web3templates.com/templates/stablo-minimal-blog-website-template"
      target="_blank"
      rel="noopener"
      className="fixed flex px-3 py-1 space-x-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded shadow-sm place-items-center right-5 bottom-5 dark:bg-trueGray-900 dark:border-trueGray-700 dark:text-trueGray-300">
      <svg
        width="20"
        height="20"
        viewBox="0 0 30 30"
        fill="none"
        className="w-4 h-4"
        xmlns="http://www.w3.org/2000/svg">
        <rect
          width="30"
          height="29.5385"
          rx="2.76923"
          fill="#362F78"
        />
        <path
          d="M10.14 21.94H12.24L15.44 12.18L18.64 21.94H20.74L24.88 8H22.64L19.58 18.68L16.36 8.78H14.52L11.32 18.68L8.24 8H6L10.14 21.94Z"
          fill="#F7FAFC"
        />
      </svg>

      <span> Purchase Pro ↗</span>
    </a>
  );
};
