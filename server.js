var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
  // The URL we will Scrape

  url = 'http://ads.mediaforge.com/advertisers/eileen6557/rias/ria3878910/?merchantID=6557&networkID=24';

  // The callback function takes 3 parameters, an error, response status code and the html

  request(url, function(error, response, html){

      // First we'll check to make sure no errors occurred when making the request

      if(!error){
              // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

              var $ = cheerio.load(html);

          // Finally, we'll define the variables we're going to capture

          var feed, click, partytracking;
          var json = { click : "", partytracking : "", feed : ""};

          $('script').filter(function(){

           // Store the data we filter into a variable so we can easily see what's going on.

                var data = $(this);
                var re = /mF = (.+)|parent:/
                console.log(data.contents().toString().match(re));

           // Utilizing jQuery we navigate and get the text by writing the following code:

                feed = data.children().first().text();

                click = data.children().last().text();

                partytracking = data.children().text();

                // Store it to json objects.

                json.feed = feed;
                json.click = click;
                json.partytracking = partytracking;
          })
      }

      // To write to the system we will use the built in 'fs' library.
      // We will pass 3 parameters to the writeFile function
      // Parameter 1 :  output.json - this is what the created filename will be called
      // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
      // Parameter 3 :  callback function - a callback function to let us know the status of our function

      fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

          console.log('File successfully written! - Check your project directory for the output.json file');

      })

      // This sends out a message to the browser reminding you that this app does not have a UI.
      res.send('Check your console!')

  })
})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;
