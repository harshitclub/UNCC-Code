const fs = require("fs/promises");

(async () => {
  // commands
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete a file";
  const RENAME_FILE = "rename a file";
  const ADD_TO_FILE = "add to the file";
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
  const deleteFile = async (path) => {
    try {
      await fs.unlink(path);
      console.log(`File removed successfully.`);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log(`No file at this path to remove.`);
      } else {
        console.log(`An error occured while removing the file...`);
        console.log(error);
      }
    }
  };

  const renameFile = async (oldPath, newPath) => {
    try {
      await fs.rename(oldPath, newPath);
      console.log("The file was successfully renamed.");
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log(`No file at this path to rename.`);
      } else {
        console.log(`An error occured while removing the file...`);
        console.log(error);
      }
    }
  };
  let addedContent;

  const addToFile = async (path, content) => {
    if (addedContent === content) return;
    try {
      const fileHandle = await fs.open(path, "a");
      fileHandle.write(content);
      addedContent = content;
      console.log("The content was added successfully.");
    } catch (e) {
      console.log("An error occurred while removing the file: ");
      console.log(e);
    }
  };

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

    // delete a file
    // delete a file <path>
    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath);
    }

    // rename file:
    // rename the file <path> to <new-path>
    if (command.includes(RENAME_FILE)) {
      const idx = command.indexOf(" to ");
      const oldPath = command.substring(RENAME_FILE.length + 1, idx);
      const newPath = command.substring(idx + 4);
      renameFile(oldPath, newPath);
    }

    // add to file:
    // add to the file <path> this content: <content>
    if (command.includes(ADD_TO_FILE)) {
      const idx = command.indexOf(" this content: ");
      const path = command.substring(ADD_TO_FILE.length + 1, idx);
      const content = command.substring(idx + 15);
      addToFile(path, content);
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
