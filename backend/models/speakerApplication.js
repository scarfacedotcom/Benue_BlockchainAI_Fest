'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SpeakerApplication extends Model {
    static associate(models) {
      // No associations for now
    }
  }

  SpeakerApplication.init(
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
      linkedinLink: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      expertiseDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'SpeakerApplication',
      tableName: 'speaker_applications',
    }
  );

  return SpeakerApplication;
};
