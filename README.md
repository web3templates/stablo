# Stablo Blog Template - Next.js & Sanity CMS

Stablo is a JAMStack Blog template built with Next.js, Tailwind CSS & Sanity CMS by [Web3Templates](https://web3templates.com/). It comes with free & pro version.

## [Installation ↓](#installation)

## Live Demo

**[Free Version Demo →](https://stablo.web3templates.com/)**

**[Pro Version Demo →](https://stablo-pro.web3templates.com/)**

## Features

<!-- prettier-ignore -->
| Feature | Free Version | Pro Version |
| --- | ------ | --- |
| Next.js v13 | ✅  | ✅ |
| /app Directory | ✅  | ✅ |
| Tailwind CSS   | ✅  | ✅ |
| Sanity CMS (v3) | ✅  | ✅ |
| Mobile Responsive | ✅  | ✅ |
| Dark & Light Mode | ✅  | ✅ |
| Working Contact Page | ✅  | ✅ |
| Archive (Pagination) | ✅  | ✅ |
| Category Pages  | ❌  | ✅ |
| Author Pages    | ❌  | ✅ |
| Search Page     | ❌  | ✅ |
| Homepage - Default | ✅  | ✅ |
| Homepage - Alternate       | ❌  | ✅ |
| Homepage - Minimal | ❌  | ✅ |
| Homepage - Lifestlye       | ❌  | ✅ |
| Homepage - Two Column      | ❌  | ✅ |
| Blog Post - Default        | ✅  | ✅ |
| Blog Post - Minimal        | ❌  | ✅ |
| Blog Post - Lifestlye      | ❌  | ✅ |
| Blog Post - with Sidebar   | ❌  | ✅ |
| 6 Months Support| ❌  | ✅  |
| Free Updates    | ✅  | ✅  |
| License         | GPL-2.0 | Commercial |
| &nbsp; | &nbsp;| &nbsp;|
| Pricing| Free|**$49**|
| &nbsp; | [Deploy for free](https://vercel.com/new/web3templates/clone?demo-title=Stablo%20%E2%80%93%20Minimal%20Blog%20Template&demo-description=A%20minimal%20blog%20website%20template%20built%20with%20Next.js%2C%20TailwindCSS%20%26%20Sanity%20CMS%0A&demo-url=https%3A%2F%2Fstablo-template.vercel.app%2F&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F6p72KDrdJ8SjyvOBrgRbnr%2F0760db43f2cb08504a2f67601e74d986%2FCleanShot_2022-07-15_at_16.54.17.png&project-name=Stablo%20%E2%80%93%20Minimal%20Blog%20Template&repository-name=stablo-blog&repository-url=https%3A%2F%2Fgithub.com%2Fweb3templates%2Fstablo&from=templates&integration-ids=oac_hb2LITYajhRQ0i4QznmKH7gx) | [Purchase Pro](https://web3templates.com/templates/stablo-minimal-blog-website-template) |

<a href="https://web3templates.com/templates/stablo-minimal-blog-website-template">
<img width="160" alt="Upgrade to Pro" src="https://user-images.githubusercontent.com/1884712/199181300-37c2128e-d033-4145-a906-16fa5263a53b.png">
</a>

###### Click the above button for one-click clone & deploy for this template. Read [quick start](#quick-start) guide below.

#### Template Preview

[![Next.js Front-end Preview](https://user-images.githubusercontent.com/1884712/169838344-e32b7426-621a-45a4-aba8-afedf3377e1f.jpeg)](https://web3templates.com/preview/stablo)

#### Sanity CMS Preview

![Backend Sanity CMS Preview](https://user-images.githubusercontent.com/1884712/170030678-c6e32d47-0b92-42b7-ac2d-f3cf800c0969.png)

# Installation

## Step 1: Deploy to Vercel

Use the Deploy Button below. It will let you deploy the starter using Vercel as well as connect it to your Sanity Studio using the Sanity Vercel Integration.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/web3templates/clone?demo-title=Stablo%20%E2%80%93%20Minimal%20Blog%20Template&demo-description=A%20minimal%20blog%20website%20template%20built%20with%20Next.js%2C%20TailwindCSS%20%26%20Sanity%20CMS%0A&demo-url=https%3A%2F%2Fstablo-template.vercel.app%2F&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F6p72KDrdJ8SjyvOBrgRbnr%2F0760db43f2cb08504a2f67601e74d986%2FCleanShot_2022-07-15_at_16.54.17.png&project-name=Stablo%20%E2%80%93%20Minimal%20Blog%20Template&repository-name=stablo-blog&repository-url=https%3A%2F%2Fgithub.com%2Fweb3templates%2Fstablo&from=templates&integration-ids=oac_hb2LITYajhRQ0i4QznmKH7gx)

**The above deploy will automatically configure the following:**

- Create new Repository in Github
- Create a Sanity Project
- Install Sanity Integration in Vercel
- Add required CORS & API settings in the project
- Deploy Frontend to Vercel

## Step 2: Set up the project locally.

Once you have deployed the website, it will look like empty or not configured properly. This is expected. We need to do few more steps to make it as seen on the demo.

First, clone the github repository vercel created into your local machine. Use the following command structure. Make sure the terminal is on the right folder before executing this command.

```bash
git clone https://github.com/<usename>/<repo>.git your-project-name
```

Once cloned, run the following command from the project's root directory. This will link your vercel project.

```bash
npx vercel link
```

Now, run the following command to pull the `.env` variables to your local system.

```bash
npx vercel env pull
```

Now you can see that a new `.env.local` file has been created. If this doesn't work, you can also rename the `.env.local.example` to `.env.local` and add the Sanity Project ID manually.

Now, you can open your code editor (if not already) we prefer VSCode. The run the command in the integrated terminal inside the code editor.

```bash
npm install
# or
yarn install
# or
pnpm install
```

We prefer `pnpm` to save your disk space.

## Step 3: Import Demo Data (Optional)

To look like what you have seen in the demo, with all the content and images, follow the below steps:

1. if you have not installed `@sanity/cli` install it globally first.

```bash
npm install -g @sanity/cli
# or
pnpm install -g @sanity/cli
```

Then login to sanity using `sanity login` command

```
sanity login
```

Now, you will be able to import demo content by running the `sanity-import` command. The files are located at `/lib/sanity/data/production.tar.gz` and will load automatically by running the below command.

```bash
npm run sanity-import
# or
pnpm sanity-import
```

## Step 4: Finish it up!

Now, run your project using the below command.

```bash
npm run dev
# or
pnpm dev
```

Now your project should be up and the Next.js frontend will be running on http://localhost:3000.

Sanity Studio can be accessed using http://localhost:3000/studio or you can run it on a separate https://localhost:3333 server using the following command.

```bash
npm run sanity
# or
pnpm sanity
```

## Step 5. Redploy

Once all of the above changes is made, make sure to redeploy to vercel once again to see all of your changes in production.

You can `git push` the changes and it should automatically trigger a new deployment. If not, you can also deploy to vercel using the following command.

```
npx vercel --prod
```

# Manual Installation

We recommend you to use the one-click deploy option above. For some reason, if you cannot, use the following steps to install it manually.

## Step 1. Clone the Repo

Clone the github repo or use the downloaded files in your local machine.

## Step 2. Setup `.env` Variables.

Open the project folder and rename `.env.local.example` placed in the root folder into `.env.local` and add your sanity project ID. You can create a new project by visiting this link: https://www.sanity.io/get-started/create-project

If you already have a project, copy the project ID from https://sanity.io/manage

```
NEXT_PUBLIC_SANITY_PROJECT_ID=xxyyzz
```

## Step 3. Allow CORS Origins

To make the studio work properly, you must add CORS origin in Sanity. This is usually setup automatically if you are using the Vercel Deploy. Visit `https://www.sanity.io/manage/personal/project/<project-id>/api` in your browser to add CORS origin.

Click `Add CORS origin` button and enter the URL as `http://localhost:3000` and check the Allow credentials checkbox.

## Step 4 Continue from above steps

Now, you will be able continue from the above instructions to import the demo data and running the project locally.

## Help and Support

Something's not working as expected? Raise a github issue. If you need personalized support or help, please consider purchasing the Pro version and we will assist you over email.

## Sponsor

<a href="https://vercel.com/?utm_source=web3templates&amp;utm_campaign=oss" rel="nofollow"><img src="https://camo.githubusercontent.com/37b009b52b3a9af7886f52e75cd76d1b32fef331ab1dc2108089c0ced0b7635f/68747470733a2f2f7777772e6461746f636d732d6173736574732e636f6d2f33313034392f313631383938333239372d706f77657265642d62792d76657263656c2e737667" alt="image" style="max-width: 70%;"></a>
