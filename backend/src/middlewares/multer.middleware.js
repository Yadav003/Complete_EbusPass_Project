import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`)
  }
})

export const upload = multer(
    {
     storage: storage,
     fileFilter: (req, file, cb) => {
       if (
         file.mimetype.startsWith("image/") ||
         file.mimetype === "application/pdf"
       ) {
         cb(null, true);
         return;
       }

       cb(new Error("Only image and PDF files are allowed"), false);
     },
    }
)