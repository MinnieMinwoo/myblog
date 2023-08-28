import getDate from "logics/getDate";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PostThumbnailBox({ postList }: { postList: PostThumbnail[] }) {
  const params = useParams();

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
              <h3 className="overflow-hidden fw-semibold text-111">{post.title}</h3>
              <p className="mb-1 text-break text-555">{post.thumbnailData}</p>
              <div className="col">
                {post.tag.map((tag) => (
                  <button key={tag} className="btn btn-outline-primary me-1" onClick={() => {}}>
                    {tag}
                  </button>
                ))}
              </div>
              <span className="fs-14px text-999">{getDate(post.createdAt)}</span>
            </div>
          </Link>
        </div>
      ))}
    </article>
  );
}
