import { Button } from "@chakra-ui/button";
import { Effect } from "react-notification-badge";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import NotificationBadge from "react-notification-badge";

import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { Center, Square, Circle, useDisclosure } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";

import { ChatState } from "../context/Chatprovider";
import ProfileModal from "./Profilemodel";
import { on } from "events";
import Chatloading from "./Chatloading";
import Userlisitem from "./Userlisitem";
import UserListItem from "./Userlisitem";
import { getSender } from "../config/Chatlogics";


function SideDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure(); // chakra side widget
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const toast = useToast();

  const history = useHistory();

  const logoutHandler = () => {
    // localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "please enter something",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: "failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const accesChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data.id)) setChats([data, ...chats]);
      console.log(data);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Center
      display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="green.200"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="2px"
        bgGradient="linear(to-t, blue.200, green.200)"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>
             <b>Search User</b> 
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="4xl" fontFamily="Work sans">
          <b>BanterBox</b>
        </Text>
        <div >
          <Menu>
            <MenuButton p={2}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "no new message"}
              {notification.map((n) => (
                <MenuItem
                  key={n.id}
                  onClick={() => {
                    setSelectedChat(n.chat);
                    setNotification(notification.filter((n) => n !== n));
                  }}
                >
                  {n.chat.isGroupChat
                    ? `new message in ${n.chat.chatName}`
                    : `new message from ${getSender(user, n.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <MenuDivider />
              <ProfileModal user={user}>
                <MenuItem>My profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Center>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen} >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="0px" bg="green.400">Search Users</DrawerHeader>
          <DrawerBody bgGradient="linear(to-t, blue.200, green.200)">
            <Box display="flex" pb={2} bg="green.200">
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
          
              
             
            </Box>
             <Button onClick={handleSearch} alignItems="center">Go</Button>
            {loading ? (
              <Chatloading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accesChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto " display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;