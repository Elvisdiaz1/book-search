import { gql } from "@apollo/client";

export const QUERY_GET_ME = gql`
  query User {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
