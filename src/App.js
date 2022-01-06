import React, { useState, useEffect } from 'react';
import { useMutation, useSubscription } from '@apollo/client';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
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
  const [offlineAllert, setOfflineAllert] = useState(false);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const {
    loginWithRedirect, logout, isAuthenticated, loading: authLoading,
  } = useAuth0();

  useEffect(() => {
    setWaitingForResponse(false);
  }, [data.todos]);

  window.onoffline = () => {
    setOfflineAllert(true);
  };

  window.ononline = () => {
    setOfflineAllert(false);
  };

  const AddTodo = (event) => {
    event.preventDefault();
    if (!NewTodoText.trim()) { return; }

    const variables = {
      text: NewTodoText,
    };

    addTodo({ variables });
    setNewTodoText('');
    setWaitingForResponse(true);
  };

  const DeleteTodo = ({ id }) => {
    const variables = {
      id,
    };

    deleteTodo({ variables });
    setWaitingForResponse(true);
  };

  const CheckTodo = ({ id, done }) => {
    const variables = {
      id,
      done: !done,
    };

    toggleTodo({ variables });
  };

  if (offlineAllert) {
    return (
      <div sx={{ width: '100%' }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 1,
          m: 1,
          flexDirection: 'column',
        }}
        >
          <Typography variant="h3" textAlign="center">It looks like you are offline :(</Typography>
          <CircularProgress sx={{ flexShrink: 0 }} />
        </Box>
      </div>
    );
  }

  if (loading || authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <div sx={{ width: '100%' }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 1,
          m: 1,
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

      <div sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', p: 1 }}>
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
          { waitingForResponse ? <LinearProgress color="success" /> : '' }
        </Box>
      </div>
      <List sx={{ width: '100%' }}>
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
        display: 'flex', p: 1, justifyContent: 'flex-end',
      }}
      >
        <Button onClick={() => logout()}>Log out</Button>
      </Box>
    </Container>
  );
}

export default App;
