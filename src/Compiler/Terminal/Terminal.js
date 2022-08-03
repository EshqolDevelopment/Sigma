import React from "react";
import './Terminal.css';

export default function Terminal() {

    const array = ['hello', 'world', 'this is my word', 'terminal'];


    return (
        <div className="terminal">

            <div className={'terminal-header'}>
                <div>
                    <span/>
                    <span/>
                    <span/>
                </div>
            </div>

            <div className={'terminal-body'}>
                <div>
                    { array.map((item, index) =>
                        <div key={index}>
                            <span/>
                            <span>{item}</span>
                        </div>
                    )}
                    <span>$<span> |</span></span>
                </div>
            </div>
        </div>
    )
}
