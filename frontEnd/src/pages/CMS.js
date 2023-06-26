import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { makeStyles } from "@material-ui/core/styles";
import { TreeView, TreeItem } from "@material-ui/lab";
import { Button } from "@material-ui/core";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { get, post } from "../helper/apiHelper";

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

const jsonData = {
  brand_name: "ANZ",
  data: {
    dashboard: {
      view_policy_button: "View Policy",
      view_renewal_button: "Renewal Policy",
    },
    policy_details: {
      policy_banner: "View Policy banner",
      view_renewal_button: "Renewal Policy",
    },
  },
};

const JsonEditor = () => {
  const classes = useStyles();
  const [editedJsonData, setEditedJsonData] = useState(jsonData || {});

  const [brand, setBrand] = useState("NRMA");

  const fetchData = async () => {
    const response = await post("/get-data", {
      brand_name: brand,
    });
    setEditedJsonData(response);
    console.log("==response==>", response);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

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
      alert("data updated");
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
          }}
        >
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
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </Card>
      </Grid>
    </Grid>
  );
};

export default JsonEditor;
