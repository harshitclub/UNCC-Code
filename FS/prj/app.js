const fs = require("fs/promises");

(async () => {
  const createFile = async (path) => {
    try {
      // check if existing file present or not
      const existingFile = await fs.open(path, "r");
      existingFile.close();
      // we already have that file
      return console.log(`The file ${path} already exists.`);
    } catch (error) {
      // we don't have the file now we should create it.
      const newFile = await fs.open(path, "w");
      console.log("New file created.");
      newFile.close();
    }
  };
  // commands
  const CREATE_FILE = "create a file";

  const commandFileHandler = await fs.open("./command.txt", "r");

  commandFileHandler.on("change", async () => {
    //   get the size of our file
    const fileSize = (await commandFileHandler.stat()).size;
    // allocate our buffer with the size of our file
    const buff = Buffer.alloc(fileSize);
    // the location at which we want to start filling our buffer
    const offSet = 0;
    // how many bytes we want to read
    const length = buff.byteLength;
    // the position that we want to start reading the file from
    const position = 0;

    // we always want to read the whole content (from beginning all the way to the end)
    await commandFileHandler.read(buff, offSet, length, position);

    const command = buff.toString("utf-8");

    // create a file
    // create a file <path>
    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      createFile(filePath);
    }
  });

  // our watcher...
  const watcher = fs.watch("./command.txt");
  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
