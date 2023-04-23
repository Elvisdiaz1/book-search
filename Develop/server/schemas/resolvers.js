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

    login: async (_, { email, password }) => {
      // Find a user
      const user = await User.findOne({ email });

      // If no user is found, return message
      if (!user) {
        throw new AuthenticationError("The infomation is incorrect");
      }

      // Check to see if the password is correct from validator in User.js
      const correctPw = await user.isCorrectPassword(password);

      // If incorrect password, return message
      if (!correctPw) {
        throw new AuthenticationError("The infomation is incorrect");
      }
      const token = signToken(user);
      return { token, user };
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
