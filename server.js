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
let clientsChoixFaits = 0;
let reponsesCorrectes;
let themeChoisi;
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
const obtenirReponsesCorrectesPourTheme = (theme, bonnesReponses) => {
  const questions = obtenirQuestionsPourTheme(theme);
  const reponses = questions.reponses;
  return reponses.filter(reponse => {
  return bonnesReponses.includes(reponse.animal) && reponse.isCorrect === true;
  });
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
  socket.on('registerAnimationClient', () => {
    socket.join('client3');
    console.log('Client 3 enregistré :', socket.id);
  });

  socket.on('themeChoisi', (selectedTheme) => {
    console.log(`Thème choisi par le professeur : ${selectedTheme}`);

    const questions = obtenirQuestionsPourTheme(selectedTheme);
    const reponses = obtenirQuestionsPourTheme(selectedTheme).reponses;
    const reponsesGroupe1 = reponses.slice(0, reponses.length/2);
    const reponsesGroupe2 = reponses.slice(2);
    const bonnesReponses = reponses.filter(reponse => reponse.isCorrect).map(reponse => reponse.animal);
    reponsesCorrectes = obtenirReponsesCorrectesPourTheme(selectedTheme, bonnesReponses);
    themeChoisi = selectedTheme;
    io.emit('reponsesCorrectes', reponsesCorrectes);
    io.emit('questions', questions);
    io.to("client1").emit('reponses', reponsesGroupe1);
    io.to("client2").emit('reponses', reponsesGroupe2);

  });

  socket.on("reponseQuestion", ({ reponseId, isCorrect}) => {

    if (isCorrect) {
      console.log(`La réponse avec l'ID ${reponseId} est correcte`);
    } else {
      console.log(`La réponse avec l'ID ${reponseId} est incorrecte`);
    }

    const clients = io.sockets.adapter.rooms;
    if (clients.get("client1") && clients.get("client2")) {
      const clientId = socket.id;
      socket.broadcast.emit("choixFaits", {clientId});

    }

  });

  socket.on("choixFaits", ({clientId}) => {
    clientId = socket.id;
    console.log(`Le client ${clientId} a déjà fait un choix`);
    clientsChoixFaits++;
    if (clientsChoixFaits === 2) {
      console.log("Les choix ont été faits sur toutes les tablettes");
      socket.broadcast.emit("themeChoisi", themeChoisi);
      clientsChoixFaits = 0;
      io.emit("choixFaits", {});
      console.log("in");
      setTimeout(() => {
      console.log("out");
        io.emit("reloadClient");
      }, 2000);

    }
  });

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
