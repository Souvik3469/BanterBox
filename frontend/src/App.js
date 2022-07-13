import logo from "./logo.svg";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Chats from "./components/Chats";
import Chatprovider from "./context/Chatprovider";

function App() {
  return (
    <div className="App">
      <Route path="/" component={Home} exact />
      <Route path="/chats" component={Chats} />
    </div>
  );
}

export default App;
