import Image from "next/image";
import Link from "next/link";
import { cx } from "@/utils/all";
import { urlForImage } from "@/lib/sanity/image";
import { parseISO, format } from "date-fns";
import { PhotoIcon } from "@heroicons/react/24/outline";
import CategoryLabel from "@/components/blog/category";

export default function PostAlt({
  post,
  aspect,
  preloadImage,
  featured = false
}) {
  const imageProps = post?.mainImage
    ? urlForImage(post.mainImage)
    : null;
  const AuthorimageProps = post?.author?.image
    ? urlForImage(post.author.image)
    : null;
  return (
    <>
      <div
        className={cx(
          "grid gap-3 content-start cursor-pointer group",
          featured && " lg:grid-cols-2 lg:gap-10"
        )}>
        <div
          className={cx(
            "relative overflow-hidden transition-all bg-gray-100 rounded-md dark:bg-gray-800",
            aspect === "landscape" ? "aspect-video" : "aspect-square"
          )}>
          <Link href={`/post/minimal/${post.slug.current}`}>
            {imageProps ? (
              <Image
                src={imageProps.src}
                {...(post.mainImage.blurDataURL && {
                  placeholder: "blur",
                  blurDataURL: post.mainImage.blurDataURL
                })}
                alt={post.mainImage.alt || "Thumbnail"}
                priority={preloadImage ? true : false}
                className="object-cover transition-all"
                fill
                sizes="80vw"
              />
            ) : (
              <span className="absolute w-16 h-16 text-gray-200 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <PhotoIcon />
              </span>
            )}
          </Link>
        </div>

        <div
          className={cx(
            "flex flex-col justify-center",
            !featured && "lg:mt-5"
          )}>
          <div
            className={cx(
              "flex items-center space-x-3 text-gray-500 dark:text-gray-400"
            )}>
            <time
              className="text-sm"
              dateTime={post?.publishedAt || post._createdAt}>
              {format(
                parseISO(post?.publishedAt || post._createdAt),
                "MMMM dd, yyyy"
              )}
            </time>
          </div>

          <h2
            className={cx(
              "mt-2 text-xl font-semibold tracking-normal line-clamp-2 text-brand-primary dark:text-white",
              featured ? "lg:text-3xl" : "lg:text-2xl"
            )}>
            <Link href={`/post/minimal/${post.slug.current}`}>
              <span
                className="bg-gradient-to-r from-black to-black dark:from-white dark:to-white
        bg-[length:0px_2px]
        bg-left-bottom
        bg-no-repeat
        transition-[background-size]
        duration-500
        hover:bg-[length:100%_2px] group-hover:bg-[length:100%_2px]">
                {post.title}
              </span>
            </Link>
          </h2>
        </div>
      </div>
    </>
  );
}
