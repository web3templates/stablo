# Pajamas JAMStack Starter

Pajamas is a JAMStack Starter template built with Next.js, Tailwind CSS & Sanity CMS.

## Quick Start

You can click "Use Template" button above to quickly copy this template or use the "Fork" option. You can also clone to your local by using the below command. 

```bash
# create a new folder and clone into it
git clone https://github.com/surjithctly/pajamas.git projectname

# if you are already inside your project folder
git clone https://github.com/surjithctly/pajamas.git .
```

## Setup Sanity CMS

**1. Install Sanity CLI (if not already)**

```
npm install -g @sanity/cli
```

**2. Create New Project**

If you want to start fresh, you can delete the `/studio` folder and run the following command inside your app. it will ask few questions including the studio path.  

```
sanity init
```

or, if you want to modify current Pajamas sanity template, Create a new project from https://www.sanity.io/manage and copy the project ID. 
 Open `/studio/sanity.json` and change the `projectID`. You can also change the name if needed.  
 
 Now run the following command to install dependencies inside the /studio folder. <br>
 (This step not needed if you are using first method `sanity init` )
 
 ```
 yarn install
 ```

<!-- This example shows how to use [Tailwind CSS](https://tailwindcss.com/) [(v2.2)](https://blog.tailwindcss.com/tailwindcss-2-2) with Next.js. It follows the steps outlined in the official [Tailwind docs](https://tailwindcss.com/docs/guides/nextjs).

It uses the new [`Just-in-Time Mode`](https://tailwindcss.com/docs/just-in-time-mode) for Tailwind CSS.

## Preview

Preview the example live on [StackBlitz](http://stackblitz.com/):

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/with-tailwindcss)

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss&project-name=with-tailwindcss&repository-name=with-tailwindcss)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example with-tailwindcss with-tailwindcss-app
# or
yarn create next-app --example with-tailwindcss with-tailwindcss-app
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)). -->
