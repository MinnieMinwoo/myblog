import Footer from "components/Footer";
import HeaderSearch from "components/HeaderSearch";
import Image from "next/image";
import Link from "next/link";

export default function TermsPage() {
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
            <h1 className="text-center mt-2 mb-4">TERMS OF SERVICE AGREEMENT</h1>
            <p className="mt-2 mb-4">
              {`This Terms of Service Agreement ("Agreement") is entered into between myblog-backend.firebaseapp.com
                ("ourwebsite") and the user ("User" or "You") of the myBlog ("Service"). By accessing or using the
                Service, You agree to be bound by the terms and conditions outlined in this Agreement.`}
            </p>
            <h5 className="mb-3">1. Acceptance of Terms</h5>
            <p>
              {`By accessing or using the Service, You acknowledge that You have read, understood, and agree to be bound
by this Agreement. If You do not agree with any part of this Agreement, You must not use the Service.
`}
            </p>
            <h5 className="mb-3">2. User Responsibilities</h5>
            <p>
              {`a. Account: You may be required to create an account to access certain features of the Service. You are
              responsible for maintaining the confidentiality of Your account credentials and for all activities
              conducted through Your account.`}
            </p>
            <p>
              {`b. Compliance: You agree to comply with all applicable laws, regulations, and third-party agreements while
              using the Service. You shall not use the Service for any illegal, fraudulent, or unauthorized purposes.`}
            </p>
            <h5 className="mb-3">3. Intellectual Property</h5>
            <p>
              {`a. Ownership: The Service and all related content, including but not limited to software, trademarks,
              logos, and documentation, are the exclusive property of our website or its licensors. You are granted a
              limited, non-transferable, and non-exclusive license to use the Service solely for Your personal,
              non-commercial use.`}
            </p>
            <p>
              {`b. Restrictions: You shall not modify, copy, distribute, transmit, display, perform, reproduce, publish,
              license, create derivative works from, transfer, or sell any information, software, products, or services
              obtained from the Service without the prior written consent of our website.`}
            </p>
            <h5 className="mb-3">4. Disclaimer of Warranties</h5>
            <p>
              {`a. This Service is provided on an "as is" and "as available" basis, without warranties of any kind, either
              expressed or implied. Our website disclaims all warranties, including but not limited to merchantability,
              fitness for a particular purpose, and non-infringement.`}
            </p>
            <p>
              {`b. Our website does not warrant that the Service will be uninterrupted, error-free, secure, or free from
              viruses or other harmful components. You acknowledge and agree that the use of the Service is at Your own
              risk.`}
            </p>
            <h5 className="mb-3">5. Limitation of Liability</h5>
            <p>
              {`To the maximum extent permitted by applicable law, Our website shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, including but not limited to lost profits, data
              loss, or business interruption, arising out of or in connection with the use of the Service.`}
            </p>
            <h5 className="mb-3">6. Modification and Termination</h5>
            <p>
              {`Our website reserves the right to modify, suspend, or terminate the Service or this Agreement at any time,
              with or without notice. You agree that our website shall not be liable to You or any third party for any
              modification, suspension, or termination of the Service or this Agreement.`}
            </p>
            <h5 className="mb-3">7. Governing Law and Jurisdiction</h5>
            <p>
              {`This Agreement shall be governed by and construed in accordance with the laws of South Korea. Any disputes
              arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the
              courts located in South Korea.`}
            </p>
            <h5 className="mb-3">8. Indemnification</h5>
            <p>
              {`You agree to indemnify, defend, and hold harmless our website and its affiliates, directors, employees,
              agents, and suppliers from and against any and all claims, liabilities, damages, losses, costs, and
              expenses, including reasonable attorney's fees, arising out of or in connection with Your use of the
              Service, Your violation of this Agreement, or Your violation of any rights of another party.`}
            </p>
            <h5 className="mb-3">9. Third-Party Links and Content</h5>
            <p>
              {`The Service may contain links to third-party websites, applications, or services that are not owned or
              controlled by our website. Our website does not endorse or assume any responsibility for the content,
              privacy policies, or practices of any third-party websites or services. You acknowledge and agree that our
              website shall not be liable for any damages or losses arising from Your use of or reliance on any
              third-party content or services.`}
            </p>
            <h5 className="mb-3">10. Severability</h5>
            <p>
              {`If any provision of this Agreement is found to be unenforceable or invalid, that provision shall be
              limited or eliminated to the minimum extent necessary so that the remaining provisions of this Agreement
              shall remain in full force and effect.`}
            </p>
            <h5 className="mb-3">11. Entire Agreement</h5>
            <p>
              {`This Agreement constitutes the entire agreement between You and our website regarding the subject matter
              hereof and supersedes all prior or contemporaneous agreements, understandings, and representations,
              whether oral or written.`}
            </p>
            <h5 className="mb-3">12. Severability</h5>
            <p className="mb-4">
              {`The failure of our website to enforce any right or provision of this Agreement shall not constitute a
              waiver of such right or provision unless acknowledged and agreed to by our website in writing.`}
            </p>
            <p className="mt-4 mb-3">
              {`By using the Service, You acknowledge that You have read, understood, and agree to be bound by this Terms
              of Service Agreement. If You do not agree with any part of this Agreement, You must not use the Service.`}
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
