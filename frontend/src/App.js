// App.js
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Task from "./components/Task";
import HomePage from "./components/HomePage";

function App() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-r from-white to-gray-250 relative">
      <Toaster position="top-right" gutter={8} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:projectId" element={<Task />} />
      </Routes>
    </div>
  );
}

export default App;
