import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Upload from "./pages/Upload";
import Verify from "./pages/Verify";
import Realtime from "./pages/Realtime";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"         element={<Upload />}   />
        <Route path="/verify"   element={<Verify />}   />
        <Route path="/realtime" element={<Realtime />} />
      </Routes>
    </BrowserRouter>
  );
}