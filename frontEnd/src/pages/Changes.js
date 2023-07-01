import React from "react";
import { useParams } from "react-router-dom";
import { get, post } from "../helper/apiHelper";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

const JsonView = ({ data }) => {
  return (
    <div>
      {data.map((item, index) => (
        <div key={index}>
          <h4>{item[0]}</h4>
          <p>{item[1]}</p>
          <ul>
            {item[2].map((value, idx) => (
              <p key={idx}>
                {" "}
                <b style={{ color: "#3f51b5" }}>
                  {idx === 0 ? "Old text" : "New text"}:
                </b>{" "}
                {value}
              </p>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const { file, brand } = useParams();
  const [data, setData] = React.useState(null);

  const fetchData = async () => {
    const response = await post("/get-diff-data", {
      brand_name: brand,
      file_name: file,
    });
    setData(response);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
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
            <h2>{brand} Changes</h2>
            {data && <JsonView data={data} />}
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default App;
