import React from "react";

import { assetLoader, renderStatic, Head } from "./shared";

export default ({ compilation }) => {
    const asset = assetLoader(compilation);

    const app = (
        <html lang="en">
            <Head>
                <title>Character Information Search</title>

                {/* TODO: crossorigin needs to match */}
                <link rel="preload" href={asset(/.wasm$/)} as="fetch" />

                <link rel="stylesheet" href={asset(/css$/)} />
                <script defer src={asset(/search.*js$/)} />
            </Head>

            <body>
                <div id="app" />
            </body>
        </html>
    );

    return renderStatic(app);
};
