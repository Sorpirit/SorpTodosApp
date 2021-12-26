import React, { useState } from 'react';
import { useMutation, useSubscription } from '@apollo/client';
import CircularProgress from '@mui/material/CircularProgress';
import {
  TextField, Box, Button, Container, List, Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAuth0 } from '@auth0/auth0-react';
import AddIcon from '@mui/icons-material/Add';
import TodoItem from './components/TodoItem';
import { SUBSCRIBE_TODOS } from './graphql/subscribtions';
import { TOGGLE_TODO, ADD_TODO, DELETE_TODO } from './graphql/mutations';

function App() {
  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);
  const [addTodo, { loading: addTodoLoading }] = useMutation(ADD_TODO);
  const { data, loading, error } = useSubscription(SUBSCRIBE_TODOS);
  const [NewTodoText, setNewTodoText] = useState('');
  const {
    loginWithRedirect, logout, isAuthenticated, loading: authLoading,
  } = useAuth0();

  const AddTodo = (event) => {
    event.preventDefault();
    if (!NewTodoText.trim()) { return; }

    const variables = {
      text: NewTodoText,
    };

    addTodo({ variables });
    setNewTodoText('');
  };

  const DeleteTodo = ({ id }) => {
    const variables = {
      id,
    };

    deleteTodo({ variables });
  };

  const CheckTodo = ({ id, done }) => {
    const variables = {
      id,
      done: !done,
    };

    toggleTodo({ variables });
  };

  if (loading || authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ width: '100%' }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 1,
          m: 1,
          bgcolor: 'background.paper',
          flexDirection: 'column',
        }}
        >
          <Typography variant="h1" textAlign="center">Join secret todo</Typography>
          <Button variant="outlined" sx={{ flexShrink: 0 }} onClick={() => loginWithRedirect()}>JOIN</Button>
        </Box>
      </div>
    );
  }

  if (error) {
    return <p>Error :(</p>;
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h1" textAlign="center">Secret todo</Typography>

      <div style={{ width: '100%' }}>
        <Box sx={{ display: 'flex', p: 1, bgcolor: 'background.paper' }}>
          <TextField
            id="standard-basic"
            label="Today I want to:"
            variant="standard"
            value={NewTodoText}
            sx={{ flexGrow: 1 }}
            onChange={(e) => setNewTodoText(e.target.value)}
          />
          <LoadingButton
            onClick={(e) => AddTodo(e)}
            endIcon={<AddIcon />}
            loading={addTodoLoading}
            loadingPosition="end"
            variant="text"
          >
            Add task
          </LoadingButton>
        </Box>
      </div>

      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {
            data.todos.map(({ id, text, done }) => {
              const props = {
                id,
                text,
                done,
                setDone: () => CheckTodo({ id, done }),
                deleteCallback: () => DeleteTodo({ id }),
              };

              return (
                <TodoItem props={props} key={id} />
              );
            })
          }
      </List>
      <Box sx={{
        display: 'flex', p: 1, bgcolor: 'background.paper', justifyContent: 'flex-end',
      }}
      >
        <Button onClick={() => logout()}>Log out</Button>
      </Box>
    </Container>
  );
}

export default App;
