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

    saveBook: async (parent, { bookPieces }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $push: { savedBooks: bookPieces },
          },
          { new: true }
        );
        return updatedUser;
      }

      throw new AuthenticationError("Please log in to continue.");
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $pull: { savedBooks: bookId },
          },
          { new: true }
        );
        return updatedUser;
      }

      throw new AuthenticationError("Please log in to continue.");
    },
  },
};

module.exports = resolvers;
