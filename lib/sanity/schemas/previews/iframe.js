import React from "react";
import Iframe from "react-iframe";

const IframePreview = ({ url, height }) => {
  if (!url) {
    return <p>Missing Embed URL</p>;
  }

  return (
    <Iframe
      url={url}
      width="100%"
      height={height || "350"}
      styles={{
        ...(!height && { aspectRatio: "16 / 9" })
      }}
      display="block"
      position="relative"
      frameBorder="0"
      allowfullscreen
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture"
    />
  );
};

export default IframePreview;
