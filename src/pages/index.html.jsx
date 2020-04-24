import React from "react";

import { assetLoader, renderStatic, Head } from "./shared";

export default ({ compilation }) => {
    const asset = assetLoader(compilation);

    const app = (
        <html lang="en">
            <Head>
                <title>Character Information</title>
                <script defer src={asset(/css$/)} />
            </Head>

            <body>
                <a href="/search">search</a>
                <a href="/chars">chars</a>
            </body>
        </html>
    );

    return renderStatic(app);
};
