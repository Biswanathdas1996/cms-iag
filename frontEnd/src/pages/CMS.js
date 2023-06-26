import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { makeStyles } from "@material-ui/core/styles";
import { TreeView, TreeItem } from "@material-ui/lab";
import { Button } from "@material-ui/core";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Stack from "@mui/material/Stack";
import { get, post } from "../helper/apiHelper";
import swal from "sweetalert";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  form: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  saveButton: {
    marginLeft: theme.spacing(2),
  },
}));

const JsonEditor = () => {
  const classes = useStyles();
  const [editedJsonData, setEditedJsonData] = useState({});

  const [brand, setBrand] = useState("NRMA");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await post("/get-data", {
      brand_name: brand,
    });
    setEditedJsonData(response);
    console.log("==response==>", response);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, [brand]);

  const handleChange = (event, nodeIds) => {
    const editedData = { ...editedJsonData };

    let currentNode = editedData;
    nodeIds.forEach((nodeId, index) => {
      if (index === nodeIds.length - 1) {
        // Update the value of the last node
        currentNode[nodeId] = event.target.value;
      } else {
        if (!currentNode[nodeId]) {
          currentNode[nodeId] = {};
        }
        currentNode = currentNode[nodeId];
      }
    });

    setEditedJsonData(editedData);
  };

  const handleSave = async () => {
    // Send the editedJsonData to the server or perform any desired action

    const requestData = {
      brand_name: brand,
      data: editedJsonData,
    };
    console.log("------", requestData);
    const response = await post("/save-data", requestData);
    if (response) {
      swal("Updated!", "data updated!", "success");
      fetchData();
    }
  };

  const renderTree = (data, nodeIds = []) => {
    return Object.keys(data).map((key) => {
      const node = data[key];
      const currentNodeIds = [...nodeIds, key];

      if (typeof node === "object" && node !== null) {
        return (
          <TreeItem key={key} nodeId={currentNodeIds.join("-")} label={key}>
            {renderTree(node, currentNodeIds)}
          </TreeItem>
        );
      }

      return (
        <TreeItem key={key} nodeId={currentNodeIds.join("-")} label={key}>
          <input
            name={key}
            value={node}
            onChange={(event) => handleChange(event, currentNodeIds)}
            className={classes.input}
            style={{
              padding: 7,
              margin: 5,
              width: "97%",
              background: "#8080801c",
              borderRadius: 6,
              border: "1px solid grey",
            }}
          />
        </TreeItem>
      );
    });
  };
  return (
    <Grid container spacing={3} mb={3}>
      <Grid item xs={12} md={12} lg={12}>
        <Card
          style={{
            zIndex: 10,
            position: "relative",
            borderRadius: 12,
            padding: "2.5rem",
            margin: "2.5rem",
          }}
        >
          <Stack spacing={2} direction="row" style={{ marginBottom: 25 }}>
            <Button
              variant={brand === "NRMA" ? "contained" : "outlined"}
              onClick={() => setBrand("NRMA")}
            >
              NRMA
            </Button>
            <Button
              variant={brand === "ANZ" ? "contained" : "outlined"}
              onClick={() => setBrand("ANZ")}
            >
              ANZ
            </Button>
          </Stack>

          {!loading ? (
            <div className={classes.root}>
              <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
              >
                {renderTree(editedJsonData)}
              </TreeView>
              <br />
              <br />
              <br />
              <div className={classes.form}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <center>
              <div className="loader"></div>
            </center>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default JsonEditor;
