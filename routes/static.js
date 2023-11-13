import { Router } from "express";
import path from "path";
import fs from "fs";

const files = Router();


files.get('/:folder/:subfolder/:file', (req, res) => {
    const folder = req.params.folder;
    const subFolder = req.params.subfolder;
    const file = req.params.file;
    const filePath = path.resolve(`static/${folder}/${subFolder}/${file}`);
    if (file.endsWith('.js')){
        // Spécifiez le type MIME pour les fichiers JavaScript
        res.type('application/javascript');
    }
    if (!fs.existsSync(filePath)) return res.status(404).json({message: "File doesn't exist", path: filePath})
})

files.get('/:folder/:file', (req, res) => {
    const folder = req.params.folder;
    const file = req.params.file;
    const filePath = path.resolve(`static/${folder}/${file}`);
    if (!fs.existsSync(filePath)) return res.status(404).json({message: "File doesn't exist", path: filePath});

    if (file.endsWith('.js')){
        // Spécifiez le type MIME pour les fichiers JavaScript
        res.type('application/javascript');
    }
    res.sendFile(filePath);
})



export default files;