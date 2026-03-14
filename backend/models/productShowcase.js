'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductShowcase extends Model {
    static associate(models) {
      // No associations for now
    }
  }

  ProductShowcase.init(
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
      productLink: {
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
      modelName: 'ProductShowcase',
      tableName: 'product_showcases',
    }
  );

  return ProductShowcase;
};
