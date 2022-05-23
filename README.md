# Stablo Blog Template - Next.js & Sanity CMS

Stablo is a JAMStack Starter template built with Next.js, Tailwind CSS & Sanity CMS by [Web3Templates](https://web3templates.com/).

**[Click here to see live demo →](https://stablo-template.vercel.app/)**

<a href="https://www.sanity.io/create?template=web3templates%2Fstablo">
<img width="259" alt="Deploy to Vercel & Sanity" src="https://user-images.githubusercontent.com/1884712/169833532-1007b9aa-1456-4386-9526-7b5b46b094ed.png">
</a> 

###### Click the above button for one-click clone & deploy for this template. Read [quick start](#quick-start) guide below. 

#### Template Preview

[![FTbqAP1UAAEFztZ](https://user-images.githubusercontent.com/1884712/169838344-e32b7426-621a-45a4-aba8-afedf3377e1f.jpeg)](https://stablo-template.vercel.app/)

## Quick Start

To use this template and configure sanity and deploying to vercel, we recommend the "One Click Deploy" method.  Just follow the GUI and you will have an exact copy of what you see in the live demo .Using this method will automatically configure the following tasks for you.

- Signup/Login to Sanity CMS (if not already)
- Create a Sanity Project
- Add required CORS & API settings in the project
- Create new Repository in Github
- Install Sanity Integration in Vercel
- Add required `.env` variables
- Deploy Sanity Studio - Content Manager
- Import Demo Content (as seen in live demo)
- Deploy to Vercel
 

<a href="https://www.sanity.io/create?template=web3templates%2Fstablo">
<img width="259" alt="Deploy to Vercel & Sanity" src="https://user-images.githubusercontent.com/1884712/169833532-1007b9aa-1456-4386-9526-7b5b46b094ed.png">
</a>


To setup one click deployment, click the above link below and follow the steps. 

## Local Development

Again, we recommend you to use the one-click deploy first which will create a github repo. You can then clone the github repo to your local system and change following `.env` variables. 

1. ~root/`.env.local`

Change `.env.local.example` placed in the root folder and rename it to `.env.local` and add your sanity project ID. Get it from https://sanity.io/manage

```
NEXT_PUBLIC_SANITY_PROJECT_ID=xxyyzz
```

2. `/studio/.env.development` or `/studio/sanity.json`

To develop sanity cms locally, you also need to add the Project ID and Dataset in either `.env` or in `sanity.json` file.

```
# .env.development
SANITY_STUDIO_API_PROJECT_ID=xxyyzz
SANITY_STUDIO_API_DATASET=production

```
or you can directly replace the project ID in the `/studio/sanity.json`

```js
// sanity.json
  // ...
  "api": {
    "projectId": "xxyyzz",
    "dataset": "production"
  },
  // ...
```


### Run Next.js frontend

You can use the normal Next.js method to run the frontend. Just run the following command and a live server will open on `http://localhost:3000`

```
yarn dev
```


### Run Sanity Studio CMS

1. Install Sanity CLI globally (if not already)

```
npm install -g @sanity/cli
```

2. Run 

To run sanity studio server, run the following command in your terminal.  It will open a live server on `http://localhost:3333`

```
yarn sanity
# or
cd studio && sanity start
```

## Sponsor

<a href="https://vercel.com/?utm_source=web3templates&amp;utm_campaign=oss" rel="nofollow"><img src="https://camo.githubusercontent.com/37b009b52b3a9af7886f52e75cd76d1b32fef331ab1dc2108089c0ced0b7635f/68747470733a2f2f7777772e6461746f636d732d6173736574732e636f6d2f33313034392f313631383938333239372d706f77657265642d62792d76657263656c2e737667" alt="image" style="max-width: 70%;"></a>
