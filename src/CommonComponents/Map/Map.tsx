import React from 'react';
import "./map.scss"



export default function Map() {
    return (
        <div className={'map-wrapper'}>
            <div className={'map'}>
                <img className={'background-img'} src={'/map/river-background.jpg'} alt={'river-background'}/>
                <img className={'canoe'} src={'/map/canoe.png'} alt={'canoe'} id={'canoe'}/>

                {Array(9).fill(0).map((_, index) => (
                    <div className={'bubble'}>
                        <img src={"/map/code.png"} alt={'snake'}/>
                        <img src={"/map/lock.png"} alt={'lock'}/>
                    </div>
                ))}
            </div>
        </div>
    )
}
