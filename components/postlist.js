import Image from "next/image";
import Link from "next/link";

import GetImage from "@utils/getImage";
import { parseISO, format } from "date-fns";
import { PhotographIcon } from "@heroicons/react/outline";

export default function PostList({ post }) {
  return (
    <>
      <div className="cursor-pointer">
        <div className="relative overflow-hidden transition-all bg-gray-100 rounded-md dark:bg-gray-800 aspect-3/2 hover:scale-105">
          <Link href={`/blog/${post.slug.current}`}>
            <a>
              {post.mainImage ? (
                <Image
                  src={GetImage(post.mainImage).src}
                  blurDataURL={GetImage(post.mainImage).blurDataURL}
                  alt={post.mainImage.alt || "Thumbnail"}
                  placeholder="blur"
                  layout="fill"
                  objectFit="cover"
                  className="transition-all"
                />
              ) : (
                <span className="absolute w-16 h-16 text-gray-200 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                  <PhotographIcon />
                </span>
              )}
            </a>
          </Link>
        </div>
        <h2 className="mt-5 text-xl font-medium text-brand-primary">
          <Link href={`/blog/${post.slug.current}`}>
            {post.title}
          </Link>
        </h2>

        <div className="flex mt-3 space-x-3 text-gray-500">
          <div className="flex gap-3">
            <div className="relative flex-shrink-0 w-5 h-5">
              {post.author.image && (
                <Image
                  src={GetImage(post.author.image).src}
                  blurDataURL={
                    GetImage(post.author.image).blurDataURL
                  }
                  objectFit="cover"
                  layout="fill"
                  alt={post.author.name}
                  placeholder="blur"
                  className="rounded-full"
                />
              )}
            </div>
            <span>{post.author.name}</span>
          </div>
          <span>&bull;</span>
          <time dateTime={post?.publishedAt || post._createdAt}>
            {format(
              parseISO(post?.publishedAt || post._createdAt),
              "MMMM dd, yyyy"
            )}
          </time>
        </div>
        <p className="mt-3">{post.excerpt}</p>
      </div>
    </>
  );
}
