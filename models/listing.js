'use strict';
module.exports = function(sequelize, DataTypes) {
  var Listing = sequelize.define('Listing', {
    thumbnail: DataTypes.STRING,
    price: DataTypes.INTEGER,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
    address: DataTypes.STRING,
    numBedrooms: DataTypes.INTEGER,
    numBathrooms: DataTypes.FLOAT,
    squareFeet: DataTypes.INTEGER,
    description: DataTypes.STRING
});

    Listing.associate = function(models) {
        Listing.hasMany(models.Media);
        Listing.belongsTo(models.User);
    }

    return Listing;
};
