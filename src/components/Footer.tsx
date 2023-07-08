import Link from "next/link";

const Footer = () => {
  const ListComponent = ({ name, link }: { name: string; link: string }) => {
    return (
      <li className="mb-2">
        <Link href={link} className="text-333 text-decoration-none">
          {name}
        </Link>
      </li>
    );
  };

  return (
    <footer className="HomeFooter">
      <nav className="navbar bg-secondary">
        <div className="container align-items-start pt-2 col">
          <div className="col-12 col-md-4 mb-2 mb-md-0">
            <p className="my-1 fs-14px text-333">2023 My own blog project</p>
            <p className="my-1 fs-14px text-333">© Snowcat</p>
          </div>
          <div>
            <h5>Links</h5>
            <ul className="list-unstyled">
              <ListComponent name="Home" link="/" />
              <ListComponent name="Auth" link="/auth" />
              <ListComponent name="Search" link="/search?query=" />
            </ul>
          </div>
          <div>
            <h5>More</h5>
            <ul className="list-unstyled">
              <ListComponent name="Source Code" link="https://github.com/MinnieMinwoo/myBlog_Frontend" />
              <ListComponent name="Contact" link="mailto:nhs075241@gmail.com" />
            </ul>
          </div>
          <div>
            <h5>Legal</h5>
            <ul className="list-unstyled">
              <ListComponent name="Terms" link="/terms" />
              <ListComponent name="Credit" link="/credit" />
            </ul>
          </div>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
