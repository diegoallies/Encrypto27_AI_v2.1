const fs = require('fs');
const path = require('path');

// The URL to search for
const targetUrl = 'https://files.catbox.moe/kwi2pa.jpg';

// Function to recursively search files in a directory
function searchFiles(dir) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // If it's a directory, search recursively
      searchFiles(filePath);
    } else if (stat.isFile()) {
      // If it's a file, read and search its content
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(targetUrl)) {
        console.log(`Found in: ${filePath}`);
      }
    }
  });
}

// Start searching from the current directory
searchFiles('./');