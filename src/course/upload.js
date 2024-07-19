import multer from 'multer';
import path from 'path';
import fs from 'node:fs'

// Configuración de almacenamiento de 
const uploadCarpet = 'uploads/';
if ( !fs.existsSync( uploadCarpet ) ) {
    fs.mkdirSync( uploadCarpet, { recursive: true } );
}
const storage = multer.diskStorage( {
    destination: ( req, file, cb ) => {
        cb( null, uploadCarpet ); // Carpeta donde se almacenarán los archivos subidos
    },
    filename: ( req, file, cb ) => {
        // Genera un nombre único para el archivo subido utilizando la fecha actual y la extensión original del archivo
        cb( null, `${Date.now()}-${file.originalname}` );
    }
} );

// Filtro de archivos para aceptar solo videos MP4
const fileFilter = ( req, file, cb ) => {
    // Verifica si el tipo MIME del archivo es MP4
    if ( file.mimetype.startsWith( 'video/mp4' ) ) {
        cb( null, true ); // Acepta el archivo
    } else {
        cb( new Error( 'Only MP4 files are allowed' ), false ); // Rechaza el archivo
    }
};

// Configura multer con el almacenamiento y filtro de archivos definidos
const upload = multer( {
    storage,
    fileFilter,
    //Limitador de tamaño de archivo (100 megas)
    limits: { fileSize: 100 * 1024 * 1024 }
} );

export default upload;