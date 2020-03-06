const WeatherModel = (sequelize, type) => {
  return sequelize.define('weather', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    temperature: {
      type: type.INTEGER,
      allowNull: false,
    },
    humidity: {
      type: type.STRING(255),
      allowNull: false,
    },
    date: {
      type: type.DATE,
      allowNull: false,
    },
    /*
     co2: {}
     */
  });
};

module.exports.WeatherModel = WeatherModel;
