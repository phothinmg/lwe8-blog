//2024 May 8 , at Taungyi , Myanmar
/** 
   
   @license

   Copyright [2024] [Pho Thin Maung]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

import Showdown from "showdown";
import type { ShowdownExtension } from "showdown";
import Prism from "prismjs";
import Module from "node:module";
import pkg from "he";
const { decode } = pkg;

//
const require = Module.createRequire(import.meta.url);
const loadLanguages = require("prismjs/components/");

const lang = (text: string): string => {
    const m = text.match(/class="([^" ]+)/);
    return m ? m[1] : "";
};
export type ThemeType =
    | "actom-dark"
    | "cb"
    | "coldark-dark"
    | "dark"
    | "holi-theme"
    | "duotone-earth"
    | "duotone-forest"
    | "duotone-light"
    | "duotone-sea"
    | "duotone-space"
    | "funky"
    | "ghcolors"
    | "gruvbox-light"
    | "laserwave"
    | "lucario"
    | "night-owl"
    | "okaidia"
    | "one-dark"
    | "one-light"
    | "solarized-dark-atom"
    | "synthwave84"
    | "tomorrow"
    | "twilight"
    | "vs"
    | "vsc-dark-plus"
    | "z-touch";
const themes: string[] = [
    "actom-dark",
    "cb",
    "coldark-dark",
    "dark",
    "holi-theme",
    "duotone-earth",
    "duotone-forest",
    "duotone-light",
    "duotone-sea",
    "duotone-space",
    "funky",
    "ghcolors",
    "gruvbox-light",
    "laserwave",
    "lucario",
    "night-owl",
    "okaidia",
    "one-dark",
    "one-light",
    "solarized-dark-atom",
    "synthwave84",
    "tomorrow",
    "twilight",
    "vs",
    "vsc-dark-plus",
    "z-touch",
];
const defaultTheme: string = "okaidia";

export interface ShowdownPrismOptions {
    languages?: string[];
    theme?: ThemeType;
}

/**
 * A Showdown extension for Prism.js.
 * ---
 * This extension adds syntax highlighting to code blocks in markdown documents
 * using Prism.js. This extension is meant to be used with the Showdown library.
 * 
 * 
 * **Options** 
 * 
 * **1.languages ? :  string[ ]**
 * 
   - Prismjs will load the default languages: markup, css, clike and javascript.

   - You can load more languages with the `options.languages`.
        If you use Webpack or another bundler , do not set `options.languages`.
 * 
 * **2.theme ? : string**
 *   
 * - Available themes can be see in README.md


 * @example
 * 
 * import showdown from "showdown";
        import showdownprism from "showdown-prism";
        // Add extension to showdown options
        const converter = new showdown.Converter({
        extensions: [showdownPrism({
                    languages: ["bash"],
                    theme: "holi-theme",
                }),],
        });
        // Convert to HTML
        const convertedContent = converter.makeHtml("Markdown_contents")
 */
const showdownPrism = (
    options?: ShowdownPrismOptions
): ShowdownExtension | ShowdownExtension[] => {
    const langs: string[] = options?.languages ?? [];

    const theme: string = options?.theme ?? `${defaultTheme}`;
    loadLanguages(langs);

    const params = {
        left: "<pre><code\\b[^>]*>",
        right: "</code></pre>",
        flags: "g",
    };
    const replacement = (
        wholematch: string,
        match: string,
        left: string,
        right: string
    ) => {
        match = decode(match);
        const lan = lang(left);
        if (lan !== "") {
            left = `<pre class="language-${lan}"><code class="language-${lan}">`;
            right = `</code></pre>`;
            const highlighted = Prism.highlight(
                match,
                Prism.languages[lan],
                lan
            );
            return left + highlighted + right;
        } else {
            return wholematch;
        }
    };

    return [
        {
            type: "output",

            /**
             * A function that filters the given text using the Showdown helper's replaceRecursiveRegExp method.
             *
             */
            filter: (
                text: string,
                converter: Showdown.Converter,
                options: any
            ): string => {
                return Showdown.helper.replaceRecursiveRegExp(
                    text,
                    replacement,
                    params.left,
                    params.right,
                    params.flags
                );
            },
        },
        {
            type: "output",
            filter: (
                text: string,
                converter: Showdown.Converter,
                options: any
            ) => {
                const scriptTag = `
                <script>
                function loadTheme(){
                 const themeLink = \`https://cdn.jsdelivr.net/gh/phothinmg/prism-themes@main/theme/${theme}.min.css\`;
                 const themeEl = window.document.createElement("link");
                themeEl.setAttribute("rel", "stylesheet");
                themeEl.setAttribute("href", themeLink);
                window.document.head.appendChild(themeEl);
                };
                loadTheme();
                </script>
                `;
                return text + scriptTag;
            },
        },
    ];
};

Showdown.extension("showdownPrism", showdownPrism());

export default showdownPrism;
