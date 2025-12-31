import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Home from './pages/Home';
import KnowledgeGraph from './pages/KnowledgeGraph';
import Articles from './pages/Articles';
import Problems from './pages/Problems';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="graph" element={<KnowledgeGraph />} />
          <Route path="articles" element={<Articles />} />
          <Route path="problems" element={<Problems />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
