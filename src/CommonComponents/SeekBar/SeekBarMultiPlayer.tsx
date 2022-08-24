import styles from "./seekBar.module.scss";
import {PlayersData} from "../../DataTypes";


type Props = {
    steps: number;
    currentStep: number;
    playersData: PlayersData;
}

export default function SeekBarSinglePlayer(props: Props) {
    const arr = [];

    for (let i = 0; i < props.steps + 1; i++) {
        arr.push(<div className={[props.currentStep === i ? styles.current : ""].join(" ")}>
            {i === 0 && <>
                {Object.keys(props.playersData).map((key, index) => {
                    return <img key={key} src={`/images/p${props.playersData[key].image}.png`} alt={"Current step"}
                         style={{left: `calc((${props.playersData[key].currentQuestion}/${props.steps})*100% + 15px*${index})`}}/>
                })}
            </>}
        </div>);
    }
    return <div className={styles.seekBar}>
        {arr}
    </div>;
}
