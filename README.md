#graphmarks

*under construction!*

### to use in chrome:
```bash
git clone https://github.com/heatherbooker/graphmarks.git
```
then open Chrome and go to the extension manager (`chrome://extensions`) and enable "Developer mode". next click the "Load unpacked extension.." button and select `graphmarks/chrome-extension` from wherever you cloned the repo to.  
voila! it should now be available at `chrome://bookmarks` as well as through a menu in the top toolbar!  
### for development:
```bash
git clone https://github.com/heatherbooker/graphmarks.git
cd graphmarks
npm install
```
#### to use your own awesome-<whatever> list:
go to an awesome-<whatever> list on github, right-click the main page and click "view source", then save what opens, and input the path to that file when asked after running `node parsers/awesomeParser.js` from the graphmarks directory.


