import Container from "@components/container";
import ThemeSwitch from "@components/themeSwitch";

export default function Footer(props) {
  return (
    <Container className="border-t border-gray-100 dark:border-gray-800">
      <div className="text-center">
        Copyright © {new Date().getFullYear()} {props?.copyright}. All
        rights reserved.
      </div>
      <div className="mt-1 text-sm text-center text-gray-600">
        Made by{" "}
        <a
          href="https://www.web3templates.com/"
          rel="noopener"
          target="_blank">
          Web3Templates
        </a>
      </div>
      <div className="mt-2 text-right">
        <ThemeSwitch />
      </div>
    </Container>
  );
}
