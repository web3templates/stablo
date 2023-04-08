export default function OgImage({ post }) {
  return (
    <div
      tw="w-full h-full flex flex-col items-start justify-center bg-white px-10"
      style={{ fontFamily: "Inter" }}>
      <span tw=" text-xs font-medium tracking-wider uppercase mt-5 text-blue-600">
        {post.categories[0].title}
      </span>

      <h1 tw="mt-2 mb-3 text-3xl font-semibold tracking-tight lg:leading-snug lg:text-4xl dark:text-white">
        {post.title}
      </h1>
    </div>
  );
}
