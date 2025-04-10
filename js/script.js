
const SUPABASE_URL = 'https://wtzdxnplyohprfifwpxu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0emR4bnBseW9ocHJmaWZ3cHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMzYzOTEsImV4cCI6MjA1OTgxMjM5MX0.BYRhpadjrMsLl-ihxJaA5F1uJCLeO0cJhlX9rulmc7Y';

const supabase_client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loginWithGitHub() {
  await supabase_client.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: window.location.href,
    },
  });
}

supabase_client.auth.getSession().then(({ data: { session } }) => {
  if (session) {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    fetchQuestions();
  }
});

async function addQuestion() {
  const question = document.getElementById('question').value;
  const nextReview = document.getElementById('nextReview').value;

  const { error } = await supabase_client
    .from('questions')
    .insert([{ question, next_review_date: nextReview }]);

  if (error) return alert('Error: ' + error.message);

  document.getElementById('question').value = '';
  fetchQuestions();
}

async function fetchQuestions() {
  const today = new Date().toISOString();

  const { data, error } = await supabase_client
    .from('questions')
    .select('*')
    .lte('next_review_date', today);

  if (error) return alert('Fetch error: ' + error.message);

  const list = document.getElementById('questionList');
  list.innerHTML = '';
  data.forEach(q => {
    const li = document.createElement('li');
    li.textContent = q.question;
    list.appendChild(li);
  });
}
