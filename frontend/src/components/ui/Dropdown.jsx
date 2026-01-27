import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ArrowDropDown } from "@mui/icons-material";
import { Link } from "react-router-dom";
import {
  ROUTES
} from "../../constants/routes";

export default function Dropdown() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        color="inherit"
        onClick={handleClick}
        endIcon={<ArrowDropDown />}
      >
        Admin
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        <MenuItem
          component={Link}
          to={ROUTES.ADMIN_MENUITEM_MANAGE}
          onClick={handleClose}
        >
          Menu items
        </MenuItem>
        
        <MenuItem
          component={Link}
          to={ROUTES.
            ADMIN_ORDER_MANAGE}
          onClick={handleClose}
        >
          Orders Management
        </MenuItem>
      </Menu>
    </div>
  );
}
