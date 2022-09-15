import React, { useState } from "react";
import "./CreateExam.scss";


export default function CreateExam() {
    const [details, setDetails] = useState({
        name: "",
        description: "",
        duration: "",
        questions: [],
        language: [],
    });



    const handle = (e) => {
        setDetails((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }


    return (
        <div className={'create-exam-private'}>
            <div className="create-exam">
                <div>
                    <h1>Create Exams & Interview Tests</h1>
                    <div>
                        It never been easier to create programming exams and interview tests.<br/>
                        with a simple generator and a few clicks you can crete the perfect exam<br/>
                        and we will take care of the rest.
                    </div>
                </div>
            </div>

            <div className={'create-exam-form'}>

            </div>
        </div>
    );
}
