import fs from "fs";
import path from "path";

const outputPublic = path.resolve(".output/public");

if (!fs.existsSync(outputPublic)) {
  fs.mkdirSync(outputPublic, { recursive: true });
}

// Check if index.html was generated in .output/public or root
let indexPath = path.join(outputPublic, "index.html");
if (!fs.existsSync(indexPath)) {
  const rootIndex = path.resolve("index.html");
  if (fs.existsSync(rootIndex)) {
    fs.copyFileSync(rootIndex, indexPath);
  }
}

const assetsDir = path.join(outputPublic, "assets");
const files = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir) : [];

const jsBundle = files.find((f) => f.startsWith("index-") && f.endsWith(".js"));
const cssBundle = files.find((f) => f.startsWith("styles-") && f.endsWith(".css"));

const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Kadha — Handwoven Sarees</title>
    <meta name="description" content="Kadha: a small, considered collection of handwoven sarees. The story begins here." />
    <link rel="icon" href="/logo/Favicon.png" type="image/png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=Figtree:wght@300;400;500;600&display=swap" rel="stylesheet" />
    ${cssBundle ? `<link rel="stylesheet" href="/assets/${cssBundle}" />` : ""}
  </head>
  <body>
    <div id="root"></div>
    ${jsBundle ? `<script type="module" src="/assets/${jsBundle}"></script>` : ""}
  </body>
</html>`;

fs.writeFileSync(path.join(outputPublic, "index.html"), htmlContent);
fs.writeFileSync(path.join(outputPublic, "404.html"), htmlContent);
fs.writeFileSync(path.join(outputPublic, "CNAME"), "kadha.shop\n");

console.log("Successfully generated index.html, 404.html, and CNAME in .output/public");
