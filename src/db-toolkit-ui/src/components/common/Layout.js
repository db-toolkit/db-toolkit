
import Sidebar from './Sidebar';

function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        {children}
      </main>
    </div>
  );
}

export default Layout;
