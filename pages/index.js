import Head from "next/head";
import Image from "next/image";
import Logo from "../public/img/w3t-logo.svg";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Pajamas JAMStack Starter</title>
        <meta
          name="description"
          content="Pajamas is a JAMStack Starter Template powered by Next.js, Tailwind CSS & Sanity CMS"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 w-full px-5 text-center">
        <h1 className="text-6xl font-bold">
          Time for 🩳{" "}
          <a
            className="text-blue-600"
            href="https://github.com/surjithctly/pajamas">
            Pajamas
          </a>
        </h1>

        <p className="mt-3 text-2xl">
          A Perfect JAMStack Starter Template.
        </p>

        <div className="grid gap-5 mt-6 lg:grid-cols-3 max-w-7xl ">
          {/* <a
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener"
            className="p-6 mt-6 text-left border rounded-xl hover:text-blue-600 focus:text-blue-600">
            <h3 className="text-2xl font-bold">React &rarr;</h3>
            <p className="mt-4 text-xl">
              Its there, in the base. We built everything on top of
              it.
            </p>
          </a> */}

          <a
            href="https://nextjs.org/"
            target="_blank"
            rel="noopener"
            className="p-6 mt-6 text-left border rounded-xl hover:text-blue-600 focus:text-blue-600">
            <h3 className="text-2xl font-bold">Next.js &rarr;</h3>
            <p className="mt-4 text-xl">
              The God-Send (or vercel made) React Framework for modern
              era.
            </p>
          </a>

          <a
            href="https://tailwindcss.com"
            target="_blank"
            rel="noopener"
            className="p-6 mt-6 text-left border rounded-xl hover:text-blue-600 focus:text-blue-600">
            <h3 className="text-2xl font-bold">
              Tailwind CSS &rarr;
            </h3>
            <p className="mt-4 text-xl">
              The most criticized CSS framework in the world. It is
              the best.
            </p>
          </a>

          <a
            href="https://sanity.io"
            target="_blank"
            rel="noopener"
            className="p-6 mt-6 text-left border rounded-xl hover:text-blue-600 focus:text-blue-600">
            <h3 className="text-2xl font-bold">Sanity CMS &rarr;</h3>
            <p className="mt-4 text-xl">
              The only Headless CMS developers choose if compared with
              others.
            </p>
          </a>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://web3templates.com?ref=pajamas"
          target="_blank"
          rel="noopener noreferrer">
          Sponsored by{" "}
          <span className="h-5 ml-2 w-14">
            <Image
              src={Logo}
              alt="Web3Templates"
              layout="responsive"
            />
          </span>
        </a>
      </footer>
    </div>
  );
}
