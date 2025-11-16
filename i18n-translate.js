import translate from "translate-google";
import { readdir } from "fs/promises";
import path from "path";
import fs from "fs";

console.log("Translating ...");
const listoflang = ["es", "fr", "ja", "hi", "mr"];

const dir = path.resolve("locales", "en");

(async () => {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const filePaths = entries
      .filter((e) => e.isFile())
      .map((e) => path.join(dir, e.name));
    console.log(filePaths);

    for (const filePath of filePaths) {
      fs.readFile(filePath, "utf8", (err, jsonString) => {
        if (err) {
          console.error("Error reading file:", err);
          return;
        }
        try {
          const data = JSON.parse(jsonString);
          console.log(data);

          listoflang.forEach(async (lang) => {
            const outDir = path.resolve("locales", lang);
            // fs.mkdir(outDir, { recursive: true });
            const outFile = path.join(outDir, path.basename(filePath));
            console.log(outFile);
            translate(data, { to: lang })
              .then((fileData) => {
                console.log(fileData);
                fs.writeFile(
                  outFile,
                  JSON.stringify(fileData, null, 2),
                  (err) => {
                    if (err) {
                      console.error("Error writing file:", err);
                      return;
                    }
                    console.log(
                      `Written translated file to ${outFile} ${lang}`
                    );
                  }
                );
              })
              .catch((err) => {
                console.error(err);
              });
          });
        } catch (err) {
          console.error("Error parsing JSON:", err);
        }
      });
    }
  } catch (err) {
    console.error("Failed to read directory:", err);
  }
})();
