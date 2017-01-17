#Bookmark Visualizer

### to run:
```bash
git clone https://github.com/heatherbooker/bookmark-visualizer.git
```

### for exported chrome bookmarks (.html):
export your bookmarks from chrome (use Bookmark Manager -> Organize), then:
```bash
node parsers/bookmarkParser.js
```

### for awesome-<whatever> lists (.md):
save the raw .md version of an awesome list from Github, then:
```bash
node parsers/awesomeParser.js
```
cool, check out your list of bookmarks/links!
```bash
vim links.json
```
