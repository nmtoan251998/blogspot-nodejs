const url = ((req, res, next) => {
    console.log("==================");
    console.log('URL: '+req.originalUrl);
    next();
})

const method = ((req, res, next) => {
    console.log('Method: ' +req.method);    
    next();
})

const time = ((req, res, next) => {    
    const today = new Date();
    console.log('Time: ' +today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + ' at '
    +today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds());
    console.log("==================");
    next();
});

module.exports = { time, method, url };