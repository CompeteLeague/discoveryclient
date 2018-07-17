var http = require('http');

var DISCOVERY_SERVER_URL = "http://localhost:8081";
var DISCOVERY_HOSTNAME = "localhost";
var DISCOVERY_PORT = 8081;

function decodeURL(url, callback) {
  if (!url.startsWith('http://')) {
    callback("Error: Invalid URL. It has to start with 'http://'", null, null);
  } else {
    var url2 = url.substring(7);
    var first_slash_index = url2.indexOf('/');
    var servername = url2.substring(0, first_slash_index);
    var path = url2.substring(first_slash_index);
    callback(null, servername, path);
  }
}

function decodeDiscoveryResult(host) {
  console.log('host', typeof host, host);
  return {
    host: host.substring(0, host.indexOf(':')),
    port: parseInt(host.substring(host.indexOf(':') + 1))
  };
}


function get(url, callback) {
  decodeURL(url, function(err, servername, path) {
    if (err) {
      callback(err, null, null);
    } else {
      // START DISCOVERY REQUEST
      var discovery_req = http.request({
        hostname: DISCOVERY_HOSTNAME,
        port: DISCOVERY_PORT,
        path: '/servers/' + servername,
        method: 'GET'
      }, function(discovery_res) {
        // START ACTUAL REQUEST
        discovery_res.setEncoding('utf8');
        discovery_res.on('data', function(discovery_data) {
          var result = decodeDiscoveryResult(JSON.parse(discovery_data).hosts[0]);
          var req = http.request({
            hostname: result.host,
            port: result.port,
            path: path,
            method: 'GET'
          }, function(res) {
            res.setEncoding('utf8');
            res.on('error', function(err) {
              callback(err, res.statusCode, null);
            });
            res.on('data', function(data) {
              callback(null, res.statusCode, data);
            });
          });
          req.end();
          // END ACTUAL REQUEST
        });
      });
      discovery_req.on('error', function(discovery_err) {
        callback(discovery_err, null, null);
      });
      discovery_req.end();
      // END DISCOVERY REQUEST
    }
  });
}

function put(url, payload, callback) {
  decodeURL(url, function(err, servername, path) {
    if (err) {
      callback(err, null, null);
    } else {
      // START DISCOVERY REQUEST
      var discovery_req = http.request({
        hostname: DISCOVERY_HOSTNAME,
        port: DISCOVERY_PORT,
        path: '/servers/' + servername,
        method: 'GET'
      }, function(discovery_res) {
        // START ACTUAL REQUEST
        discovery_res.setEncoding('utf8');
        discovery_res.on('data', function(discovery_data) {
          var result = decodeDiscoveryResult(JSON.parse(discovery_data).hosts[0]);
          var req = http.request({
            hostname: result.host,
            port: result.port,
            path: path,
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            }
          }, function(res) {
            res.setEncoding('utf8');
            res.on('error', function(err) {
              callback(err, res.statusCode, null);
            });
            res.on('data', function(data) {
              callback(null, res.statusCode, data);
            });
          });
          req.write(JSON.stringify(payload));
          req.end();
          // END ACTUAL REQUEST
        });
      });
      discovery_req.on('error', function(discovery_err) {
        callback(discovery_err, null, null);
      });
      discovery_req.end();
      // END DISCOVERY REQUEST
    }
  });
}

function del(url, callback) {
  decodeURL(url, function(err, servername, path) {
    if (err) {
      callback(err, null, null);
    } else {
      // START DISCOVERY REQUEST
      var discovery_req = http.request({
        hostname: DISCOVERY_HOSTNAME,
        port: DISCOVERY_PORT,
        path: '/servers/' + servername,
        method: 'GET'
      }, function(discovery_res) {
        // START ACTUAL REQUEST
        discovery_res.setEncoding('utf8');
        discovery_res.on('data', function(discovery_data) {
          var result = decodeDiscoveryResult(JSON.parse(discovery_data).hosts[0]);
          var req = http.request({
            hostname: result.host,
            port: result.port,
            path: path,
            method: 'DELETE'
          }, function(res) {
            res.setEncoding('utf8');
            res.on('error', function(err) {
              callback(err, res.statusCode, null);
            });
            res.on('data', function(data) {
              callback(null, res.statusCode, data);
            });
          });
          req.end();
          // END ACTUAL REQUEST
        });
      });
      discovery_req.on('error', function(discovery_err) {
        callback(discovery_err, null, null);
      });
      discovery_req.end();
      // END DISCOVERY REQUEST
    }
  });
}

