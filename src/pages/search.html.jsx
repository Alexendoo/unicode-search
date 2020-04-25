import React from "react";

import { assetLoader, renderStatic, Head } from "./shared";

export default ({ compilation }) => {
    const asset = assetLoader(compilation);

    const FetchPreload = ({ re }) => (
        <link
            rel="preload"
            href={asset(re)}
            as="fetch"
            crossOrigin="anonymous"
        />
    );

    const app = (
        <html lang="en">
            <Head>
                <title>Character Information Search</title>

                <FetchPreload re={/wasm$/} />
                <FetchPreload re={/codepoints.*bin$/} />
                <FetchPreload re={/names.*txt$/} />

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
