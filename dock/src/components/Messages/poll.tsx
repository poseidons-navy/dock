"use client"
import {RxAvatar} from "react-icons/rx"
import { LeafPoll, Result } from 'react-leaf-polls'
import 'react-leaf-polls/dist/index.css'

function NormalPost() {
    return (<div>
    <RxAvatar/>
        <div>
            <p>Random Username</p>
            <p>Should we have a sex scene in our play Faceless beauty?</p>
            <div></div>
        </div>
    </div>);
}

export default NormalPost;