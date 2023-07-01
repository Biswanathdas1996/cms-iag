import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";

export default function FolderList({ history, brand }) {
  return (
    <>
      <h4>Last changes of {brand}</h4>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {history?.map((val, i) => (
          <ListItem
            key={i}
            onClick={() =>
              window.open(`#/changes/${val}/${brand}`, "_blank", "noreferrer")
            }
            style={{ cursor: "pointer" }}
          >
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`Changes`} secondary={val} />
          </ListItem>
        ))}
      </List>
    </>
  );
}
