import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import { parseISO, format } from "date-fns";
import { cx } from "@/utils/all";
import Link from "next/link";

export default function Featured({ post, pathPrefix }) {
  const imageProps = post?.mainImage
    ? urlForImage(post?.mainImage)
    : null;

  const AuthorimageProps = post?.author?.image
    ? urlForImage(post.author.image)
    : null;
  return (
    <div
      className={cx(
        "grid md:grid-cols-2 gap-5 md:gap-10 md:min-h-[calc(100vh-30vh)]"
      )}
      style={{
        backgroundColor: post?.mainImage?.ImageColor || "black"
      }}>
      {imageProps && (
        <div className="relative aspect-video md:aspect-auto">
          <Link
            href={`/post/${pathPrefix ? `${pathPrefix}/` : ""}${
              post.slug.current
            }`}>
            <Image
              src={imageProps.src}
              {...(post.mainImage.blurDataURL && {
                placeholder: "blur",
                blurDataURL: post.mainImage.blurDataURL
              })}
              alt={post.mainImage?.alt || "Thumbnail"}
              priority
              fill
              sizes="100vw"
              className="object-cover"
            />
          </Link>
        </div>
      )}

      <div className="self-center px-5 pb-10">
        <Link
          href={`/post/${pathPrefix ? `${pathPrefix}/` : ""}${
            post.slug.current
          }`}>
          <div className="max-w-2xl">
            <h1 className="mt-2 mb-3 text-3xl font-semibold tracking-tight text-white lg:leading-tight text-brand-primary lg:text-5xl">
              {post.title}
            </h1>

            <div className="flex mt-4 space-x-3 text-gray-500 md:mt-8 ">
              <div className="flex flex-col gap-3 md:items-center md:flex-row">
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0 w-5 h-5">
                    {AuthorimageProps && (
                      <Image
                        src={AuthorimageProps.src}
                        alt={post?.author?.name}
                        className="object-cover rounded-full"
                        fill
                        sizes="100vw"
                      />
                    )}
                  </div>
                  <p className="text-gray-100 ">
                    {post.author.name}{" "}
                    <span className="hidden pl-2 md:inline"> ·</span>
                  </p>
                </div>

                <div>
                  <div className="flex space-x-2 text-sm md:flex-row md:items-center">
                    <time
                      className="text-white"
                      dateTime={post?.publishedAt || post._createdAt}>
                      {format(
                        parseISO(
                          post?.publishedAt || post._createdAt
                        ),
                        "MMMM dd, yyyy"
                      )}
                    </time>
                    <span className="text-white">
                      · {post.estReadingTime || "5"} min read
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
