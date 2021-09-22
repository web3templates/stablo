import Head from "next/head";

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

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
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

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <a
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
            <h3 className="text-2xl font-bold">React &rarr;</h3>
            <p className="mt-4 text-xl">
              Its there, in the base. We built everything on top of
              it.
            </p>
          </a>

          <a
            href="https://nextjs.org/"
            target="_blank"
            rel="noopener"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
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
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
            <h3 className="text-2xl font-bold">
              Tailwind CSS &rarr;
            </h3>
            <p className="mt-4 text-xl">
              The most criticized CSS framework in the world. It's the
              best.
            </p>
          </a>

          <a
            href="https://sanity.io"
            target="_blank"
            rel="noopener"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
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
          <img
            src="/w3t-logo.svg"
            alt="Web3Templates"
            className="h-5 ml-2"
          />
        </a>
      </footer>
    </div>
  );
}
