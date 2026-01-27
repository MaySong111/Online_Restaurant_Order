// features/contact/ContactPage.jsx
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
  <Box textAlign="center" mb={6}>
    <Typography variant="h3" gutterBottom fontWeight="bold" color="success.main">
      Get In Touch
    </Typography>
    <Typography variant="h6" color="text.secondary">
      We'd love to hear from you! Send us a message or visit our location.
    </Typography>
  </Box>

  <Grid container spacing={4}>
    <Grid size={{ xs: 12, md: 6 }}>
      <Paper sx={{ p: 4, height: "100%" }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" color="success.main">
          Visit Us
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Come visit our restaurant and enjoy a wonderful dining experience.
        </Typography>

        <Box
          sx={{
            width: "100%",
            height: 400,
            borderRadius: 2,
            overflow: "hidden",
            border: "2px solid",
            borderColor: "divider",
            mb: 2,
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.5168!2d151.2073!3d-33.8688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ae401e8b26ad%3A0x5017d681632bfc0!2sSydney%20NSW%2C%20Australia!5e0!3m2!1sen!2sau!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Box>

        <Button
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<LocationOn />}
          href="https://maps.google.com/?q=123+Food+Street+Sydney+NSW+2000"
          target="_blank"
        >
          Get Directions on Google Maps
        </Button>
      </Paper>
    </Grid>

    <Grid size={{ xs: 12, md: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" color="success.main">
          Send Us a Message
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Fill out the form below and we'll get back to you as soon as possible.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Your Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Your Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            multiline
            rows={4}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 3 }}
          >
            Send Message
          </Button>
        </form>
      </Paper>
    </Grid>
  </Grid>
</Container>
  );
}