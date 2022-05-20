const STUDIO_REWRITE = {
  source: "/studio/:path*",
  destination:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3333/studio/:path*"
      : "/studio/index.html"
};

module.exports = {
  images: {
    domains: ["cdn.sanity.io"],
    loader: "custom"
  }
  // rewrites: () => [STUDIO_REWRITE],
};
