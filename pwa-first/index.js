const express = require('express')
const app = express()
const port = 3000
app.use(express.static('public'));
app.get('/', (req, res) => {

    res.sendFile(index.html, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }});
        
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})