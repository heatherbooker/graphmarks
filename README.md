#graphmarks

*under construction!*

### to run:
```bash
git clone https://github.com/heatherbooker/graphmarks.git
cd graphmarks
npm install
node parsers/awesomeParser.js # The program will ask you for a file name:
testdata/awesome.html
```
At this point, the data for the graphmarks visualizer should be in a file of the same name as the one you named but with a .json extension (ex. testdata/awesome.json).
```js
// What should you do to run the visualizer with this file?
```
#### to use your own awesome-<whatever> list:
Go to an awesome-<whatever> list on github, open the developer tools/console, go to the 'network' tab, reload the page, right-click the request for the main page (the name will be the same as the name of the repo), go to 'copy' > 'copy as cURL'.  
Then go to the terminal and paste the cURL command and pipe the output into a file (ie, add ` > [filename].html` to the end of the command), and input the path to that file when asked after running `node parsers/awesomeParser.js` from the graphmarks directory.


