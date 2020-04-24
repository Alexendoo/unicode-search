import React from "react";

import { asset, renderStatic, Head } from "./shared";

export default ({ compilation }) => {
    const app = (
        <html lang="en">
            <Head>
                <title>Character Information</title>
                <script defer src={asset(/css$/, compilation)} />
            </Head>

            <body>
                <a href="/search">search</a>
                <a href="/chars">chars</a>
            </body>
        </html>
    );

    return renderStatic(app);
};
