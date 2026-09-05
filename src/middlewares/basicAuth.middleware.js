import UserModel from "../features/user/user.model.js";
function basicAuthorizer(req,res,next){
  //1.check if authorization header is empty
    const authHeader=req.headers["authorization"];
    if(!authHeader){
       return res.status(401).send("No authorization details found");
    }
    else{
      //2.extract credentials
        const base64Credentials=authHeader.replace("Basic ","");
        //3.decode crdentials
        const decodedCreds=Buffer.from(base64Credentials,"base64").toString('utf-8');
        const creds=decodedCreds.split(":");
        const user= UserModel.getAll().find((u)=>{
            return creds[0]==u.email&&creds[1]==u.password;
          });
          if(user){
            next();
          }
          else{
           return  res.status(401).send("Incorrect credentials");
          }
    }
}
export default basicAuthorizer;