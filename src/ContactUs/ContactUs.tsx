import contactStyle from "./ContactUs.module.scss";
import React, {useContext, useEffect, useState} from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {GlobalContext, postRequest} from "../Global";
import Footer from "../CommonComponents/Footer/Footer";
import {Helmet} from "react-helmet";


export default function ContactUs() {
    useEffect(() => {
        document.documentElement.style.setProperty("--background", "#1E90FFFF");
    }, [])

    const [topic, setTopic] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [captcha, setCaptcha] = useState("");
    const [waitingForServerResponse, setWaitingForServerResponse] = useState(false);
    const globalContext = useContext(GlobalContext);

    function onReChange(value) {
        setCaptcha(value);
    }

    async function sendForm() {
        return await postRequest("/contact-us", {
            topic: topic,
            name: name,
            email: email,
            message: message,
            captcha: captcha,
        });
    }

    async function submit(e) {
        e.preventDefault();

        setWaitingForServerResponse(true);
        const data = await sendForm() as {result: string};
        setWaitingForServerResponse(false);

        if (data.result === "OK") {
            globalContext.showToast("Your message has been sent.", "success");
            setTopic("");
            setName("");
            setEmail("");
            setMessage("");

        } else if (data.result === "Invalid captcha") {
            globalContext.showToast("Please verify that you are not a robot.", "error");

        } else {
            globalContext.showToast("An unexpected error occurred. Please try again later.", "error");
        }
    }


    return (
        <div className={contactStyle.container}>

            <Helmet>
                <title>Contact Us | Sigma Code Wars</title>
                <meta name={"description"} content={"Contact us page of Sigma Code Wars"}/>
            </Helmet>


            <main className={contactStyle.contactBox}>

                <div className={contactStyle.title}>Contact us</div>
                <div className={contactStyle.smallTitle}>How can we help ?</div>

                <form className={contactStyle.form} onSubmit={submit}>
                    <div>
                        <div className={contactStyle.subTitle}>Topic</div>
                        <select name="topic" className={[contactStyle.input, contactStyle.topic].join(" ")} required={true} value={topic} onChange={(e) => setTopic(e.target.value)}>
                            <option value="" disabled={true} >Option</option>
                            <option value="suggestion">Suggestion</option>
                            <option value="feedback">Feedback</option>
                            <option value="transfer problem">Collaborations</option>
                            <option value="Collaborations">Other</option>
                        </select>
                    </div>

                    <div>
                        <div  className={contactStyle.subTitle}>Your name</div>
                        <input type={"text"} className={contactStyle.input} required={true} value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>

                    <div>
                        <div  className={contactStyle.subTitle}>Your email</div>
                        <input type={"email"} className={contactStyle.input} required={true} value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div>
                        <div  className={contactStyle.subTitle}>Your message</div>
                        <textarea className={[contactStyle.message, contactStyle.input].join(" ")} placeholder={"Type Your Message"} required={true} value={message} onChange={(e) => setMessage(e.target.value)}/>
                    </div>


                    <div className={contactStyle.recaptcha}>
                        <ReCAPTCHA sitekey={"6Lcuk8shAAAAAAWsrGfxeW7xO6ezmdh2-5UQNbml"} onChange={onReChange}/>
                    </div>

                    <div className={contactStyle.sendContainer}>
                        <button className={[contactStyle.sendBtn].join(' ')} disabled={waitingForServerResponse}>Send Message</button>
                    </div>
                </form>
            </main>

            <Footer/>
        </div>

    );

}
