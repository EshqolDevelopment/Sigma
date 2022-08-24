import styles from "./seekBar.module.scss";


type Props = {
    steps: number;
    currentStep: number;
}

export default function SeekBarSinglePlayer(props: Props) {
    const arr = [];
    for (let i = 0; i < props.steps + 1; i++) {
        arr.push(<div className={[props.currentStep === props.steps ? styles.last : "", props.currentStep === i ? styles.current : ""].join(" ")}>
            {i === 0 && <img src={"/images/generic_programmer.png"} alt={"Current step"} style={{left: `calc(${props.currentStep}/${props.steps } * 100%)`}}/>}
        </div>);
    }

    return <div className={styles.seekBar}>
        {arr}
    </div>;
}
