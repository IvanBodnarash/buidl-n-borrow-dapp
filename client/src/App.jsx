import "./App.css";
import DevModeInstruction from "./components/DevModeInstruction";
import Navbar from "./components/Navbar";
import DocumentationSection from "./components/DocumentationSection";
import LendingPlatformSection from "./components/LendingPlatformSection";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <DevModeInstruction />
        <LendingPlatformSection />
        <DocumentationSection />
      </main>
    </>
  );
}

export default App;
