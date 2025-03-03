import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { observer } from "mobx-react";
import { AuthStore } from "../stores/AuthStore";
import { useNavigate } from "react-router-dom";

export const AuthPage: React.FC = observer(() => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const authStore = new AuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await authStore.login(email, password);

    if (authStore.token) {
      navigate("/home", { replace: true });
    }
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
            autoComplete="on"
            sx={{ mt: 2, width: "100%" }}
          >
            <TextField
              label="Email"
              name="email"
              autoComplete="username"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
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
