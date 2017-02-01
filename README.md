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
Go to an awesome-<whatever> list on github, right-click the main page and click "view source", then save what opens, and input the path to that file when asked after running `node parsers/awesomeParser.js` from the graphmarks directory.


