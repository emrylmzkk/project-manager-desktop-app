import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { ProjectDetails } from "./pages/ProjectDetails";
import { StatusBar } from "./components/StatusBar";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project" element={<ProjectDetails />} />
      </Routes>
      <StatusBar />
    </>
  );
}

export default App;
