import React from "react";

import { asset, renderStatic, Head } from "./shared";

export default ({ compilation }) => {
    const app = (
        <html lang="en">
            <Head>
                <title>Character Information Search</title>

                <link rel="stylesheet" href={asset(/css$/, compilation)} />
                <script defer src={asset(/search.*js$/, compilation)} />
            </Head>

            <body>
                <div id="app" />
            </body>
        </html>
    );

    return renderStatic(app);
};
