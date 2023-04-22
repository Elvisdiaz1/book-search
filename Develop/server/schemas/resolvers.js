const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (_, { username }) => {
      return await User.findOne({ username });
    },
  },

  Mutation: {
    // TODO: Add comments to each line of code below to describe the functionality below
    addUser: async (parent, { username, password, email }) => {
      const user = await User.create({ username, password, email });
      const token = signToken(user);

      return { token, user };
    },
    // TODO: Add comments to each line of code below to describe the functionality below
    login: async (parent, { username, email, password }) => {
      const userEmail = await User.findOne({ email });
      const userName = await User.findOne({ username });

      if (!userEmail || !userName) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(userEmail);
      return { token, userEmail };
    },
    // saveBook: async (parent, { authors, description, title, image, link }) => {
    //   const book = await User.create({
    //     authors,
    //     description,
    //     title,
    //     image,
    //     link,
    //   });

    //   await User.findOneAndUpdate(
    //     { username: username },
    //     { $addToSet: { Book: book.id } }
    //   );

    //   return book;
    // },
    saveBook: async (parent, { bookPieces, user }, context) => {
      const updatedUser = await User.create({
        bookPieces,
      });
      await User.findOneAndUpdate(
        { _id: user },
        {
          $push: { savedBooks: bookPieces },
        }
      );

      return updatedUser;
    },

    removeBook: async (parent, { bookId }) => {
      return User.findOneAndUpdate(
        { _id: bookId },
        { $pull: { savedBooks: { _id: bookId } } },
        { new: true }
      );
    },
  },
};

module.exports = resolvers;
