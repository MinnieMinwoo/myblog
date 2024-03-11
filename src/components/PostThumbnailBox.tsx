"use client";
import getDate from "logics/getDate";
import Image from "next/image";
import Link from "next/link";
import useColorScheme from "logics/useColorScheme";

export default function PostThumbnailBox({ postList }: { postList: PostThumbnail[] }) {
  const { colorScheme } = useColorScheme();

  return (
    <article className="PostItemList vstack" hidden={false}>
      {postList.map((post) => (
        <div className="w-100" key={post.id}>
          <Link
            className="PostItem px-0 py-4 d-flex text-decoration-none bt-light"
            key={post.id}
            href={`/home/${post.createdNickname}/${post.id}`}
          >
            <div className="vstack gap-1">
              {post.thumbnailImageURL ? (
                <div className="w-100 ratio ratio-16x9 mb-3">
                  <Image
                    className="img-fluid object-fit-cover"
                    src={post.thumbnailImageURL}
                    alt="post"
                    width={1000}
                    height={1000}
                  />
                </div>
              ) : null}
              <h3 className={`overflow-hidden fw-semibold ${colorScheme === "dark" ? "text-eee" : "text-111"} `}>
                {post.title}
              </h3>
              <p className={`mb-1 text-break ${colorScheme === "dark" ? "text-999" : "text-555"}`}>
                {post.thumbnailData}
              </p>
              <div className="col">
                {post.tag.map((tag) => (
                  <button
                    key={tag}
                    className={`btn ${colorScheme === "dark" ? "btn-outline-info" : "btn-outline-primary"} me-1`}
                    onClick={() => {}}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <span className={`fs-14px ${colorScheme === "dark" ? "text-999" : "text-777"}`}>
                {getDate(post.createdAt)}
              </span>
            </div>
          </Link>
        </div>
      ))}
    </article>
  );
}
