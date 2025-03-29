import React from "react";
import WebsiteLogo from "./WebsiteLogo";
import NavLinks from "./NavLinks";

function Footer() {

    let year = new Date().getFullYear();

    return (
        <div className="container">
            <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                <p className="col-md-4 mb-0 text-body-secondary">© {year} MTurtleBase, Inc</p>

                <WebsiteLogo />

                <div className="footer-nav">
                    <NavLinks />
                </div>

            </footer>
        </div>
    );
}

export default Footer;
