"use client";

export default function ShareButton() {
  return (
    <div className="dropdown-center">
      <button
        className="btn btn-outline-info dropdown-toggle w-100px h-50px"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Share
      </button>
      <ul className="dropdown-menu">
        <li>
          <a className="dropdown-item" href={"faceBookLink"} role="button">
            Facebook
          </a>
        </li>
        <li>
          <a className="dropdown-item" href={"twitterLink"} role="button">
            Twitter
          </a>
        </li>
        <li>
          <a className="dropdown-item" href={""} role="button">
            Copy link
          </a>
        </li>
      </ul>
    </div>
  );
}
