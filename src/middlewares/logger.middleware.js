import fs from "fs";
import winston, { transports } from "winston";
export const logger=winston.createLogger({
    level : "info",
    format:winston.format.combine(winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta:{service:"ecom-services"},
    transports:[
        new winston.transports.File({filename:"log.txt"})
    ]
});

 function loggerMiddleware(req,res,next){
if(!req.url.includes('signin')){
   const logData=" req.body: "+JSON.stringify(req.body)+" req url: "+req.url;
  logger.info(logData);
}
 next();
}
export default loggerMiddleware;