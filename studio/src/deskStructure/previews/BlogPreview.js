import React from "react";
import styles from "./IframePreview.css";

export default function BlogPreview(props) {
  const { displayed } = props.document;
  if (!displayed?.slug?.current) {
    return (
      <div>The blog needs a slug before it can be previewed.</div>
    );
  }

  const url =
    process.env.NODE_ENV === "production"
      ? process.env.SANITY_STUDIO_SITE_URL
        ? `${process.env.SANITY_STUDIO_SITE_URL}/blog/${displayed?.slug?.current}?preview`
        : `${process.env.VERCEL_URL}/blog/${displayed?.slug?.current}?preview`
      : `http://localhost:3000/blog/${displayed?.slug?.current}?preview`;

  return (
    <div className={styles.componentWrapper}>
      <div className={styles.iframeContainer}>
        <iframe src={url} frameBorder={"0"} />
      </div>
    </div>
  );
}
