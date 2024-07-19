import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se almacenarán los archivos subidos
    },
    filename: (req, file, cb) => {
        // Genera un nombre único para el archivo subido utilizando la fecha actual y la extensión original del archivo
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Filtro de archivos para aceptar solo videos MP4
const fileFilter = (req, file, cb) => {
    // Verifica si el tipo MIME del archivo es MP4
    if (file.mimetype.startsWith('video/mp4')) {
        cb(null, true); // Acepta el archivo
    } else {
        cb(new Error('Only MP4 files are allowed'), false); // Rechaza el archivo
    }
};

// Configura multer con el almacenamiento y filtro de archivos definidos
const upload = multer({ 
    storage, 
    fileFilter 
});

export default upload;