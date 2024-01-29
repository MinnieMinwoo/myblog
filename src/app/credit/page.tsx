import Image from "next/image";
import Link from "next/link";
import Footer from "components/Footer";
import HeaderSearch from "components/HeaderSearch";

export default function CreditPage() {
  const creditArray: [string, string[], "The MIT" | "Apache 2.0"][] = [
    ["aws-amplify", ["Amazon.com, Inc"], "Apache 2.0"],
    ["aws-jwt-verify", ["Amazon.com, Inc"], "Apache 2.0"],
    ["aws-sdk", ["Amazon.com, Inc"], "Apache 2.0"],
    ["bootstrap", ["The Bootstrap Authors"], "The MIT"],
    ["eslint", ["OpenJS Foundation and other contributors"], "The MIT"],
    ["jest", ["Meta Platforms, Inc. and affiliates"], "The MIT"],
    ["next", ["Vercel, Inc."], "The MIT"],
    ["react", ["Meta Platforms, Inc. and affiliates"], "The MIT"],
    ["react-dom", ["Meta Platforms, Inc. and affiliates"], "The MIT"],
    ["react-md-editor", ["Jed Watson"], "The MIT"],
    ["react-query", ["Tanner Linsley"], "The MIT"],
    ["react-syntax-highlighter", ["Conor Hastings"], "The MIT"],
    ["rehype-toc", ["James Messinger"], "The MIT"],
    ["rehype-highlight", ["Titus Wormer"], "The MIT"],
    ["rehype-sanitize", ["Titus Wormer"], "The MIT"],
    ["sass", ["2006–2023 the Sass team"], "Apache 2.0"],
    ["testing-library/jest-dom", ["Kent C. Dodds"], "The MIT"],
    ["testing-library/react", ["Kent C. Dodds"], "The MIT"],
    ["testing-library/user-event", ["Giorgio Polvara"], "The MIT"],
    ["typescript", ["Microsoft"], "Apache 2.0"],
    ["uuid", ["Robert Kieffer"], "The MIT"],
  ];

  return (
    <div className="Credit d-flex flex-column min-vh-100 overflow-x-hidden">
      <header>
        <nav className="navbar bg-white">
          <div className="container">
            <Link className="navbar-brand" href={"/"}>
              <Image className="me-2" src={"/logo.png"} width={40} height={40} alt="blog logo" />
            </Link>
            <HeaderSearch />
          </div>
        </nav>
      </header>
      <section className="flex-grow-1 ">
        <div className="row">
          <div className="col col-10 offset-1 col-lg-8 offset-lg-2 col-xxl-6 offset-xxl-3 mb-4">
            <h1 className="text-center mt-2 mb-4">Credit</h1>
            <p className="mt-2 mb-4">
              This application uses Open Source Components. You can find the source code of their open source projects
              along with license information below.
            </p>
            {creditArray.map(([title, authorArray, license]) => (
              <div key={title}>
                <h4>{title}</h4>
                {authorArray.map((author) => (
                  <p className="mb-1" key={author}>{`Copyright (c) ${author}`}</p>
                ))}
                <p className="mb-2">{`${license} license`}</p>
              </div>
            ))}
            <hr />
            <h3>License Texts</h3>
            <h5 className="mb-3">The MIT License</h5>
            <p>
              Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
              associated documentation files (the “Software”), to deal in the Software without restriction, including
              without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
              copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the
              following conditions:
            </p>
            <p>
              The above copyright notice and this permission notice shall be included in all copies or substantial
              portions of the Software.
            </p>
            <p>
              THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
              LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
              EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
              IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR
              THE USE OR OTHER DEALINGS IN THE SOFTWARE.
            </p>
            <h5 className="mb-3">Apache License</h5>
            <p>
              Licensed under the Apache License, Version 2.0 (the “License”); you may not use this file except in
              compliance with the License. You may obtain a copy of the License at
            </p>
            <Link className="text-primary text-decoration-none" href="http://www.apache.org/licenses/LICENSE-2.0">
              http://www.apache.org/licenses/LICENSE-2.0
            </Link>
            <p className="mt-3">
              Unless required by applicable law or agreed to in writing, software distributed under the License is
              distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
              See the License for the specific language governing permissions and limitations under the License.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
