'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HackathonRegistration extends Model {
    static associate(models) {
      // No associations for now
    }
  }

  HackathonRegistration.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      githubPortfolio: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      projectDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'HackathonRegistration',
      tableName: 'hackathon_registrations',
    }
  );

  return HackathonRegistration;
};
