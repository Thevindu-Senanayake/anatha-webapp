import fs from "fs";

const readFileAsDataURL = (filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const dataUrl = `data:${getMimeType(filename)};base64,${data.toString(
          "base64"
        )}`;
        resolve(dataUrl);
      }
    });
  });
};

const getMimeType = (filename: string): string => {
  const ext = filename.split(".").pop();
  switch (ext) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
};

// "C:\Users\thevi\Downloads\photo_2023-03-02_20-26-42.jpg"
readFileAsDataURL("C:/Users/thevi/Downloads/photo_2023-03-02_20-26-42.jpg")
  .then((dataUrl) => {
    // console.log(dataUrl);
    fs.writeFile("imageData.txt", dataUrl, (err) => {
      if (err) throw err;
      console.log("Data URL written to file.");
    });
  })
  .catch((err) => {
    console.error(err);
  });
