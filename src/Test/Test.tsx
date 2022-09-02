import styles from "./test.module.scss";
import React, {useContext} from "react";
import {GlobalContext} from "../Global";
import Question from "../CommonComponents/Question/Question";
import {Helmet} from "react-helmet";

type Props = {

}

export default function Test(props: Props) {
    const globalContext = useContext(GlobalContext);


    return (
        <div className={styles.container}>

            <Helmet>
                <title>Test 1121 | Sigma Code Wars</title>
            </Helmet>


            <Question funcName={"bigger_than_5"} />

        </div>
    )
}
