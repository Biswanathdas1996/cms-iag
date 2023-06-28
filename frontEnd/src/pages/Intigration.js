import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { BASE_URL } from "../config";

const Intigration = () => {
  return (
    <>
      <Grid container spacing={3} mb={3} style={{ marginTop: 0 }}>
        <Grid item xs={12} md={12} lg={12} style={{ marginTop: 0 }}>
          <Card
            style={{
              zIndex: 10,
              position: "relative",
              borderRadius: 12,
              padding: "2.5rem",
              margin: "2.5rem",
              marginTop: 0,
            }}
          >
            <h4>Intigration Details</h4>
            <pre>
              <code>
                {`var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "brand_name": "ANZ"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("${BASE_URL}/get-data", requestOptions)
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));`}
              </code>
            </pre>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Intigration;
