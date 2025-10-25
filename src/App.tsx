import './App.css';
import { TodoDashboard } from './features/todos/TodoDashboard';
import { AuthProvider } from './features/auth/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <TodoDashboard />
    </AuthProvider>
  );
}

export default App;

//trigger build
