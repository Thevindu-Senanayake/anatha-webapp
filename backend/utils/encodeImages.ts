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

readFileAsDataURL("path/to/image.png")
  .then((dataUrl) => {
    console.log(dataUrl);
  })
  .catch((err) => {
    console.error(err);
  });
