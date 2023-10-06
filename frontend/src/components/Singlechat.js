import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/layout";
import {
  background,
  FormControl,
  IconButton,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import animationdata from "./typing.json";
import { getSenderFull, getSender } from "../config/Chatlogics";
import { ChatState } from "../context/Chatprovider";
import ProfileModal from "./Profilemodel";
import UpdateGroupChatModal from "./Updategroupmodal";
import "./styles.css";
import axios from "axios";
import Scrollablechat from "./Scrollablechat";
import io from "socket.io-client";
import Lottie from "react-lottie";
const ENDPOINT = "http://localhost:5000"; // "https://chatify.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const SingleChat = ({ fetchagain, setfetchagain }) => {
  const Toast = useToast();
  const [message, setmessage] = useState([]);
  const [socketconnected, setsocketconnected] = useState(false);
  const [loading, setloading] = useState(false);
  const [newmessage, setnewmessage] = useState();
    const [typing, settying] = useState(false);
  const [istyping, setistyping] = useState(false);
  const { user, selectedChat, setSelectedChat, setNotification, notification } =
    ChatState();
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => setsocketconnected(true));
    socket.on("typing", () => setistyping(true));
    socket.on("stop typing", () => setistyping(false));
  },[]);
    const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationdata,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const fetchmessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setloading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      setmessage(data);
      setloading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      Toast({
        title: "error occured",
        description: "failed to load the messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchmessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setfetchagain(!fetchagain);
        }
      } else {
        setmessage([...message, newMessageRecieved]);
      }
    });
  });
  const sendmessage = async (e) => {
    if (e.key === "Enter" && newmessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setnewmessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newmessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);
        socket.emit("new message", data);
        setmessage([...message, data]);
      } catch (error) {
        Toast({
          title: "error occured",
          description: "failed to send the messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  const typinghandler = (e) => {
    setnewmessage(e.target.value);

    /// typing indicator logic will be here
     if (!socketconnected) return;
    if (!typing) {
      settying(true);
      socket.emit("typing", selectedChat._id);
    }
    let lasttypingtime = new Date().getTime();
    var timerlenght = 4000;
    setTimeout(() => {
      var timenow = new Date().getTime();
      var timediff = timenow - lasttypingtime;
      if (timediff >= timerlenght && typing) {
        socket.emit("stop typing", selectedChat._id);
        settying(false);
      }
    }, timerlenght);
  
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
              bgGradient="linear(to-t, blue.200, green.200)"
            py={3}
            px={2}
            w="100%"
            borderRadius="lg"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              
              d={{ base: "flex", md: "none" }}
              // background={"white"}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {message &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchagain={fetchagain}
                    setfetchagain={setfetchagain}
                    fetchMessages={fetchmessages}
                  />
                </>
              ))}
          </Text>
          <div
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            // bg="green.100"
           
            w="100%"
            h="90%"
            borderRadius="lg"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="m">
                <Scrollablechat messages={message} />
              </div>
            )}
            <FormControl onKeyDown={sendmessage} isRequired mt={3}>
                 {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                  <div></div>
                </div>
              ) : (
                <div></div>
              )}
                <Input
                variant="filled"
              
                color="white"
                placeholder="Enter a message.."
                value={newmessage}
                onChange={typinghandler}
                
              />
            </FormControl>
          </div>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center"
      bgGradient="linear(to-t, blue.200, green.200)"
        h="100%">
          <Text fontSize="3xl"  pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};
export default SingleChat;