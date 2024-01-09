//* Done
const fs = require("fs").promises;
const path = require("path");

const testFolder = "./clutter";

async function organizeFiles() {
  try {
    //* getting all the files.
    const files = await fs.readdir(testFolder);

    let filesArr = [];
    let extensions = [];
    let directoryCreationPromises = [];

    files.forEach((file) => {
      filesArr.push(file);
      let exts = path.extname(file);
      extensions.push(exts.slice(1));
    });

    //* making directories for all the extensions.
    extensions.forEach(async (extension) => {
      const directoryPath = path.join(testFolder, extension);

      try {
        await fs.access(directoryPath);
        console.log(
          `${extension} directory already exists, skipping creation.`
        );
      } catch (error) {
        directoryCreationPromises.push(
          fs.mkdir(directoryPath, { recursive: true })
        );
      }
    });

    await Promise.all(directoryCreationPromises);

    //* moving files to their respective directories.
    try {
      for (let i = 0; i < filesArr.length; i++) {
        const sourceFilePath = path.join(testFolder, filesArr[i]);
        const destinationDirectory = path.join(testFolder, extensions[i]);
        const destinationFilePath = path.join(
          destinationDirectory,
          filesArr[i]
        );

        await fs.rename(sourceFilePath, destinationFilePath);
        console.log(
          `${filesArr[i]} moved to ${extensions[i]} directory successfully`
        );
      }
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error("Error reading directory:", error);
  }

  console.log("Your files are now organized Enjoyy !!");
}

organizeFiles();
