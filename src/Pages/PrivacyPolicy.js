import Footer from "../Common/Layouts/Footer";
import Header from "../Common/Layouts/Header";
import SideBar from "../Common/Layouts/SideBar";
export default function PrivacyPolicy() {
    return (
        <div id="layout-wrapper" className="card">
            <div className="main-content card">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row card">
                            <div className="col-xl-12">
                                <h4>Privacy Policy</h4>
                                <p>Effective Date: 20 September 2024</p>

                                <p>We value your privacy and are committed to protecting it. This Privacy Policy outlines how our website/app handles your data and provides transparency on our practices.</p>

                                <p><b>1. No Personal Information Collection</b></p>
                                <p>We do not collect any personal information such as your name, email address, phone number, or physical address while you use our website/app.</p>

                                <p><b>2. Cookies and Tracking</b></p>
                                <p>Our website/app does not use cookies, tracking scripts, or similar technologies to gather any information about you, your device, or your browsing activities.</p>

                                <p><b>3. Third-Party Links</b></p>
                                <p>Our website/app may contain links to third-party websites. These websites may have their own privacy policies. We are not responsible for the content or privacy practices of these websites.</p>

                                <p><b>4. Data Security</b></p>
                                <p>Since we do not collect any personal information, we do not store or process any data related to you. However, we implement appropriate measures to ensure that our website/app is secure and protected from unauthorized access or data breaches.</p>

                                <p><b>5. Changes to This Privacy Policy</b></p>
                                <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated effective date.</p>

                                <p><b>6. Contact Us</b></p>
                                <p>If you have any questions or concerns about our Privacy Policy, feel free to contact us at hydroid.iot@gmail.com.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer></Footer>
            </div>
        </div>
    );
}