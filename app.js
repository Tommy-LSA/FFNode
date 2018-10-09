const listenport = 8089;
const http = require('http');
const url = require('url');
const https = require('https');
const options = {
    hostname: 'freifunk-halle.org',
    port: 443,
    path: '/hopglass-server/nodes.json',
    method: 'GET'
};

http.createServer((req, res) => {
    var query = url.parse(req.url, true).query;
    var retval = {error:null, result:[]};

    const requ = https.request(options, (resp) => {
        let content = "";
        resp.on('data', (d) => {
            content += d;
        });

        resp.on('end',()=>{
            let nodelist = JSON.parse(content);
            nodelist.nodes.forEach(element => {
                if(element.nodeinfo.node_id === query.nodeid){
                    retval.result.push(element);
                }
            });
            res.end(JSON.stringify(retval));
        })
    });
      
    requ.on('error', (e) => {
        retval.error = e.message;
        res.end(JSON.stringify(retval));
    });

    requ.end();

}).listen(listenport);