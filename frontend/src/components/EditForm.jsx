import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const EditForm = ({ isOpen, onClose, user, onUpdate }) => {
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const toast = useToast();
  const token = JSON.parse(localStorage.getItem("token"));

  const handleSubmit = async() => {
    const updatedUser = {
      ...user,
      first_name: firstName,
      last_name: lastName,
      email: email,
    };
    try {
        await axios.put(`https://reqres.in/api/users/${user.id}`, {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
              },
        }, updatedUser);

        toast({
          title: "User Updated Successfully", 
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
  
        onUpdate(updatedUser); 
        onClose();

    } catch (err) {
    toast({
        title: "Error Occurred while Editing!",
        description: err.response?.data?.message || "Failed to Edit user",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
    });
    }
    onUpdate(updatedUser); 
    onClose(); 
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>First Name</FormLabel>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Last Name</FormLabel>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Email</FormLabel>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Save Changes
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditForm;
