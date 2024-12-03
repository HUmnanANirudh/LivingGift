const express = require('express');
const { engine } = require('express-handlebars');
const app = express();
const cors = require('cors');

app.use(cors());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.set('partials', __dirname + '/views');

app.get('/footer', (req, res) => {
  res.render('footer.hbs');  // Render the footer template
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
