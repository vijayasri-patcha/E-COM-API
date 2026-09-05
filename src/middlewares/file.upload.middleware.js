import multer from "multer";
import path from "path";
const uploadPath = path.join(process.cwd(), "uploads");

console.log("Upload Path:", uploadPath);

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"uploads/");
    },
    filename:function(req,file,cb){
       console.log( req.body);
        cb(null,new Date().toISOString().replace(/:/g, '-')+file.originalname);

    }
    
});

const upload=multer({storage:storage});
export default upload;