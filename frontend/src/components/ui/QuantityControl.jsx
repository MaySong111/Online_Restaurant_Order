// components/ui/QuantityControl.jsx
import { Box, IconButton, Typography } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

export default function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
  size = "medium", // "small" | "medium" | "large"
}) {
  const sizeConfig = {
    small: {
      iconSize: "small",
      minWidth: 25,
      fontSize: "0.875rem",
    },
    medium: {
      iconSize: "medium",
      minWidth: 35,
      fontSize: "1rem",
    },
    large: {
      iconSize: "large",
      minWidth: 45,
      fontSize: "1.125rem",
    },
  };

  const config = sizeConfig[size];

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        overflow: "hidden",
        width: "fit-content",
      }}
    >
      <IconButton
        size={config.iconSize}
        onClick={onDecrease}
        sx={{ borderRight: 1, borderColor: "divider", borderRadius: 0, px: 1 }}
      >
        <Remove fontSize={config.iconSize} />
      </IconButton>

      <Typography
        sx={{
          minWidth: config.minWidth,
          textAlign: "center",
          fontSize: config.fontSize,
          fontWeight: 500,
        }}
      >
        {quantity}
      </Typography>

      <IconButton
        size={config.iconSize}
        onClick={onIncrease}
        sx={{ borderLeft: 1, borderColor: "divider", borderRadius: 0, px: 1 }}
      >
        <Add fontSize={config.iconSize} />
      </IconButton>
    </Box>
  );
}
