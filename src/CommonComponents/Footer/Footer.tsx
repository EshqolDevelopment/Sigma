import styles from "./footer.module.scss";
import {Link} from "react-router-dom";



export default function Footer() {


    return (
        <footer className={styles.container}>
            <div className={styles.pages}>
                <Link className={styles.link} to={'/home'}>Home</Link>
                <div/>
                <Link className={styles.link} to={"/play"}>Play</Link>
                <div/>
                <Link className={styles.link} to={'/practice'}>Practice</Link>
                <div/>
                <Link className={styles.link} to={'/leaderboard'}>Leaderboard</Link>
                <div/>
                <Link className={styles.link} to={'/compiler'}>Compiler</Link>
                <div/>
                <Link className={styles.link} to={'/privacy-policy'}>Privacy Policy</Link>
                <div/>
                <Link className={styles.link} to={'/contact-us'}>Contact Us</Link>
            </div>

            <div className={styles.copyRight}>
                <span>Copyright © 2021-{new Date().getFullYear()} Eshqol Development LLC. All rights reserved.</span>
            </div>
        </footer>
    )
}


