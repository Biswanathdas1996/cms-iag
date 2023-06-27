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
import Chip from "@mui/material/Chip";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import Alert from "@mui/material/Alert";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
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
  const [isCopied, setIsCopied] = useState(false);

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

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  const renderTree = (data, nodeIds = [], path = "") => {
    return Object.keys(data).map((key) => {
      const node = data[key];
      const currentNodeIds = [...nodeIds, key];
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof node === "object" && node !== null) {
        return (
          <TreeItem
            key={key}
            nodeId={currentNodeIds.join("-")}
            label={currentPath}
          >
            {renderTree(node, currentNodeIds, currentPath)}
          </TreeItem>
        );
      }

      return (
        <TreeItem key={key} nodeId={currentNodeIds.join("-")} label={key}>
          <Chip
            icon={<AccountTreeIcon />}
            label={currentPath}
            style={{
              fontSize: 11,
              marginTop: 5,
              float: "right",
            }}
            onClick={() => handleCopy(currentPath)}
            color="primary"
            variant="outlined"
          />

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
    <>
      {isCopied && <Alert severity="success">Path copied!</Alert>}
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

fetch("https://iag-cms-backend.azurewebsites.net/get-data", requestOptions)
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

export default JsonEditor;
