import weaviate from "weaviate-ts-client";
import { readFileSync, readdirSync, writeFileSync } from "fs";

const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

const toBase64 = (file) => {
  const bitmap = readFileSync(file);
  return Buffer.from(bitmap).toString("base64");
};

// // Store all images on database
// const imgFiles = readdirSync("./img");

// const promises = imgFiles.map(async (imgFile) => {
//   const b64 = toBase64(`./img/${imgFile}`);

//   await client.data
//     .creator()
//     .withClassName("Meme")
//     .withProperties({
//       image: b64,
//       text: imgFile.split(".")[0].split("_").join(" "),
//     })
//     .do();
// });

// await Promise.all(promises);

// Delete meme with Id
// await client.data
//   .deleter()
//   .withClassName("Meme")
//   .withId("f23fe46b-ad7b-4f5b-b64e-0ccb0ca5e593")
//   .do();

// // get all memes
// await client.graphql
//   .get()
//   .withClassName("Meme")
//   .withFields("text _additional { id }")
//   .do()
//   .then((res) => {
//     console.log(JSON.stringify(res, null, 2));
//   })
//   .catch((err) => {
//     console.error(JSON.stringify(err, null, 2));
//   });

// Search image
const img = await readFileSync("./pablo1.jpg");

const test = Buffer.from(img).toString("base64");

const resImage = await client.graphql
  .get()
  .withClassName("Meme")
  .withFields(["image"])
  .withNearImage({ image: test })
  .withLimit(1)
  .do();

// Write result to filesystem
const result = resImage.data.Get.Meme[0].image;
writeFileSync("./result.jpg", result, "base64");
