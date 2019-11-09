import React, { useState } from "react";
import InputBar from "./input-bar";
import CharEntry from "./char-entry";

export default function Chars({ parts }) {
    const [chars, setChars] = useState("");

    return (
        <div>
            <InputBar value={chars} onChange={setChars} />
            <div>
                {[...chars].map((char, key) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <CharEntry char={char} parts={parts} key={key} />
                ))}
            </div>
        </div>
    );
}
