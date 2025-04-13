import {
  Avatar,
  Box,
  Button,
  Card,
  Stack,
  useToast,
  Flex,
  Input,
  Text,
  Container,
  IconButton,
  Center,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
  const history = useNavigate();
  const Toast = useToast();
  const [longUrl, setLongUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const userId = localStorage.getItem("_id");

  const token = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    if (!token) {
      history("/");
    }
  }, [history]);

  const handleGenerateShortUrl = async () => {
    if (!name || !token) {
      Toast({
        title: "Missing fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      console.log(name + " " + token);
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(
        "/api/user/link/shortURL",
        {
          name: `${name}`,
          url: `${longUrl}`,
        },
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data);
      setLinks((prevLinks) => [...prevLinks, response.data.data]);
      Toast({
        title: `${response.data.message}`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (err) {
      console.log(err.message);
      // toast()
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteLink = async (shortUrl) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `/api/user/link/short/${shortUrl}`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setLinks((prevLinks) =>
        prevLinks.filter((link) => link.shortUrl !== shortUrl)
      );
      Toast({
        title: "Link Deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (err) {
      Toast({
        title: "Error Occurred!",
        description: err.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleGetAnalytics = (shortURL) => {
    history(`/${shortURL}`);
  };
  const getLinks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/user/link/allLinks`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLinks(response.data.data);

      Toast({
        title: "fetched all URL successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (err) {
      Toast({
        title: "Error Occurred!",
        description: err.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLinks();
  }, []);

  const handleClickLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("_id");
    history("/");

    Toast({
      title: "Logout Successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };

  if (isLoading) {
    return (
      <Center h="100vh" w="100vw">
        <Spinner size="xl" thickness="4px" color="blue.500" />
      </Center>
    );
  }

  return (
    <>
      <Box>
        <Button onClick={handleClickLogout}>Logout</Button>
      </Box>
      <Container maxW="2xl" centerContent>
        <Box
          display="flex"
          justifyContent="center"
          p={3}
          bg={"#E8F9FF"}
          w="100%"
          m="40px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
        >
          <Text fontSize="2xl" fontFamily="Work sans" textAlign="center">
            Create Short URL
          </Text>
        </Box>
        <Box maxW="2xl" w="100%" px={4}>
          <Flex p={3} align="center">
            <Input
              value={longUrl}
              flex="1"
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="Enter long URL"
              isRequired
              maxLength={500}
              mr={3}
            />
            <Input
              value={name}
              flex="1"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for the URL"
              isRequired
              maxLength={500}
              mr={3}
            />
            <Button onClick={handleGenerateShortUrl} colorScheme="teal">
              Submit
            </Button>
          </Flex>
        </Box>

        {/* Links List */}
        <Box
          display="flex"
          justifyContent="center"
          p={3}
          bg={"#E8F9FF"}
          w="100%"
          m="40px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
        >
          <Text fontSize="2xl" mb={3}>
            Your Links
          </Text>
        </Box>
        {links.length === 0 ? (
          <Text>No links created yet.</Text>
        ) : (
          links.map((link) => (
            <Box
              key={link.shortUrl}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={3}
              bg={"#E8F9FF"}
              w="100%"
              m="1px"
              borderRadius="lg"
              borderWidth="1px"
            >
              <Text>{link.name}</Text>
              <Box>
                <Button
                  colorScheme="teal"
                  mr={3}
                  onClick={() => handleGetAnalytics(link.shortUrl)}
                  opacity="70%"
                >
                  Analytics
                </Button>
                <Button
                  colorScheme="red"
                  mr={3}
                  onClick={() => handleDeleteLink(link.shortUrl)}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          ))
        )}
      </Container>
    </>
  );
};

export default UsersPage;
