import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { makeStyles } from "@material-ui/core/styles";
import { TreeView, TreeItem } from "@material-ui/lab";
import { Button } from "@material-ui/core";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { get, post } from "../helper/apiHelper";
import swal from "sweetalert";
import Chip from "@mui/material/Chip";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import Alert from "@mui/material/Alert";
import Tab from "../components/Tab";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import HttpIcon from "@mui/icons-material/Http";

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
  const [editedJsonData, setEditedJsonData] = useState(null);

  const [brand, setBrand] = useState(null);
  const [brandList, setBrandList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const fetchBrandDataList = async () => {
    setLoading(true);
    const response = await get("/get-brand-list");
    setBrandList(response);
    console.log("==response==>", response);
    setLoading(false);
  };

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
    fetchBrandDataList();
  }, []);

  React.useEffect(() => {
    brand && fetchData();
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
      swal("Updated!", "data updated!", "success").then((value) => {
        fetchData();
      });
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

  function convertDotToSlashNotation(inputString) {
    return inputString.replace(/\./g, "/");
  }

  const renderTree = (data, nodeIds = [], path = "") => {
    return Object.keys(data).map((key) => {
      const node = data[key];
      const currentNodeIds = [...nodeIds, key];
      const currentPath = path ? `${path}.${key}` : key;
      const urlPath = path ? `${convertDotToSlashNotation(path)}` : key;

      if (typeof node === "object" && node !== null) {
        return (
          <TreeItem key={key} nodeId={currentNodeIds.join("-")} label={key}>
            {renderTree(node, currentNodeIds, currentPath, urlPath)}
          </TreeItem>
        );
      }

      return (
        <TreeItem
          key={key}
          nodeId={currentNodeIds.join("-")}
          label={key}
          style={
            typeof node != "object" ? { color: "#808b96" } : { color: "red" }
          }
        >
          <Chip
            icon={<AccountTreeIcon />}
            label={"Copy Path"}
            // label={currentPath}
            style={{
              fontSize: 10,
              marginTop: 5,
              float: "right",
            }}
            onClick={() => handleCopy(currentPath)}
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<TextFieldsIcon />}
            label={`${node}`}
            style={{
              fontSize: 10,
              marginTop: 5,
              float: "right",
              marginRight: 5,
            }}
          />
          <Chip
            icon={<HttpIcon />}
            label={`${urlPath}`}
            color="primary"
            variant="outlined"
            style={{
              fontSize: 10,
              marginTop: 5,
              float: "right",
              marginRight: 5,
              letterSpacing: 1,
            }}
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
              // background: "#8080801c",
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
            {brandList && (
              <Tab brand={brand} setBrand={setBrand} brandList={brandList} />
            )}

            {!loading ? (
              <>
                {editedJsonData && editedJsonData != {} ? (
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
                  "Please select a brand"
                )}
              </>
            ) : (
              <center>
                <div className="loader"></div>
              </center>
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default JsonEditor;
