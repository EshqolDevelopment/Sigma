import styles from "./waitingRoom.module.scss";

type Props = {
    code: string;

}

export default function WaitingRoom(props: Props) {

    const Players = [
        {
            name: "UserName",
            img: "9",
            score: 100
        },
        {
            name: "UserName",
            img: "2",
            score: 100
        },
        {
            name: "UserName",
            img: "5",
            score: 100
        }

    ]

    return (
        <div className={styles.container}>

            <div className={styles.playersContainer}>
                <span>{props.code}</span>

                {Players.map((player, index) => (
                    <div key={index} className={styles.playerRow}>
                        <span>Player {index + 1}</span>
                        <span>{player.name}</span>
                        <span>{player.score}</span>
                        <img src={`/images/p${player.img}.png`}/>
                    </div>
                ))}
            </div>

        </div>
    );

}
