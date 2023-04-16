import { gql } from "@apollo/client";

export const LOGIN = gql`
    mutation login(username: String!, email: String!, password: String!){
        login(username: String!, email: String!, password: String!){
            token
            user {
              _id
              username
            }
        }
    }
`;
export const ADD_PROFILE = gql`
  mutation addProfile($name: String!, $email: String!, $password: String!) {
    addProfile(name: $name, email: $email, password: $password) {
      token
      profile {
        _id
        name
      }
    }
  }
`;
