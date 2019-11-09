import React from "react";
import { render } from "react-dom";
import { Router, Link } from "@reach/router";
import Search from "./search";
import useResources from "./resources";
import Chars from "./chars";

function Index() {
    return (
        <nav>
            <Link to="/search">search</Link>
            <Link to="/chars">chars</Link>
        </nav>
    );
}

function Routes() {
    const parts = useResources();

    return (
        <Router>
            <Index path="/" />
            <Search path="/search" parts={parts} />
            <Chars path="/chars" parts={parts} />
        </Router>
    );
}

render(<Routes />, document.querySelector("main"));
