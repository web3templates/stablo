import React from "react";
import styles from "./IframePreview.css";

export default function PagePreview(props) {
  const { displayed } = props.document;
  if (!displayed?.slug?.current) {
    return (
      <div>The product needs a slug before it can be previewed.</div>
    );
  }

  const url =
    process.env.NODE_ENV === "production"
      ? process.env.SANITY_STUDIO_SITE_URL
        ? `${process.env.SANITY_STUDIO_SITE_URL}/${displayed?.slug?.current}?preview`
        : `${process.env.VERCEL_URL}/${displayed?.slug?.current}?preview`
      : `http://localhost:3000/${displayed?.slug?.current}?preview`;

  return (
    <div className={styles.componentWrapper}>
      <div className={styles.iframeContainer}>
        <iframe src={url} frameBorder={"0"} />
      </div>
    </div>
  );
}
