import imageUrlBuilder from "@sanity/image-url";
import { useEffect, useState } from "react";
import BlockContent from "@sanity/block-content-to-react";

export const Post = ({ title, body, image }) => {
  console.log(title, body, image);

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const imgBuilder = imageUrlBuilder({
      projectId: "a9m6v19w",
      dataset: "production",
    });

    setImageUrl(imgBuilder.image(image));
  }, [image]);

  return (
    <>
      <h1>{title}</h1>

      {imageUrl && <img src={imageUrl} alt={image} width={500} height={500} />}
      <BlockContent blocks={body} />
    </>
  );
};

export const getServerSideProps = async (pageContext) => {
  const pageSlug = pageContext.query.slug;

  if (!pageSlug) {
    return {
      notFound: true,
    };
  }

  const query = encodeURIComponent(
    `*[_type =="post" && slug.current=="${pageSlug}"]`
  );
  const url = `https://a9m6v19w.api.sanity.io/v1/data/query/production?query=${query}`;

  const result = await fetch(url).then((res) => res.json());
  const post = result.result[0];

  if (!post) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        body: post.body,
        title: post.title,
        image: post.mainImage,
      },
    };
  }
};

export default Post;
