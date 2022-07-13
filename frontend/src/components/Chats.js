import { Box } from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../context/Chatprovider";
import Chatbox from "./Chatbox";
import "./styles.css";
import MyChats from "./Mychats";
import Sidedrawer from "./sidedrawer";

function Chats() {
  const { user } = ChatState();
  const { fetchagain, setfetchagain } = useState();
  return (
    <div style={{ width: "100%" }}>
      {user && <Sidedrawer />}
      <div className="d">
        {user && (
          <MyChats fetchagain={fetchagain} setfetchagain={setfetchagain} />
        )}
        {user && (
          <Chatbox fetchagain={fetchagain} setfetchagain={setfetchagain} />
        )}
      </div>
    </div>
  );
}

export default Chats;
