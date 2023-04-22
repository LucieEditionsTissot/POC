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
const clients = io.sockets.adapter.rooms;
const obtenirQuestionsPourTheme = (theme) => {
  const questions = {
    ocean: [
      { question: "Qui agit en symbiose dans l'océan ?", reponses: [
          {animal:"La tortue", isCorrect:false },
          {animal:"La loutre", isCorrect:false },
          {animal:"Le poisson clown", isCorrect:true },
          {animal:"Le crocodile", isCorrect:false },
          {animal:"La baleine", isCorrect:false },
          {animal:"Le crabe nageur", isCorrect:false },
          {animal:"L'anémone", isCorrect:true },
          {animal:"L'étoile de mer", isCorrect:false },
        ], animation : "Le mutualisme entre le poisson clown et l'anémone dans l'océan est une relation symbiotique où les deux espèces bénéficient mutuellement. Le poisson clown trouve refuge dans les tentacules venimeux de l'anémone, qui le protège des prédateurs. En retour, le poisson clown chasse les parasites de l'anémone et apporte de la nourriture grâce à ses déplacements, ce qui permet à l'anémone de se nourrir et de rester en bonne santé. C'est un exemple parfait de coopération et d'interdépendance dans la nature."},
    ],
    foret: [
      { question: "Qui agit en symbiose dans la forêt ?",
        reponses: [
          {animal:"Le cerf", isCorrect:false },
          {animal:"Le blaireau", isCorrect:true },
          {animal:"Le renard", isCorrect:false },
          {animal:"Le sanglier", isCorrect:false },
          {animal:"Le chevreuil", isCorrect:false },
          {animal:"Le coyotte", isCorrect:true },
          {animal:"Le hérisson", isCorrect:false },
          {animal:"La belette", isCorrect:false },
        ], animation : "Le blaireau et le coyote forment une relation de mutualisme dans la forêt. Le blaireau creuse des terriers qui servent d'abris pour le coyote, tandis que le coyote chasse les petits rongeurs qui se cachent dans les terriers, fournissant ainsi de la nourriture au blaireau. Cette coopération bénéfique permet aux deux espèces de prospérer et de trouver des ressources essentielles pour leur survie dans leur habitat naturel.\n" },
    ],
    montagne: [
      { question: "Qui agit en symbiose dans la montagne ?",
        reponses: [
          {animal:"Le bouquetin", isCorrect:false },
          {animal:"La marmotte", isCorrect:true },
          {animal:"Le chamois", isCorrect:false },
          {animal:"Le renard", isCorrect:false },
          {animal:"Le Coq de Bruyères", isCorrect:false },
          {animal:"L'aigle", isCorrect:true },
          {animal:"Le mouflon", isCorrect:false },
          {animal:"La chauve-souris", isCorrect:false },
        ], animation : "En montagne, la marmotte et l'aigle royal entretiennent une relation de mutualisme. La marmotte, avec son excellente ouïe, sert de sentinelle pour alerter les autres animaux en cas de danger imminent, ce qui bénéficie également à l'aigle royal qui peut ainsi repérer plus facilement ses proies. En retour, l'aigle royal élimine les prédateurs potentiels de la marmotte, assurant ainsi sa sécurité et sa survie dans son habitat montagneux." },
    ],
    prairie: [
      { question: "Qui agit en symbiose dans la prairie ?",
        reponses: [
          {animal:"Le chien de prairie", isCorrect:false },
          {animal:"La vache", isCorrect:true },
          {animal:"L'antilope", isCorrect:false },
          {animal:"Le putois", isCorrect:false },
          {animal:"Le renard", isCorrect:false },
          {animal:"Le héron", isCorrect:true },
          {animal:"La buse", isCorrect:false },
          {animal:"Le mormon", isCorrect:false },
        ], animation : "Le mutualisme entre la vache et le héron en prairie est une relation bénéfique pour les deux espèces. La vache, en broutant l'herbe, crée une zone dégagée propice à la recherche de proies pour le héron. En retour, le héron se nourrit des insectes et des parasites qui dérangent la vache, contribuant ainsi à la santé de l'animal. Cette coopération entre la vache et le héron favorise un équilibre écologique dans les prairies, où les deux espèces tirent profit des activités de l'autre." },
    ],
    jardin: [
      { question: "Qui agit en symbiose dans le jardin ?",
        reponses: [
          {animal:"Les abeilles", isCorrect:false },
          {animal:"Les coccinelles", isCorrect:true },
          {animal:"Les papillons", isCorrect:false },
          {animal:"Les vers de terre", isCorrect:false },
          {animal:"Les rouge-gorges", isCorrect:false },
          {animal:"Les pucerons", isCorrect:true },
          {animal:"Les chenilles", isCorrect:false },
          {animal:"Le mormon", isCorrect:false },
        ],
        animation : "Les coccinelles et les pucerons ont une relation de mutualisme dans le jardin. Les coccinelles se nourrissent des pucerons, qui sont des parasites qui attaquent les plantes, tandis que les pucerons fournissent aux coccinelles une source de nourriture abondante. Les coccinelles aident ainsi à maintenir les populations de pucerons sous contrôle, ce qui contribue à protéger les plantes du jardin des infestations nuisibles." },
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
    const questions = obtenirQuestionsPourTheme(selectedTheme);
    const reponses = obtenirQuestionsPourTheme(selectedTheme).reponses;
    const reponsesGroupe1 = reponses.slice(0, reponses.length/2);
    const reponsesGroupe2 = reponses.slice(reponses.length/2);
    console.log(reponsesGroupe1)
    console.log(reponsesGroupe2)
    const bonnesReponses = reponses.filter(reponse => reponse.isCorrect).map(reponse => reponse.animal);
    reponsesCorrectes = obtenirReponsesCorrectesPourTheme(selectedTheme, bonnesReponses);
    themeChoisi = selectedTheme;
    io.emit('reponsesCorrectes', reponsesCorrectes);
    io.emit('questions', questions);

    io.to("client1").emit('reponses', reponsesGroupe1);
    io.to("client2").emit('reponses', reponsesGroupe2);
  });

  socket.on("reponseQuestion", ({ reponseId, isCorrect}) => {
    if (clients.get("client1") && clients.get("client2")) {
      const clientId = socket.id;
      socket.broadcast.emit("choixFaits", {clientId});
    }
  });

  socket.on("choixFaits", ({clientId}) => {
    clientId = socket.id;
    clientsChoixFaits++;
    if (clientsChoixFaits === 2) {
      const animation = obtenirQuestionsPourTheme(themeChoisi).animation;
      io.emit("themeChosen", themeChoisi, animation);
      clientsChoixFaits = 0;
      io.emit("choixFaits", {});
      setTimeout(() => {
        io.emit("reloadClient");
      }, 2000);
    }
  });

  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
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
