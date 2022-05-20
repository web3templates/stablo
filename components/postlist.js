import Image from "next/image";
import Link from "next/link";
import { cx } from "@utils/all";
import GetImage from "@utils/getImage";
import { parseISO, format } from "date-fns";
import { PhotographIcon } from "@heroicons/react/outline";

export default function PostList({ post, aspect }) {
  return (
    <>
      <div className="cursor-pointer">
        <div
          className={cx(
            "relative overflow-hidden transition-all bg-gray-100 rounded-md dark:bg-gray-800   hover:scale-105",
            aspect === "landscape" ? "aspect-video" : "aspect-square"
          )}>
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
        <div>
          {post?.categories?.length &&
            post.categories.slice(0).map((category, index) => (
              <Link
                href={`/category/${category.slug.current}`}
                key={index}>
                <a
                  className={cx(
                    "inline-block mt-5 text-xs font-medium tracking-wider text-gray-600 uppercase ",
                    category.color === "green"
                      ? "text-green-500"
                      : category.color === "blue"
                      ? "text-blue-500"
                      : category.color === "orange"
                      ? "text-orange-400"
                      : category.color === "purple"
                      ? "text-purple-500"
                      : "text-pink-500"
                  )}>
                  {category.title}
                </a>
              </Link>
            ))}
        </div>
        <h2 className="mt-2 text-lg font-semibold tracking-normal text-brand-primary">
          <Link href={`/blog/${post.slug.current}`}>
            {post.title}
          </Link>
        </h2>

        <div>
          {post.excerpt && (
            <p className="mt-2 text-sm text-gray-500 line-clamp-3">
              {post.excerpt}
            </p>
          )}
        </div>

        <div className="flex items-center mt-3 space-x-3 text-gray-500">
          <div className="flex items-center gap-3">
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
            <span className="text-sm">{post.author.name}</span>
          </div>
          <span className="text-xs text-gray-300">&bull;</span>
          <time
            className="text-sm"
            dateTime={post?.publishedAt || post._createdAt}>
            {format(
              parseISO(post?.publishedAt || post._createdAt),
              "MMMM dd, yyyy"
            )}
          </time>
        </div>
      </div>
    </>
  );
}
