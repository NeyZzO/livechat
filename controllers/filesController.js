import path from 'path';
import fs from "fs";

class FilesController {
    /**
     * 
     * @param {string} fPath 
     * @param {File} file 
     */
    static checkImageEncoding(fPath, file){
        console.log(fPath);
        const buffer = fs.readFileSync(fPath);
        const isJPEG = buffer[0] === 0xFF && buffer[1] === 0xD8;
        const isPNG = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
        const isGIF = buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38;
        const isWebP = buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
        if (isJPEG) {
            console.log('Type d\'image : JPEG');
        } else if (isPNG) {
            console.log('Type d\'image : PNG');
        } else if (isGIF) {
            console.log('Type d\'image : GIF');
        } else if (isWebP) {
            console.log('Type d\'image : WebP');
        } else {
            console.log('Type d\'image non pris en charge');
        }        
    }
}

export default FilesController;