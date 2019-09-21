import React from "react";
import { render } from "react-dom";
import { Router, Link } from "@reach/router";
import Search from "./search";
import useResources from "./resources";

function Index() {
    return (
        <nav>
            <Link to="/search">search</Link>
        </nav>
    );
}

function Routes() {
    const parts = useResources();

    return (
        <Router>
            <Index path="/" />
            <Search path="/search" parts={parts} />
        </Router>
    );
}

render(<Routes />, document.querySelector("main"));
