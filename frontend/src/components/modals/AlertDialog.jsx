import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";

export default function AlertDialog({ open, message, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      {/* <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        Notice
      </DialogTitle> */}
      <DialogContent>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{ minWidth: 80 }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
