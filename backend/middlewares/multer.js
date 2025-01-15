import multer from "multer";
const upload = multer({
    storage:multer.memoryStorage(), // This configuration tells Multer to store the file in memory (RAM) as a Buffer object instead of writing it to the disk.
});
export default upload;

// Multer is a Node.js middleware used to handle file uploads in an Express application.
//  It is designed to parse multipart/form-data (the encoding used for file uploads) 
//  and provides methods to manage where and how files are stored.