import React, {useEffect} from "react";
import './Explore.scss';
import Footer from "../../CommonComponents/Footer/Footer";
import {useQuery} from "react-query";
import {postRequest} from "../../Global";
import {Exam} from "../../DataTypes";
import ExamItem from "./ExamItem";

export default function Explore() {


    const {data} = useQuery<{[key: string]: Exam[]}>(["exams-list"], async () => {
        const res = await postRequest("/exams/getList", {}) as Exam[];
        console.log(res)

        const json = {}
        for (const exam of res) {
            if (!json[exam.type]) json[exam.type] = []
            json[exam.type].push(exam)
        }
        return json
    });

    useEffect(() => {
        document.documentElement.style.setProperty("--background", "white");
        // console.log(123)
        // postRequest("/exams/getList", {}).then(r => {
        //     console.log(r)
        // })
    }, [])


    return (
        <div>
            <div className={'explore-exams'}>
                <h1>10+ Professional Computer Science Exams</h1>
                <h2>Explore our exams and solve them to test and improve your skills and knowledge.</h2>
                <input type="text" placeholder={'Search for an exam...'}/>
            </div>

            <div className={'exams-table'}>
                {
                    data && Object.keys(data).map((key) => (
                        <div>
                            <span className={'table-title'}>{key} - 0/{data[key].length}</span>
                            <div className={'exams-list'}>
                                {data[key].map((exam) => (<ExamItem exam={exam} type={key}/>))}
                            </div>
                        </div>
                    ))
                }

                {/*<div>*/}
                {/*    <span className={'table-title'}>{'Easy'} - 0/100</span>*/}

                {/*    <div className={'exams-list'}>*/}
                {/*        {data.map((exam, index) => (*/}

                {/*        ))}*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<GetExams type={'easy'}/>*/}
                {/*<GetExams type={'hard'}/>*/}
                {/*<GetExams type={'popular'}/>*/}
            </div>

            <Footer/>
        </div>
    );
}