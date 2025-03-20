import { useEffect } from 'react';
import useAuthStore from '../../utils/useAuth'; // Import your Zustand store
import GoogleDriveTable from '../components/GoogleDriveTable';
import ChannelList from '../components/ChannelList';
const Dashboard = () => {
  const { token, removeAuth } = useAuthStore(); // Access the store
  const decodedToken = JSON.parse(atob(token.split('.')[1]))

  const logout = () => {
    removeAuth(); // Remove auth data from the store
    // Redirect to login page
    window.location.href = '/login';
  };

  useEffect(() => {
    if (!token) {
      window.location.href = '/login'; // Redirect if not logged in
    }
  }, [token]);

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0">
        <div className="text-xl font-bold">Welcome, {decodedToken.email}</div>
        <button
          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
          onClick={logout}
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="p-6 space-y-6 mt-16">
        {/* GoogleDrive Files Section */}
        <div className="text-3xl font-semibold text-gray-800">GoogleDriveFiles</div>
        <GoogleDriveTable />

        {/* Slack Channel Messages Section */}
        <div className="text-3xl font-semibold text-gray-800">Messages of Slack Channel</div>
        <ChannelList />
      </div>
    </div>
  );
};

export default Dashboard;
