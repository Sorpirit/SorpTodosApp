import { gql } from '@apollo/client';

export const TOGGLE_TODO = gql`
    mutation ToggleTodo($id: Int!, $done: Boolean!) {
        update_todos(where: {id: {_eq: $id}}, _set: {done: $done}) {
            returning {
                id
                text
                done
            }
        }
    }
`;

export const ADD_TODO = gql`
    mutation AddTodo($text: String!) {
        insert_todos(objects: {text: $text}) {
            returning {
                id
                text
                done
            }
        }
    }
`;

export const DELETE_TODO = gql`
    mutation DeleteTodo($id: Int!) {
        delete_todos(where: {id: {_eq: $id}}) {
            returning {
                id
                text
                done
            }
        }
    }
`;
