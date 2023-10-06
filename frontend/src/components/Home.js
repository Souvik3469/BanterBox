import { Box, Center, Container, Text } from "@chakra-ui/react";
import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "./Login";
import Signup from "./Signup";
function Home() {
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bgGradient="linear(to-t, blue.200, green.200)"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="blue.400"
      >
        <Center fontSize="4xl" fontFamily="Work sans" color="black">
          <b>Chatify</b>
        </Center>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px" >
        <Tabs>
          <TabList>
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Signup</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <p>
                <Signup />
              </p>
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Home;
