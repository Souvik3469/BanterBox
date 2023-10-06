import { Box } from "@chakra-ui/layout";
import { ChatState } from "../context/Chatprovider";
import { Center, Square, Circle } from "@chakra-ui/react";
import Singlechat from "./Singlechat";
const Chatbox = ({ fetchagain, setfetchagain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bgGradient="linear(to-t, black, green.500)"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Singlechat fetchagain={fetchagain} setfetchagain={setfetchagain} />
    </Box>
  );
};

export default Chatbox;
