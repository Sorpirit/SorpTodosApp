import React, { useState, useEffect } from 'react';
import {
  Checkbox, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function TodoItem({ props }) {
  const labelId = `checkbox-list-label-${props.id}`;

  const [done, setDone] = useState(props.done);
  const [deleted, setDeleted] = useState(false);

  const Check = () => {
    setDone(!done);
    props.setDone();
  };

  useEffect(() => {
    setDone(props.done);
  }, [props.done]);

  return (

    <ListItem
      secondaryAction={(
        <IconButton
          aria-label="delete"
          disabled={deleted}
          onClick={
                  () => {
                    setDeleted(true);
                    props.deleteCallback();
                  }
                  }
        >
          <DeleteIcon />
        </IconButton>
              )}
      disablePadding
    >
      <ListItemButton role={undefined} onClick={() => Check()} dense>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={done}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemIcon>
        <ListItemText id={labelId} style={{ textDecoration: (done ? 'line-through' : 'none') }} primary={props.text} />
      </ListItemButton>
    </ListItem>
  );
}

export default TodoItem;
