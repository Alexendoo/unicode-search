import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

export function asset(re, compilation) {
    const keys = Object.keys(compilation.assets);

    const matches = keys.filter((key) => re.test(key));

    if (matches.length === 0) {
        throw Error(`No match found ${re} for: ${keys.join(", ")}`);
    }
    if (matches.length > 1) {
        throw Error(`Multiple matches ${re} for: ${keys.join(", ")}`);
    }

    return matches[0];
}

export function Head({ children }) {
    return (
        <head>
            <meta charset="utf-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />

            {children}
        </head>
    );
}

export function renderStatic(app) {
    return `<!DOCTYPE html>\n${renderToStaticMarkup(app)}`;
}
