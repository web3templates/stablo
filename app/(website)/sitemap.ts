import { getAllPosts } from "@/lib/sanity/client";

export default async function Sitemap() {

  const domain = process.env.SITE_URL || "https://stablo-pro.web3templates.com"

  const posts = await getAllPosts()

  const formattedPost = posts.map((post) => ({
    url: `${domain}/post/${post.slug.current}`,
    lastModified: post.publishedAt,
  }));
  
  return [
    {
      url: domain,
      lastModified: new Date(),
    },
    ...formattedPost
  ];
}