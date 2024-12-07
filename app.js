// Конфігурація Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBoivqPbnDWf1LFa92A5HCRymsVE4lkVfw",
    authDomain: "votihg-app.firebaseapp.com",
    databaseURL: "https://votihg-app-default-rtdb.firebaseio.com",
    projectId: "votihg-app",
    storageBucket: "votihg-app.firebasestorage.app",
    messagingSenderId: "812317391044",
    appId: "1:812317391044:web:2fdf514092c260261fb191",
    measurementId: "G-SFSXPYEQ79"
  };
  
  // Ініціалізація Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Ініціалізація бази даних
  const db = firebase.database();
  
  // Функція створення голосування
  function createVote() {
    const question = document.getElementById("question").value;
    const option1 = document.getElementById("option1").value;
    const option2 = document.getElementById("option2").value;
  
    if (!question || !option1 || !option2) {
      alert("Будь ласка, заповніть усі поля!");
      return;
    }
  
    const voteId = db.ref("votes").push().key;
  
    db.ref("votes/" + voteId).set({
      question,
      options: {
        option1: { text: option1, votes: 0 },
        option2: { text: option2, votes: 0 },
      },
    })
      .then(() => {
        document.getElementById("vote-code").style.display = "block";
        document.getElementById("code").textContent = voteId;
      })
      .catch((error) => {
        console.error("Помилка створення голосування:", error);
      });
  }
  
  // Завантаження голосування для участі
  function loadVote() {
    const voteCode = document.getElementById("vote-code-input").value;
  
    if (!voteCode) {
      alert("Введіть код голосування!");
      return;
    }
  
    db.ref("votes/" + voteCode).once("value")
      .then((snapshot) => {
        const data = snapshot.val();
  
        if (!data) {
          alert("Голосування з таким кодом не знайдено.");
          return;
        }
  
        document.getElementById("vote-question").textContent = data.question;
        document.getElementById("vote-option1").textContent = data.options.option1.text;
        document.getElementById("vote-option2").textContent = data.options.option2.text;
        document.getElementById("vote-display").style.display = "block";
        
        // Оновлюємо статистику голосування
        updateStatistics(voteCode, data);
      })
      .catch((error) => {
        console.error("Помилка завантаження голосування:", error);
      });
  }
  
  // Голосування за вибраний варіант
  function castVote(option) {
    const voteCode = document.getElementById("vote-code-input").value;
  
    if (!voteCode) {
      alert("Введіть код голосування!");
      return;
    }
  
    db.ref("votes/" + voteCode + "/options/" + option + "/votes").transaction((votes) => {
      return (votes || 0) + 1;
    })
      .then(() => {
        alert("Ваш голос зараховано!");
        loadVote(); // Перезавантажуємо статистику після голосування
      })
      .catch((error) => {
        console.error("Помилка голосування:", error);
      });
  }
  
  // Оновлення статистики голосування
  function updateStatistics(voteCode, data) {
    const totalVotes = data.options.option1.votes + data.options.option2.votes;
    const option1Votes = data.options.option1.votes;
    const option2Votes = data.options.option2.votes;
  
    const option1Percent = totalVotes ? ((option1Votes / totalVotes) * 100).toFixed(2) : 0;
    const option2Percent = totalVotes ? ((option2Votes / totalVotes) * 100).toFixed(2) : 0;
  
    // Відображення статистики
    document.getElementById("option1-stat").textContent = `Варіант 1: ${option1Votes} голосів (${option1Percent}%)`;
    document.getElementById("option2-stat").textContent = `Варіант 2: ${option2Votes} голосів (${option2Percent}%)`;
    document.getElementById("vote-statistics").style.display = "block";
  }
  