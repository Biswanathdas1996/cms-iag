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

import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

import _ from "lodash";

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
  const [previewData, setPreviewData] = useState(null);

  const [brand, setBrand] = useState(null);
  const [brandList, setBrandList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [expanded, setExpanded] = React.useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedNodes, setExpandedNodes] = useState([]);

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
    setPreviewData(response);
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

  const handleExpand = (event, nodeIds) => {
    const nodeId = nodeIds.join("-");

    setExpandedNodes((prevExpandedNodes) => {
      if (prevExpandedNodes.includes(nodeId)) {
        return prevExpandedNodes.filter((id) => id !== nodeId);
      } else {
        return [...prevExpandedNodes, nodeId];
      }
    });
  };

  const extractAllNodeIds = (data, nodeIds = [], path = "") => {
    let allIds = [...nodeIds];

    Object.keys(data).forEach((key) => {
      const node = data[key];
      const currentNodeIds = [...nodeIds, key];

      if (typeof node === "object" && node !== null) {
        allIds.push(currentNodeIds.join("-"));
        const childIds = extractAllNodeIds(node, currentNodeIds);
        allIds = allIds.concat(childIds);
      }
    });

    return allIds;
  };

  const renderTree = (data, nodeIds = [], path = "") => {
    return Object.keys(data).map((key) => {
      const node = data[key];
      const currentNodeIds = [...nodeIds, key];
      const currentPath = path ? `${path}.${key}` : key;
      const urlPath = path ? `${convertDotToSlashNotation(path)}` : key;

      if (typeof node === "object" && node !== null) {
        const childNodes = renderTree(
          node,
          currentNodeIds,
          currentPath,
          urlPath
        );

        // Skip rendering if all child nodes are filtered out
        if (childNodes.length === 0) {
          return null;
        }

        const nodeId = currentNodeIds.join("-");
        const isNodeExpanded = expandedNodes.includes(nodeId);

        return (
          <TreeItem
            key={key}
            nodeId={nodeId}
            label={key}
            expanded={isNodeExpanded}
            onLabelClick={(event) => handleExpand(event, currentNodeIds)}
            style={{ color: "black" }}
          >
            {childNodes}
          </TreeItem>
        );
      }

      const nodeValue = String(node);

      // Filter the node value based on the search query
      const isNodeValueMatching = nodeValue
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Skip rendering if the node value doesn't match the search query
      if (!isNodeValueMatching) {
        return null;
      }
      const isNodeExpanded = expandedNodes.includes(currentNodeIds.join("-"));

      return (
        <TreeItem
          key={key}
          nodeId={currentNodeIds.join("-")}
          label={key}
          expanded={isNodeExpanded}
          onLabelClick={(event) => handleExpand(event, currentNodeIds)}
          style={{ color: "#808b96" }}
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
            label={`${_.get(previewData, currentPath, "")}`}
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

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? extractAllNodeIds(editedJsonData) : []
    );
  };

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
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
            {!loading ? (
              <>
                {editedJsonData && (
                  <TextField
                    label="Search"
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    style={{ marginBottom: "1rem" }}
                  />
                )}

                {editedJsonData && editedJsonData != {} && (
                  <Button
                    variant="contained"
                    color="info"
                    onClick={handleExpandClick}
                    style={{ marginBottom: "1rem", float: "right" }}
                  >
                    {expanded.length === 0 ? "Expand all" : "Collapse all"}
                  </Button>
                )}

                {brandList && (
                  <Tab
                    brand={brand}
                    setBrand={setBrand}
                    brandList={brandList}
                  />
                )}
                {editedJsonData && editedJsonData != {} ? (
                  <div className={classes.root}>
                    <TreeView
                      defaultCollapseIcon={<ExpandMoreIcon />}
                      defaultExpandIcon={<ChevronRightIcon />}
                      expanded={expanded}
                      onNodeToggle={handleToggle}
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
