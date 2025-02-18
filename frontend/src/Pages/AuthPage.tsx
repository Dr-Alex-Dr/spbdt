import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { observer } from "mobx-react";
import { AuthStore } from "../stores/AuthStore";

export const AuthPage: React.FC = observer(() => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const authStore = new AuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    authStore.login(email, password);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs">
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Вход в аккаунт
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 2, width: "100%" }}
          >
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Войти
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
});
