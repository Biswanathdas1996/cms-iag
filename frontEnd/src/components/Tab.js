import React from "react";
import { Button } from "@material-ui/core";
import Stack from "@mui/material/Stack";

const Tab = ({ setBrand, brand, brandList }) => {
  console.log("--brandList--->", brandList);
  return (
    <>
      <Stack spacing={2} direction="row" style={{ marginBottom: 25 }}>
        {brandList?.map((data, i) => {
          return (
            <Button
              variant={brand === data ? "contained" : "outlined"}
              onClick={() => setBrand(data)}
            >
              {data}
            </Button>
          );
        })}
      </Stack>
    </>
  );
};

export default Tab;
