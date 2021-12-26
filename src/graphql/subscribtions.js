import { gql } from '@apollo/client';

export const SUBSCRIBE_TODOS = gql`
    subscription NewTaskSubscription {
        todos(order_by: {id: asc}) {
            id
            text
            done
        }
    }
`;
