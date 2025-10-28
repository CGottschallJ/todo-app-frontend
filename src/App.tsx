import './App.css';
import { TodoDashboard } from './features/lists/TodoDashboard';
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
