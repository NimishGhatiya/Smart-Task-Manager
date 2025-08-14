import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { store } from './store.js';

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Auth middleware
function requireAuth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  const user = store.auth(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  req.user = user;
  next();
}

// Health
app.get('/health', (_req, res) => res.json({ ok: true }));

// Users
app.post('/users', (req, res) => {
  try { const user = store.createUser(req.body); res.status(201).json(user); }
  catch (e) { res.status(e.status || 400).json({ error: e.message }); }
});

app.post('/auth/login', (req, res) => {
  try { const { token, user } = store.login(req.body); res.json({ token, user }); }
  catch (e) { res.status(e.status || 400).json({ error: e.message }); }
});

app.get('/users', (_req, res) => {
  res.json([...store.users.values()]);
});

// Tasks
app.post('/tasks', requireAuth, (req, res) => {
  try { const task = store.createTask(req.body); res.status(201).json(task); }
  catch (e) { res.status(e.status || 400).json({ error: e.message }); }
});

app.get('/tasks', (req, res) => {
  const { assigneeId, blocked } = req.query;
  let list = [...store.tasks.values()];
  if (assigneeId) list = list.filter(t => t.assigneeId === assigneeId);
  if (blocked === 'true') list = list.filter(t => store.isBlocked(t));
  res.json(list);
});

app.get('/tasks/:id', (req, res) => {
  const t = store.tasks.get(req.params.id);
  if (!t) return res.status(404).json({ error: 'Not found' });
  res.json(t);
});

app.put('/tasks/:id', requireAuth, (req, res) => {
  try { const task = store.updateTask(req.params.id, req.body); res.json(task); }
  catch (e) { res.status(e.status || 400).json({ error: e.message }); }
});

app.delete('/tasks/:id', requireAuth, (req, res) => {
  const ok = store.deleteTask(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

app.post('/tasks/:id/complete', requireAuth, (req, res) => {
  const { ok, reason } = store.canComplete(req.params.id);
  if (!ok) return res.status(400).json({ error: reason });
  const task = store.updateTask(req.params.id, { status: 'Done' });
  res.json(task);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
