const fs = require("fs/promises");

(async () => {
  try {
    await fs.copyFile("myFile.txt", "copied.txt");
  } catch (error) {
    console.log(error);
  }
})();

const fs = require("fs");

fs.copyFile("myFile.txt", "copies.txt", (error) => {
  if (error) {
    console.log(error);
  }
});

const fs = require("fs");

fs.copyFileSync("myFile.txt", "Copy.txt");
