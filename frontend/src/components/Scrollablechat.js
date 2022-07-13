import { Avatar, Tooltip } from "@chakra-ui/react";

import ScrollableFeed from "react-scrollable-feed";
import React, { useEffect, useRef } from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/Chatlogics";
import { ChatState } from "../context/Chatprovider";
import "./styles.css";
const Scrollablechat = ({ messages }) => {
  const { user } = ChatState();

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat">
      {messages &&
        messages.map((m, i) => (
          <>
            <div style={{ display: "flex" }} key={m._id}>
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, m, i, user._id)) && (
                <Tooltip>
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    //src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJnhhZOY_IxRfBAjpON6-TQZRSHejRjLzLqc36imvL7St9E1KhwaU3ohazuUH77QkDdmk&usqp=CAU"
                  />
                </Tooltip>
              )}
              <span
                // className="ik"
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id ? "#cf95eb" : "#e5d66e"
                  }`,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                }}
              >
                {m.content}
              </span>
            </div>
            <div ref={messagesEndRef}></div>
          </>
        ))}
    </div>
  );
};

export default Scrollablechat;