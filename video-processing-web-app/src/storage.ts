import { Storage } from "@google-cloud/storage";
import fs from 'fs'; //fs = file system
import ffmpeg from "fluent-ffmpeg";

const storage = new Storage(); //Creates a client

const rawVideoBucketName = "daniel123-yt-raw-videos"; //The name of the bucket that stores the raw videos
const processedVideoBucketName = "daniel123-yt-processed-videos"; //The name of the bucket that stores the processed videos

const localRawVideoPath = "./raw-videos"; //The path to the local directory that stores the raw videos
const localProcessedVideoPath = "./processed-videos"; //The path to the local directory that stores the processed videos

/**
 * Creates the local directories for raw and processed videos.
 */
export function setupDirectories() {
    ensureDirectoryExistence(localRawVideoPath);
    ensureDirectoryExistence(localProcessedVideoPath);
}

/**
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}.
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}.
 * @returns A promise that resolves when the video has been converted.
 */

//Converts a video to 360p using ffmpeg and fluent-ffmpeg 
export function convertVideo(rawVideoName: string, processedVideoName: string) {
    return new Promise<void>((resolve, reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
        .outputOptions("-vf", "scale=-1:360") //360 p
        .on("end", function() {
            console.log("Processing finished successfully");
            resolve();
        })
        .on("error", function (err: any) {
            console.log("An error occured: " + err.message);
            reject(err);
        })
        .save(`${localProcessedVideoPath}/${processedVideoName}`);
    });
}

/**
 * @param fileName - The name of the file to download from the
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been downloaded.
 */

//Downloads a video from the rawVideoBucketName bucket into the localRawVideoPath folder
export async function downloadRawVideo(fileName: string) {
    await storage.bucket(rawVideoBucketName)
    .file(fileName)
    .download({
        destination: `${localRawVideoPath}/${fileName}`,
    })

    console.log(
        `gs://${rawVideoBucketName}/${fileName} downloaded to
    ${localRawVideoPath}/${fileName}.`
    );
}

/**
 * @param fileName - The name of the file to upload from the 
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}
 * @returns A promise that resolves when the file has been uploaded.
 */

export async function  uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);

    //Upload video to bucket
await storage.bucket(processedVideoBucketName)
  .upload(`${localProcessedVideoPath}/${fileName}`, {
    destination: fileName,
  });
  console.log(
    `${localProcessedVideoPath}/${fileName} uploaded to
    gs://${processedVideoBucketName}/${fileName}.`
  );

  //Set the video to be publicly readable
  await bucket.file(fileName).makePublic();

}

/**
 * @param fileName - The name of the file to delete from the
 * {@link localRawVideoPath} folder
 * @returns A promise that resolves when the file has been deleted
 */

//Deletes a file from the localRawVideoPath folder
export function deleteRawVideo(fileName: string) {
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}
/**
 * @param fileName - The name of the file to delete from the
 * {@link localProcessedVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 * 
 */

//Deletes a file from the localProcessedVideoPath folder
export function deleteProcessedVideo(fileName: string) {
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

/**
 * @param filePath - The path of the file to delete
 * @return A promise that resolves when the file has been deleted.
 */

//Deletes a file from the localProcessedVideoPath folder
function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Failed to delete file at ${filePath}`, err);
                    reject(err);
                } else {
                    console.log(`File deleted at ${filePath}`);
                    resolve();
                }
            });
        } else {
            console.log(`File not found at ${filePath}, skipping delete`);
            resolve();
        }
    });
}

/**
 * Ensures a dir exists, creating it if necessary.
 * @param {string} dirPath - The directory path to check.
 */


function ensureDirectoryExistence(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true }); //recursive: true enables creating nested directories
        console.log(`Directory created at ${dirPath}`);
    }
}