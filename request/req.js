const http=require("http");
var qs = require('querystring');
function req({hostname,path,data={}}={}){
    var options = {
		hostname: hostname,
		port: 80,
		path: path,
		method: 'GET',
		headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
		}
	 };
    return new Promise((resolve,reject)=>{
        var request = http.request(options, function (res) {  
            res.setEncoding('utf8');  
                let rawData = '';
                res.on('data', (chunk) => { rawData += chunk; });	 
                res.on('end',() => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        // console.log(parsedData.result.data);
                        resolve(parsedData)
                    } catch (e) {
                        reject(e.message);
                    }
                });
            });  
          request.on('error', function (e) {  
                    console.log('problem with request: ' + e.message);  
            });  
        if(Object.keys(data).length!=0){
            request.write(qs.stringify(data));
        }else{
            request.write();
        }
        // request.write(qs.stringify(data));
        request.end();
    })
    
}
module.exports={
    req
}