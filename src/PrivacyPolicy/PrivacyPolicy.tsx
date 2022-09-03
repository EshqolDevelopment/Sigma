import styles from "./privacyPolicy.module.scss";
import {useEffect} from "react";
import Footer from "../CommonComponents/Footer/Footer";


export default function PrivacyPolicy() {

    useEffect(() => {
        document.documentElement.style.setProperty("--background", "#1E90FFFF");
    }, [])

    return (
        <>
            <div className={styles.container}>
                <h1>Privacy Policy</h1>

                <p>
                    This Privacy Policy describes Our policies and procedures on the collection, use and, disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
                    <br/><br/>
                    We use Your Data to provide the Service. By using the Service, You agree to the collection and use of information following this Privacy Policy.
                    <br/><br/>
                    While using Our Service, We may ask You to provide Us with Personally identifiable information, only including:
                    <br/><br/>
                    (I) Email address
                    <br/><br/>
                    (II) First name and last name
                </p>

                <p>
                    This agreement applies to the Sigma Code Wars software that is installed on your device, or acquired from a retailer and installed by you,
                    <br/><br/>
                    the media on which you received the software, any icons, images or sound files included with the software, and also any updates, upgrades, supplements or services for the software, unless other terms come with them. It also applies to Eshqol Developments apps by Eshqol Developments.
                    <br/><br/>
                    Eshqol Developments reserve all rights (such as rights under intellectual property laws) and you may not
                    <br/><br/>
                    (I) work around any technical restrictions or limitations in the software
                    <br/><br/>
                    (II) make the software available for simultaneous use by multiple users over a network, install the software on a server and allow users to access it remotely.
                </p>
            </div>

            <Footer/>
        </>

    )
}
