const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const appPath = path.join(__dirname, '../apps/3_social/dist/index.html');
    
    if (fs.existsSync(appPath)) {
      const html = fs.readFileSync(appPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes cache
      res.status(200).send(html);
    } else {
      res.status(404).json({ error: 'Social app not found' });
    }
  } catch (error) {
    console.error('Error serving social app:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 