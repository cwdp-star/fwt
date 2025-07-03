
import { useNavigate } from 'react-router-dom';

const TestRoute = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Página de Teste
        </h1>
        <p className="text-gray-600 mb-6">
          Se você pode ver esta página, o roteamento está funcionando.
        </p>
        <button
          onClick={() => navigate('/admin-login')}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Ir para Admin Login
        </button>
      </div>
    </div>
  );
};

export default TestRoute;
