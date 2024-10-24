import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  console.log(messages);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected to server", socket.id);
    });

    socket.on("received-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
      // console.log(messages);
    });

    socket.on("welcome", (message) => {
      console.log(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <Container maxWidth="md">
      <Typography variant="h6" component="div" gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          value={roomName}
          label="Room Name"
          variant="outlined"
          onChange={(e) => setRoomName(e.target.value)}
        ></TextField>
        <Button type="submit" variant="contained" color="primary" size="medium">
          Join
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          label="Message"
          variant="outlined"
          onChange={(e) => setMessage(e.target.value)}
        ></TextField>
        <br />
        <TextField
          value={room}
          label="Room"
          variant="outlined"
          onChange={(e) => setRoom(e.target.value)}
        ></TextField>
        <Button type="submit" variant="contained" color="primary" size="medium">
          Send
        </Button>
      </form>
      <Stack>
        {messages.map((message, index) => (
          <Typography key={index} variant="body1" component="div" gutterBottom>
            {message}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
