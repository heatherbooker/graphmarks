const fs = require('fs');
const readline = require('readline');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('name the *.html file containing your bookmarks:\n', response => {

  rl.close();

  let fileName = response.trim();
  if (!/\.html/.test(response)) {
    fileName += '.html';
  }

  fs.readFile(fileName, 'utf8', (err, data) => {

    if (err) {
      return console.error(err);
    }

    const bookmarks = parseBookmarks(data);

    fs.writeFile('bookmarks.json', JSON.stringify(bookmarks, null, 2));
  });

});

function parseBookmarks(data) {

  const regex = /<a href="(.+?)".+?>(.+?)</gi;
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


