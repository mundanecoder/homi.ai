// UserDashboard.tsx
import React, { useState } from "react";
import UserPreferenceForm from "./UserPreferenceForm";

interface UserDashboardProps {
  token: string;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ token }) => {
  const [showPreferenceForm, setShowPreferenceForm] = useState(false);

  return (
    <div className="bg-white dark:bg-black/70 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        User Dashboard
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Welcome to your user dashboard. You can set your property preferences
        here.
      </p>
      {!showPreferenceForm && (
        <button
          onClick={() => setShowPreferenceForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Set Property Preferences
        </button>
      )}
      {showPreferenceForm && <UserPreferenceForm token={token} />}
    </div>
  );
};

export default UserDashboard;
