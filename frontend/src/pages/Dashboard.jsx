import { useEffect } from 'react';
import useAuthStore from '../../utils/useAuth'; // Import your Zustand store
import GoogleDriveTable from '../components/GoogleDriveTable';
import ChannelList from '../components/ChannelList';
import JiraIssuesList from '../components/JiraIssuesList';

const Dashboard = () => {
  const { token, removeAuth } = useAuthStore(); // Access the store
  const decodedToken = JSON.parse(atob(token.split('.')[1]));

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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white p-4 shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          <div className="text-2xl font-bold">Welcome, {decodedToken.email}</div>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 space-y-6 mt-20 max-w-screen-xl mx-auto">
        {/* GoogleDrive Files Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-semibold text-gray-800 mb-4">GoogleDrive Files</div>
          <GoogleDriveTable />
        </div>

        {/* Slack Channel Messages Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-semibold text-gray-800 mb-4">Messages of Slack Channel</div>
          <ChannelList />
        </div>

        {/* Jira Issues Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-semibold text-gray-800 mb-4">Jira Issues</div>
          <JiraIssuesList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
