const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')
const fs = require('fs');

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

let interval;

const getApiAndEmit = socket => {
  const response = new Date();
  socket.emit("FromAPI", response);
};
let selectedTheme = null;
const themes = ["animals", "colors"];
io.on("connection", (socket) => {
  if (interval) {
    clearInterval(interval);
  }

  if (socket.handshake.query.group === 'teacher') {
    console.log('Teacher connected');

    socket.on('themeSelected', (theme) => {
      console.log(`Theme selected: ${theme}`);
      selectedTheme = theme;

      const questionsRawData = fs.readFileSync('./data/faune.json');

      const questions = JSON.parse(questionsRawData);

      socket.emit('themeSelected', questions);
      console.log(socket.emit('themeSelected', questions))
      console.log(questions)

      io.to("studentGroup1").emit('questions', questions);

      io.to("studentGroup2").emit('questions', questions);
    });

    socket.on('themesSent', (themes) => {
      console.log(`Themes sent: ${themes}`);

    });
  }

  if (socket.handshake.query.group && socket.handshake.query.group.startsWith('studentGroup')) {
    console.log('Student connected');
    socket.on("themeSelected", (themes) => {
      console.log(`Theme selected: ${themes}`)
    })
    console.log(`Themes received: ${JSON.stringify(themes)}`);
    socket.on('themesSent', (themes) => {
      console.log(`Themes received: ${JSON.stringify(themes)}`);
    });

    socket.on('choiceMade', (choice) => {
      console.log(`Choice made by ${socket.id}: ${choice}`);
    });
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

io.on("themeSelected", (theme) => {
  console.log(`Theme selected: ${theme}`);

  io.to("studentsGroup1").emit("themeSelected", theme);
  io.to("studentsGroup2").emit("themeSelected", theme);
});

nextApp.prepare().then(() => {
  app.get('*', (req, res) => {
    return nextHandler(req, res)
  });

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

