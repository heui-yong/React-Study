import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./components/Main";
import { AppProvider } from "./AppContext";

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="*" element={<Main />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
