"use client";
import * as React from "react";
import Box from "@mui/material/Box";

import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { BiPlusCircle } from "react-icons/bi";
export default function InputWithIcon() {
  return (
    <Box sx={{ "& > :not(style)": { m: 1 } }}>
      <TextField
        id="input-with-icon-textfield"
        label="TextField"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BiPlusCircle />
            </InputAdornment>
          ),
        }}
        variant="standard"
      />
      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
        <BiPlusCircle />
        <TextField id="input-with-sx" label="With sx" variant="standard" />
      </Box>
    </Box>
  );
}
