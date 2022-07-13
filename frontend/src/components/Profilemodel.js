import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";
import { ChatState } from "../context/Chatprovider";
const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen} >{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} background={"blue.100"} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay  />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
            background={"blue.300"}
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
            background={"green.200"}
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
            background={"blue.300"} >
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
