import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ManageForms } from './pages/ManageForms';
import { FormConfig } from './pages/FormConfig';
import { TaskList } from './pages/TaskList';
import { FormResponseReview } from './pages/FormResponseReview';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ManageForms />} />
        <Route path="/forms" element={<ManageForms />} />
        <Route path="/forms/new" element={<FormConfig />} />
        <Route path="/forms/:formId" element={<FormConfig />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/tasks/review" element={<FormResponseReview />} />
      </Routes>
    </Layout>
  );
}

export default App;
