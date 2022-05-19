import client from "@lib/sanity";
import { useNextSanityImage } from "next-sanity-image";

export default function GetImage(image, CustomImageBuilder = null) {
  const imageProps = useNextSanityImage(client, image, {
    imageBuilder: CustomImageBuilder
  });
  if (!image || !image.asset) {
    return null;
  }
  return imageProps;
}
