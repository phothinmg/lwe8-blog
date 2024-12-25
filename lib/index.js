import { join, extname, basename, dirname } from "node:path";
import fs from "node:fs";
import express from "express";
import Converter from "showmark";
import showdownprism from "showdown-prism";
import { transform } from "lightningcss";
import compression from "compression";
import { exec } from "node:child_process";
import { icons } from "showmark/extensions";
//-------
// Config
// -------
// Construct the full path to the config file
const configPath = join(process.cwd(), "lwe8.config.js");
// Load the configuration file
const con = await import(configPath);
/** @type {import(".").Lwe8BlogConfig} */
const config = con.default;

const publicDir = config.publicdir ?? "public";
const publicPath = join(process.cwd(), publicDir);

// CSS
const cssFiles = fs
  .readdirSync(publicPath, { recursive: true })
  .filter((i) => extname(i) === ".css");

const getCssContent = () => {
  const cssContent = [];
  cssFiles.map((i) => {
    const cf = join(publicPath, i);
    const cont = fs.readFileSync(cf, "utf-8");
    cssContent.push(cont);
  });
  return cssContent.join("");
};

//const css_content = cssContent.join("");
function transformCss() {
  return transform({
    filename: "style.css",
    code: Buffer.from(getCssContent()),
    minify: true,
  }).code.toString();
}

// Converter
/**
 *
 * @param {string} filePath
 *
 */
const converter = (filePath) => {
  const content = fs.readFileSync(filePath, "utf-8");
  return new Converter(content, {
    showdownOptions: {
      openLinksInNewWindow: true,
      headerLevelStart: 2,
      extensions: [
        showdownprism({
          theme: "okaidia",
          languages: [
            "bash",
            "json",
            "ts",
            "c",
            "jsx",
            "tsx",
            "cpp",
            "csharp",
            "java",
            "typescript",
            "yaml",
          ],
        }),
        icons(),
      ],
    },
  }).rawHtml;
};
// Md files
const appDir = config.appdir ?? "app";
const appPath = join(process.cwd(), appDir);
/** @type {string[]} */
const mdFiles = fs
  .readdirSync(appPath, { recursive: true })
  .filter((i) => extname(i) === ".md");
// Md Routes
/**
 *
 * @param {string} filePath
 * @returns {string}
 */
const fileName = (filePath) => basename(filePath).split(".")[0];
/** @type {import("./index").Routes} */
const routes = [];
for (const file of mdFiles) {
  const fname = fileName(file);
  const parentPath = dirname(file);
  /** @type {import("./index").Route} */
  const route = {
    resurl:
      fname === "index" && parentPath === "."
        ? "/"
        : fname === "index" && parentPath !== "."
        ? `/${parentPath}`
        : fname !== "index" && parentPath === "."
        ? `/${fname}`
        : `/${parentPath}/${fname}`,
    filePath: `${appPath}/${file}`,
  };
  routes.push(route);
}
// Template =============================================================
/**
 *
 * @param {string} content
 * @returns
 */
const template = (content) => {
  const html = `
  <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="keywords" content="${
          config.metadata?.keywords.join(",") || ""
        }">
        <meta name="description" content="${
          config.metadata?.description || ""
        }}">
        <script src="https://kit.fontawesome.com/50c925d5df.js" crossorigin="anonymous"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
        />
        <link
        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
        rel="stylesheet"
        />
        <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap"
        rel="stylesheet"
        />
       <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
        <title>${config.metadata?.title ?? "Lwe8 Blog"}</title>
        <style>${transformCss()}</style>
    </head>
    <body>
      <nav>
        <ul>
        <li
           class="float-right themebtn"
            type="button"
            data-theme-toggle
            style="font-size: 18px;"
          ></li>
          <li class="logo"><a href="/" class="nav-link">${
            config.blogTitle ?? "Lwe8-Blog"
          }</a></li>
          ${config.navbar
            ?.map(
              (i) =>
                ` <li class="float-right"> <a href="${i.href}" class="nav-link">${i.name}</a> </li>`
            )
            .join("")}
           
        </ul>
        <hr />
      </nav>
        <main>
            <section>
              ${content}
            </section>
        </main>
       <footer>
        <p class="footp">
          ${
            new Date().getFullYear() + " " + "@" + " " + config.blogTitle ??
            "Lwe8 Blog"
          }
        </p>
        
      </footer>
      <script src="https://cdn.jsdelivr.net/gh/phothinmg/master-repo@main/honoblog/theme-button.min.js"></script>
    </body>
    </html>
    
  
  `;
  return html;
};
// Open Url ==============
const openUrl = (url) => {
  const start =
    process.platform === "darwin"
      ? "open"
      : process.platform == "win32"
      ? "start"
      : "xdg-open";

  exec(start + " " + url);
};
// Express ========
// middleware
/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const markdown = (req, res, next) => {
  for (const route of routes) {
    if (req.url === route.resurl) {
      const html = converter(route.filePath);
      const result = template(html);
      res.setHeader("content-type", "text/html");
      res.send(result);
    }
  }
  next();
};
// App ========================

export const server = () => {
  const app = express();
  const port = config.devserver?.port ?? 5457;
  app.use(express.static(publicPath));
  app.use(markdown);
  app.use(compression());
  return app.listen(port, () => {
    const urll = `http://localhost:${port}`;
    console.log(urll);
    if (config.devserver.open) {
      openUrl(urll);
    }
  });
};
