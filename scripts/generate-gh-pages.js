import fs from "fs";
import path from "path";

const outputPublic = path.resolve(".output/public");

if (!fs.existsSync(outputPublic)) {
  fs.mkdirSync(outputPublic, { recursive: true });
}

let indexPath = path.join(outputPublic, "index.html");
if (!fs.existsSync(indexPath)) {
  const rootIndex = path.resolve("index.html");
  if (fs.existsSync(rootIndex)) {
    fs.copyFileSync(rootIndex, indexPath);
  }
}

// Read original index.html built by Vite
let indexContent = fs.readFileSync(indexPath, "utf-8");

// Ensure cache-control meta tags exist in head
if (!indexContent.includes("Cache-Control")) {
  indexContent = indexContent.replace(
    "<head>",
    `<head>\n    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />\n    <meta http-equiv="Pragma" content="no-cache" />\n    <meta http-equiv="Expires" content="0" />`
  );
  fs.writeFileSync(indexPath, indexContent);
}

// Write 404.html as a copy of index.html for Single Page Application routing
fs.writeFileSync(path.join(outputPublic, "404.html"), indexContent);
fs.writeFileSync(path.join(outputPublic, "CNAME"), "kadha.shop\n");
fs.writeFileSync(path.join(outputPublic, ".nojekyll"), "");

// Copy entire build folder to dist output as well
const distPublic = path.resolve("dist");
if (fs.existsSync(distPublic)) {
  fs.rmSync(distPublic, { recursive: true, force: true });
}
fs.cpSync(outputPublic, distPublic, { recursive: true });

console.log("Successfully prepared index.html, 404.html, CNAME, and .nojekyll in .output/public and dist");
