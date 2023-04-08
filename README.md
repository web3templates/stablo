# Stablo Pro - Next.js & Sanity CMS Blog Template

Thank you for purchasing Stablo Pro. The advanced Pro version of Stablo Blog Template. Stablo is a JAMStack Blog Template built with Next.js, Tailwind CSS & Sanity CMS by [Web3Templates](https://web3templates.com/).

**[Click here to see live demo →](https://stablo-pro.web3templates.com/)**

#### Template Preview

[![Next.js Front-end Preview](https://user-images.githubusercontent.com/1884712/169838344-e32b7426-621a-45a4-aba8-afedf3377e1f.jpeg)](https://stablo-template.vercel.app/)

#### Sanity CMS Preview

[![Backend Sanity CMS Preview](https://user-images.githubusercontent.com/1884712/170030678-c6e32d47-0b92-42b7-ac2d-f3cf800c0969.png)](https://stablo-template.vercel.app/studio)

## Quick Start

To use the Stablo Pro Template and configure Sanity & Vercel, we recommend the "One Click Deploy" method of Stablo Free Template First. It will help you to setup the following:

- Signup/Login to Sanity CMS (if not already)
- Create a Sanity Project
- Add required CORS & API settings in the project
- Create new Repository in Github
- Install Sanity Integration in Vercel
- Add required `.env` variables
- Deploy Sanity Studio - Content Manager
- Import Demo Content (as seen in live demo)
- Deploy to Vercel

### 1. One click Deploy Free Version

<a href="https://vercel.com/new/web3templates/clone?demo-title=Stablo%20%E2%80%93%20Minimal%20Blog%20Template&demo-description=A%20minimal%20blog%20website%20template%20built%20with%20Next.js%2C%20TailwindCSS%20%26%20Sanity%20CMS%0A&demo-url=https%3A%2F%2Fstablo-template.vercel.app%2F&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F6p72KDrdJ8SjyvOBrgRbnr%2F0760db43f2cb08504a2f67601e74d986%2FCleanShot_2022-07-15_at_16.54.17.png&project-name=Stablo%20%E2%80%93%20Minimal%20Blog%20Template&repository-name=stablo-blog&repository-url=https%3A%2F%2Fgithub.com%2Fweb3templates%2Fstablo&from=templates&integration-ids=oac_hb2LITYajhRQ0i4QznmKH7gx">
<img width="259" alt="Deploy to Vercel & Sanity" src="https://user-images.githubusercontent.com/1884712/169833532-1007b9aa-1456-4386-9526-7b5b46b094ed.png">
</a>

To setup one click deployment, click the above link below and follow the steps. Once you have completed the following steps, you will have the Stablo Free Version running on Vercel. Now follow the steps to configure the Stablo Pro version.

### 2. Upgrade to Stablo Pro Version

Once free version is deployed, open your github repo you have created for the Stablo Blog and clone it to your local system. Now open the ZIP folder from Web3Templates and extract it. Inside you can see a folder named `stablo-pro`. Now copy the files inside that folder and replace it with the cloned Blog path.

Now create a commit and push request to your github which will automatically upgrade the content to Pro. You can now start making your changes as needed.

In case you installed stablo free earlier, you can still do a replace with the new files, but this time, use the Git compare option to filter your changes. Then you can merge it as needed.

## Local Development

Instead of one-click deploy, If you prefer to do everything manually, Extract the Downloaded ZIP file and move the `stablo-pro` to your favorite location. eg: `/works`. Now Open it in your code editor (we recommend VSCode) and please follow the steps.

1. ~root/`.env.local`

Change `.env.local.example` placed in the root folder and rename it to `.env.local` and add your sanity project ID. Create or get it from https://sanity.io/manage

```
NEXT_PUBLIC_SANITY_PROJECT_ID=xxyyzz
```

2. `/studio/.env.development` or `/studio/sanity.json`

To develop sanity cms locally, you also need to add the Project ID and Dataset in either `.env` or in `sanity.json` file.
Change `.env.development.example` placed in the root folder and rename it to `.env.development` and add the Project ID and Dataset Name.

```
# .env.development
SANITY_STUDIO_API_PROJECT_ID=xxyyzz
SANITY_STUDIO_API_DATASET=production

```

or you can directly replace the project ID in the `/studio/sanity.json` if you prefer.

```js
// sanity.json
  // ...
  "api": {
    "projectId": "xxyyzz",
    "dataset": "production"
  },
  // ...
```

### Run Sanity Studio CMS

1. Install Sanity CLI globally (if not already)

```
npm install -g @sanity/cli
```

2. Run

To run sanity studio server, run the following command in your terminal. It will open a live server on `http://localhost:3333`

```
yarn sanity
# or
cd studio && sanity start
```

### Import Demo Data

First, download the demo content as zip from the download link you received after purchase. Inside the ZIP, you can find a `production.tar.gz` file which you should move to the `yourProject/studio` folder.

Now, you can import the demo data to your sanity studio by using Sanity CLI. To run, open the studio path in the terminal by running `cd studio` and then run the following command.

```
sanity dataset import production.tar.gz production
```

This step is optional, but recommended because otherwise, without any data, you cannot run front-end as it will throw errors. You can delete or modify the data later once you are done with customization.

### Run Next.js frontend

Once you have Sanity studio and Data, You can use the normal Next.js method to run the frontend. Just run the following command and a live server will open on `http://localhost:3000`

```
yarn dev
```
