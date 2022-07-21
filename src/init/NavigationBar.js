import React from 'react';
import style from './Navigation.module.css';


const moveWindow = (page) => window.location.href = `/${page.toLowerCase()}`;

const isActive = (currentPage, page) => {
    if (currentPage === page) return true
    if (currentPage === '') return page === 'home'
    return false
}

export default function NavigationBar() {

    const pages = ['Home', 'Practice', 'Leaderboard', 'Compiler'];
    const currentPage = window.location.pathname.split('/')[1].toLocaleLowerCase();

    return (
        <div className={style.navigationBar}>
            <div>
                {pages.map((page, index) => {
                    return (
                        <div key={index} className={[style.page, isActive(currentPage.toLocaleLowerCase(), page.toLocaleLowerCase()) ? style.active : ""].join(" ")} onClick={() => moveWindow(page)}>
                            <span>{page}</span>
                        </div>
                    )
                })}
            </div>

            <img src={require("../Photos/p1.png")} className={style.profileImage} alt={"profile"}/>
        </div>
    );
}