import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, Card, Stack, useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import EditForm from "./EditForm";
const User = ({ user, onDelete, onUpdate }) => {
  const [email, setEmail] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setFirst_name(user.first_name);
    setLast_name(user.last_name);
    setEmail(user.email);
  }, [user]);

  const handleClickDelete = async () => {
    try {
      await axios.delete(`https://reqres.in/api/users/${user.id}`);

      toast({
        title: "User Deleted Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      onDelete(user.id); 
    } catch (err) {
      toast({
        title: "Error Occurred while Deleting!",
        description: err.response?.data?.message || "Failed to delete user",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <div>
      <Card key={user.id} width="320px">
        <Stack spacing="4" p="4">
          <Avatar size="lg" src={user.avatar} />
          <Box>
            <Box fontWeight="bold">
              {first_name} {last_name}
            </Box>
            <Box fontSize="sm" color="gray.500">
              {email}
            </Box>
          </Box>
          <Stack direction="row" justify="flex-end">
          <Button variant="outline" onClick={onOpen}>
              Edit
            </Button>
            <Button onClick={handleClickDelete}>Delete</Button>
          </Stack>
        </Stack>
      </Card>
      <EditForm isOpen={isOpen} onClose={onClose} user={user} onUpdate={onUpdate} />
    </div>
  );
};

export default User;
