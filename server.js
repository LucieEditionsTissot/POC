const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
const fs = require('fs');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

let interval;

const obtenirQuestionsPourTheme = (theme) => {
  const questions = {
    biodiversite: [
      { question: "Qu'est-ce que la biodiversité ?", reponse: "..." },
      { question: "Pourquoi la biodiversité est-elle importante ?", reponse: "..." },
    ],
    environnement: [
      { question: "Qu'est-ce que l'environnement ?", reponse: "..." },
      { question: "Quels sont les problèmes environnementaux actuels ?", reponse: "..." },
    ],
  };

  return questions[theme] || [];
};

const getApiAndEmit = (socket) => {
  const response = new Date();
  socket.emit("FromAPI", response);
};

io.on("connection", (socket) => {
  if (interval) {
    clearInterval(interval);
  }

  console.log('Un professeur s\'est connecté');

  socket.on('themeChoisi', (selectedTheme) => {
    console.log(`Thème choisi par le professeur : ${selectedTheme}`);

    const questions = obtenirQuestionsPourTheme(selectedTheme);
    console.log(questions);
    io.to('studentGroup1').emit('questions', questions);
    io.to('studentGroup2').emit('questions', questions);
  });
socket.on('questions', questions => {
  console.log("POC")
});
  socket.on("reponseQuestion", (reponse) => {
    console.log(`La réponse "${reponse}" a été reçue.`);

    socket.broadcast.emit("nouvelleReponse", reponse);
    console.log("La réponse a été envoyée à tous les autres sockets.");
  });

  socket.on("messageSent", (message) => {
    console.log(message);
    io.emit("messageSent", message);
  });

  if (socket.handshake.query.group === 'teacher') {
    console.log('Teacher connected');
  }

  if (socket.handshake.query.group && socket.handshake.query.group.startsWith('studentGroup')) {
    console.log('Student connected');

  }

  interval = setInterval(() => getApiAndEmit(socket), 1000);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

nextApp.prepare().then(() => {
  app.get('*', (req, res) => {
    return nextHandler(req, res)
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
