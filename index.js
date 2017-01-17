const fs = require('fs');


fs.readFile('./Bookmarks.html', 'utf8', (err, data) => {

  if (err) {
    return console.error(err);
  }

  const bookmarks = parseBookmarks(data);

  fs.writeFile('bookmarks.json', JSON.stringify(bookmarks, null, 2));
});


function parseBookmarks(data) {

  const regex = /<a href="(.+?)".+?>(.+?)</g;
  const bookmarks = [];
  let result;

  while (result = regex.exec(data)) {
    bookmarks.push({
      id: result[1],
      title: result[2],
      group: 1
    });
  }

  return bookmarks;

}


