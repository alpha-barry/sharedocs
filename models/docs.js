'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class docs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  docs.init({
    //roomId: DataTypes.STRING,
    originalname: DataTypes.STRING,
    mimetype: DataTypes.STRING,
    file: DataTypes.BLOB('long')
  }, {
    sequelize,
    modelName: 'docs',
  });
  return docs;
};