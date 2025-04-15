import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Login from '../components/Login'
import Signup from '../components/Signup'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const history = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("token"))
    if(user) {
      history("/usersPage")
    }
  }, [history]);
  return (
    <Container maxW='xl' centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg={'lightcyan'}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="2xl" fontFamily="Work sans" textAlign="center">URL - SHORTNER</Text>
      </Box>
      <Box bg={"lightcyan"} w="100%" borderRadius="lg" borderWidth="1px" p={4}>
        <Tabs variant='soft-rounded' >
          <TabList mb="1em">
            <Tab width="50%">LogIn</Tab>
            <Tab w="50%">SignUp</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login></Login>
            </TabPanel>
            <TabPanel>
              <Signup></Signup>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage