import { Router, Link } from "@reach/router";
import React from "react";
import { render } from "react-dom";

import Chars from "./chars";
import useResources from "./resources";
import Search from "./search";

function Index() {
    return (
        <React.StrictMode>
            <nav>
                <Link to="/search">search</Link>
                <Link to="/chars">chars</Link>
            </nav>
        </React.StrictMode>
    );
}

function Routes() {
    const parts = useResources();

    if (!parts) {
        return <div>loading...</div>;
    }

    return (
        <Router>
            <Index path="/" />
            <Search path="/search" parts={parts} />
            <Chars path="/chars" parts={parts} />
        </Router>
    );
}

render(<Routes />, document.querySelector("main"));
