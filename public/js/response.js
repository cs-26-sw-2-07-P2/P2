const res = await fetch("/api/response");
const data = await res.json();

const answerMap = {};

if (data.response) {
  data.response.answers.forEach(a => {
    answerMap[a.questionId] = a.value;
  });
}

const value = answerMap[item.id] || 1;