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
      { question: "Pourquoi la biodiversité est-elle importante ?", reponses: [
          {animal:"Loup", isCorrect:true },
          {animal:"Renard", isCorrect:false },
          {animal:"Belette", isCorrect:true },
          {animal:"Biche", isCorrect:false },
        ]},
    ],
    environnement: [
      { question: "Qu'est-ce que l'environnement ?",
        reponses: [
          {animal:"Loup", isCorrect:true },
          {animal:"Renard", isCorrect:false },
          {animal:"Belette", isCorrect:true },
          {animal:"Biche", isCorrect:false },
        ] },
    ],
  };
  return questions[theme][0] || []
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
  socket.on('registerStudent1', () => {
    socket.join('client1');
    console.log('Client 1 enregistré :', socket.id);
  });
  socket.on('registerStudent2', () => {
    socket.join('client2');
    console.log('Client 2 enregistré :', socket.id);
  });
  socket.on('themeChoisi', (selectedTheme) => {
    console.log(`Thème choisi par le professeur : ${selectedTheme}`);

    const questions = obtenirQuestionsPourTheme(selectedTheme);
    const reponses = obtenirQuestionsPourTheme(selectedTheme).reponses;
    const reponsesGroupe1 = reponses.slice(0, reponses.length/2);
    const reponsesGroupe2 = reponses.slice(2);

    console.log(questions);

    if (socket.handshake.query.group && socket.handshake.query.group === "client1") {
      io.emit('questions', questions.question);
      io.emit('reponses', reponsesGroupe1);
    } else {
      io.emit('questions', questions);
    }
  });

  socket.on('reponseQuestion', ({ questionId, reponseId }) => {
    console.log(`Réponse pour la question ${questionId}: Réponse ID ${reponseId}`);
    socket.emit('reponseQuestionConfirmation', { message: 'Réponse enregistrée avec succès.' });
  });

  socket.on("messageSent", (message) => {
    console.log(message);
    io.emit("messageSent", message);
  });

  if (socket.handshake.query.group === 'teacher') {
    console.log('Teacher connected');
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
