import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Home } from "./pages/Home";
import { ProjectDetails } from "./pages/ProjectDetails";
import { StatusBar } from "./components/StatusBar";
import { CHARACTERS } from "./components/icons/AvatarPickerModal";

function App() {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedDisk, setSelectedDisk] = useState(null);
  const [systemInfo, setSystemInfo] = useState(null);

  const fetchSystemInfo = async () => {
    try {
      const info = await invoke("get_system_info");
      setSystemInfo(info);
    } catch (error) {
      console.error("Sistem bilgisi alınamadı:", error);
    }
  };

  useEffect(() => {
    fetchSystemInfo();
    const interval = setInterval(fetchSystemInfo, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("selected_avatar");
    if (saved) {
      const char = CHARACTERS.find(c => c.id === saved);
      if (char) setSelectedAvatar(char);
    }
  }, []);

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    localStorage.setItem("selected_avatar", avatar.id);
  };

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              selectedAvatar={selectedAvatar} 
              onAvatarSelect={handleAvatarSelect} 
              selectedDisk={selectedDisk} 
              allDisks={systemInfo?.metrics?.disks || []}
            />
          } 
        />
        <Route path="/project" element={<ProjectDetails selectedAvatar={selectedAvatar} />} />
      </Routes>
      <StatusBar 
        selectedAvatar={selectedAvatar} 
        selectedDisk={selectedDisk}
        onDiskSelect={setSelectedDisk}
        systemInfo={systemInfo}
      />
    </>
  );
}

export default App;
