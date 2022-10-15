import "./selectQuestionsNum.scss";
import {useState} from "react";

type Props = {
    onSubmit: (numberOfQuestions: number) => void;
    gap?: string;
}

export default function SelectQuestionsNum(props: Props) {
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = () => {
        setIsLoading(true)
        const val = (document.querySelector('input[name="debt-amount"]:checked') as HTMLInputElement).value;
        props.onSubmit(parseInt(val))
    }

    return (
        <div className={"form-wrapper"}>
            <form onSubmit={onSubmit} >
                <h1 id={"form-title"} style={{marginBottom: props.gap || 0}}>Select number of questions</h1>
                <div id={"debt-amount-slider"}>
                    <input type="radio" name="debt-amount" id={"1"} defaultValue={1} required={true} />
                    <label htmlFor={"1"} data-debt-amount={1} />
                    <input type="radio" name="debt-amount" id={"2"} defaultValue={2} required={true} />
                    <label htmlFor={"2"} data-debt-amount={2} />
                    <input type="radio" name="debt-amount" id={"3"} defaultValue={3} required={true} />
                    <label htmlFor={"3"} data-debt-amount={3} />
                    <input type="radio" name="debt-amount" id={"4"} defaultValue={4} required={true} />
                    <label htmlFor={"4"} data-debt-amount={4} />
                    <input type="radio" name="debt-amount" id={"5"} defaultValue={5} required={true} />
                    <label htmlFor={"5"} data-debt-amount={5} />
                    <div id={"debt-amount-pos"}/>
                </div>
            </form>
            <button type={"submit"} className={isLoading ? "select-question-loading-btn" : ""} onClick={onSubmit}>Start Playing</button>
        </div>
    );
}
