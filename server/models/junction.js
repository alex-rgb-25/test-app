module.exports = (sequelize, DataType) => {
    let model = sequelize.define('Junction', {
        id_person: DataType.INTEGER,
        id_car: DataType.INTEGER

    }, {
      timestamps: true
    }
    
    );
    
    model.associate = function (models){
  }
    return model;
  };
  