function post(url, payload, callback) {
  decodeURL(url, function(err, servername, path) {
    if (err) {
      callback(err, null, null);
    } else {
      // START DISCOVERY REQUEST
      var discovery_req = http.request({
        hostname: DISCOVERY_HOSTNAME,
        port: DISCOVERY_PORT,
        path: '/servers/' + servername,
        method: 'GET'
      }, function(discovery_res) {
        // START ACTUAL REQUEST
        discovery_res.setEncoding('utf8');
        discovery_res.on('data', function(discovery_data) {
          var result = decodeDiscoveryResult(JSON.parse(discovery_data).hosts[0]);
          var req = http.request({
            hostname: result.host,
            port: result.port,
            path: path,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          }, function(res) {
            res.setEncoding('utf8');
            res.on('error', function(err) {
              callback(err, res.statusCode, null);
            });
            res.on('data', function(data) {
              callback(null, res.statusCode, data);
            });
          });
          req.write(JSON.stringify(payload));
          req.end();
          // END ACTUAL REQUEST
        });
      });
      discovery_req.on('error', function(discovery_err) {
        callback(discovery_err, null, null);
      });
      discovery_req.end();
      // END DISCOVERY REQUEST
    }
  });
}

function register(servername, serverhost, callback) {
  var req = http.request({
    hostname: DISCOVERY_HOSTNAME,
    port: DISCOVERY_PORT,
    path: '/servers',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }, function(res) {
    res.setEncoding('utf8');
    res.on('error', function(err) {
      callback(err, null, null);
    });
    res.on('data', function(data) {
      callback(null, res.statusCode, data);
    });
  });
  req.write(JSON.stringify({
    name: servername,
    host: serverhost
  }));
  req.end();
}

function shutdown(servername, serverhost, callback) {
  var req = http.request({
    hostname: DISCOVERY_HOSTNAME,
    port: DISCOVERY_PORT,
    path: '/servers/' + servername + '/' + serverhost,
    method: 'DELETE'
  }, function(res) {
    res.setEncoding('utf8');
    res.on('error', function(err) {
      callback(err, null, null);
    });
    res.on('data', function(data) {
      callback(null, res.statusCode, data);
    });
  });
  req.end();
}


// TEST USAGE WILL BE REMOVED IN ACTUAL VERSION


register('name-service', 'localhost:8090', function(err, statusCode, data) {
  if (err) {
    console.log('err', err);
  } else {
    console.log('statusCode', statusCode);
    console.log('data', data);
  }
});

// post('http://name-service/names', { name: 'Peter' }, function (err, statusCode, data) {
//   console.log('statusCode', statusCode);
//   console.log('data', data);
// });

// post('http://name-service/names', { name: 'Richard' }, function (err, statusCode, data) {
//   console.log('statusCode', statusCode);
//   console.log('data', data);
// });

// get('http://name-service/names', function(err, statusCode, data) {
//   console.log('statusCode', statusCode);
//   console.log('data', data);
// });

// get('http://name-service/names/0', function(err, statusCode, data) {
//   // var body = JSON.parse(res.body);
//   console.log('statusCode', statusCode);
//   console.log('data', data);
// });

// put('http://name-service/names/2', { name: 'Klaus'}, function (err, statusCode, data) {
//       console.log('statusCode', statusCode);
//       console.log('data', data);
// });

// del('http://name-service/names/3', function (err, statusCode, data) {
//     console.log('statusCode', statusCode);
//     console.log('data', data);
// });

// shutdown('name-service', 'localhost:8092', function(err, statusCode, data) {
//   if (err) {
//     console.log('err', err);
//   } else {
//     console.log('statusCode', statusCode);
//     console.log('data', data);
//   }
// });


exports.discoveryclient = {
  get: get,
  put: put,
  post: post,
  del: del,
  register: register,
  shutdown: shutdown
};
