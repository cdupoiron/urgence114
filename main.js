var electronify = require('electronify-server');

var healthCheck = function(app, window, callback){
  setTimeout(function () {
    callback();
  }, 1000)
}

electronify({
  command: 'node',
  args: ['server.js'],
  options: {},
  url: 'http://127.0.0.1:3000',
  debug: true,
  window: {height: 768, width: 1024, 'title-bar-style': 'default', frame: true},
  ready: function(app){
    // application event listeners could be added here
  },
  preLoad: function(app, window){
    // window event listeners could be added here
  },
  postLoad: function(app, window, error){
    // Error only exists if there was an error while loading
    // error == {
    //   event: event,
    //   errorCode: errorCode,
    //   errorDescription: errorDescription,
    //   validatedURL: validatedURL,
    //   isMainFrame: isMainFrame
    // }
    if (error) {
      console.log(error.errorCode, error.errorDescription, error.validatedURL);
    }

    // url finished loading
  },
  showDevTools: false,
  healthCheck: healthCheck
}).on('child-started', function(child) {
  // child process has started
  console.log('PID: ' + child.pid);

  // setup logging on child process
  child.stdout.on('data', console.log);
  child.stderr.on('data', console.log);

  var os = require('os');
  var ifaces = os.networkInterfaces();

  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log(ifname + ':' + alias, iface.address);
      } else {
        // this interface has only one ipv4 adress
        console.log(ifname, iface.address);
      }
      ++alias;
    });
  });

}).on('child-closed', function(app, stderr, stdout) {
  // the child process has finished

}).on('child-error', function(err, app) {
  // close electron if the child crashes
  app.quit();
});
