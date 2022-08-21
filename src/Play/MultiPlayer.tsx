import React, {useState} from "react";
import WaitingRoom from "./WaitingRoom";
import {InviteOrJoin} from "./InviteOrJoin";

type Props = {}

export function MultiPlayer(props: Props) {
    const [code, setCode] = useState("");


    return <div>

        {!code && <InviteOrJoin onSubmit={setCode}/>}

        {code && <WaitingRoom code={code}/>}

    </div>;
}
