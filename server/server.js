var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var jsdom = require('jsdom');
var app = express();
var path = require('path');

app.get('/scrape', function(req, res) {
  //test url = 'http://ads.mediaforge.com/advertisers/eileen6557/rias/ria3878910/?merchantID=6557&networkID=24'
  //http://ads.mediaforge.com/advertisers/course6577/rias/ria4031390/?merchantID=6577&networkID=24
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  // The URL we will Scrape

  var url = req.query.id;

  // The callback function takes 3 parameters, an error, response status code and the html
  //console.log(req);
  request(url, function(error, response, html) {
    // First we'll check to make sure no errors occurred when making the request

    if (!error) {
      // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

      // var $ = cheerio.load(html);
      var dom = new jsdom.JSDOM(html, { runScripts: 'dangerously' });
      var feedlink = 'http://ads.mediaforge.com';
      //console.log(dom.window.mF);

      // Finally, we'll define the variables we're going to capture
      var json = {
        url: dom.window.mF.config.url,
        ria: url,
        feeds: dom.window.mF.config.contents.map(function(x) {
          if ('feed_key' in x) {
            return {
              feed: feedlink + dom.window.mF.config.feeds[x.feed_key],
              feedname: x.feed_key,
              tracking: x.url
            };
          } else {
            return {
              feed: 'Static',
              feedname: 'N/A',
              tracking: {
                prepend: 'N/A',
                append_querystring: 'N/A'
              }
            };
          }
        })
      };
    }
    var jsonResponse = JSON.stringify(json);
    // To write to the system we will use the built in 'fs' library.
    // We will pass 3 parameters to the writeFile function
    // Parameter 1 :  output.json - this is what the created filename will be called
    // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
    // Parameter 3 :  callback function - a callback function to let us know the status of our function

    // fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {
    //   console.log(
    //     'File successfully written! - Check your project directory for the output.json file'
    //   );
    // });

    // This sends out a message to the browser reminding you that this app does not have a UI.
    res.send(jsonResponse);
  });
});

app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;
