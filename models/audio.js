'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Audio extends Model {
    static associate(models) {
      //Sin asociaciones
    }
  }
  Audio.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Audio',
  });
  return Audio;
};

