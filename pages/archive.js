import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { NextSeo } from "next-seo";
import Layout from "@components/layout";
import Container from "@components/container";
// import Subpagehero from "@components/sections/subpagehero";
// import Categories from "@components/categories";
import { useRouter } from "next/router";
import { getClient, usePreviewSubscription } from "@lib/sanity";
import defaultOG from "../public/img/opengraph.jpg";
import { postquery, configQuery } from "@lib/groq";
import GetImage from "@utils/getImage";
import PostList from "@components/postlist";

export default function Post(props) {
  const { postdata, siteconfig, preview } = props;

  const router = useRouter();
  //console.log(router.query.category);

  const { data: posts } = usePreviewSubscription(postquery, {
    initialData: postdata,
    enabled: preview || router.query.preview !== undefined
  });

  const { data: siteConfig } = usePreviewSubscription(configQuery, {
    initialData: siteconfig,
    enabled: preview || router.query.preview !== undefined
  });
  //console.log(posts);
  const ogimage = siteConfig?.openGraphImage
    ? GetImage(siteConfig?.openGraphImage).src
    : defaultOG.src;
  return (
    <>
      {posts && siteConfig && (
        <Layout {...siteConfig}>
          <NextSeo
            title={`Blog — ${siteConfig?.title}`}
            description={siteConfig?.description || ""}
            canonical={siteConfig?.url}
            openGraph={{
              url: siteConfig?.url,
              title: `Blog — ${siteConfig?.title}`,
              description: siteConfig?.description || "",
              images: [
                {
                  url: ogimage,
                  width: 800,
                  height: 600,
                  alt: ""
                }
              ],
              site_name: "Stablo"
            }}
            twitter={{
              cardType: "summary_large_image"
            }}
          />
          <Container>
            <h1 className="text-3xl font-semibold tracking-tight text-center lg:leading-snug text-brand-primary lg:text-4xl dark:text-white">
              Archive
            </h1>
            <div className="text-center">
              <p className="mt-2 text-lg">
                See all posts we have ever written.
              </p>
            </div>
            <div className="grid gap-10 mt-10 lg:gap-10 md:grid-cols-2 xl:grid-cols-3 ">
              {posts.map(post => (
                <PostList
                  key={post._id}
                  post={post}
                  aspect="square"
                />
              ))}
            </div>
          </Container>
        </Layout>
      )}
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const post = await getClient(preview).fetch(postquery);
  const config = await getClient(preview).fetch(configQuery);

  // const categories = (await client.fetch(catquery)) || null;

  return {
    props: {
      postdata: post,
      // categories: categories,
      siteconfig: { ...config },
      preview
    },
    revalidate: 86400
  };
}
