import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-fintech-dark text-fintech-text">
      <Sidebar />
      <div className="ml-72 flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-fintech-dark via-fintech-card to-fintech-dark p-6 pt-24">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
