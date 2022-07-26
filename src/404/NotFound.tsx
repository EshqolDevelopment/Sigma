import styles from "./notFound.module.scss";
import {Link} from "react-router-dom";
import React, {useEffect} from "react";
import {Helmet} from "react-helmet";

export default function NotFound() {

    useEffect(() => {
        document.documentElement.style.setProperty("--background", "white");
    }, [])

    return (
        <div className={styles.notFoundContainer}>

            <Helmet>
                <title>404 | Sigma Code Wars</title>
            </Helmet>

            <div>
                <img src={"/images/404.png"}/>
                <div>
                    <h2>Page Not Found</h2>
                    <p>Sorry, but we can't find the page you are looking for...</p>

                    <Link className={styles.homeLink} to={"/home"}>Back to Home</Link>
                </div>
            </div>

        </div>
    )

}
