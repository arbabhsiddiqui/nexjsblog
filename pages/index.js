import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import imageUrlBuilder from "@sanity/image-url";
import Link from "next/link";

export default function Home({ posts }) {
  const [mappedPosts, setMappedPosts] = useState([]);

  useEffect(() => {
    if (posts.length) {
      const imgBuilder = imageUrlBuilder({
        projectId: "a9m6v19w",
        dataset: "production",
      });

      setMappedPosts(
        posts.map((post) => {
          return {
            ...post,
            mainImage: imgBuilder.image(post.mainImage).width(500).height(500),
          };
        })
      );
    } else {
      setMappedPosts([]);
    }
  }, [posts]);
  return (
    <>
      <h1>hello</h1>

      <div>
        {mappedPosts.length ? (
          mappedPosts.map((p, index) => (
            <div key={index}>
              <h3>
                <Link href={`/post/${p.slug.current}`}>
                  <a>{p.title}</a>
                </Link>
              </h3>
            </div>
          ))
        ) : (
          <div>No Post</div>
        )}
      </div>
    </>
  );
}

export const getServerSideProps = async (pageContext) => {
  const query = encodeURIComponent(`*[_type =="post"]`);
  const url = `https://a9m6v19w.api.sanity.io/v1/data/query/production?query=${query}`;

  const result = await fetch(url).then((res) => res.json());

  if (!result.result || !result.result.length) {
    return {
      props: {
        posts: [],
      },
    };
  } else {
    return {
      props: {
        posts: result.result,
      },
    };
  }
};
