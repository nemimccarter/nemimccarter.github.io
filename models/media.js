'use strict';
module.exports = (sequelize, DataTypes) => {
  var Media = sequelize.define('Media', {
    imageFilePath: DataTypes.STRING
  });

  Media.associate = function(models) {
    Media.belongsTo(models.Listing);
  }

  return Media;
};
