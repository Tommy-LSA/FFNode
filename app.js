const listenport = 8089; // port the service listen to requests
const interval = 30; // seconds to repeatly get nodes from hopglass server

const http = require('http');
const url = require('url');
const https = require('https');

const options = {
    hostname: 'freifunk-halle.org',
    port: 443,
    path: '/hopglass-server/nodes.json',
    method: 'GET'
};

var nodelist = {nodes:[]};
getNodes();

setInterval(function(){ getNodes(); }, interval * 1000);

function getNodes(){
    const requ = https.request(options, (resp) => {
        let content = "";
        resp.on('data', (d) => {
            content += d;
        });

        resp.on('end',()=>{
            nodelist = JSON.parse(content);
        })
    });
      
    requ.on('error', (e) => { });
    requ.end();
}

http.createServer((req, res) => {
    var query = url.parse(req.url, true).query;
    var retval = {error:null, result:[]};

    nodelist.nodes.forEach(element => {
        if(element.nodeinfo.node_id === query.nodeid){
            retval.result.push(element);
        }
    });
    res.end(JSON.stringify(retval));

}).listen(listenport);