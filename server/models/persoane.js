module.exports = (sequelize, DataType) => {
  
  let model = sequelize.define('Persoane', {

      nume: {
        type: DataType.TEXT,
        allowNull: false,
         validate: {
          min: 0,
          max: 255,
          notNull: {
            msg: 'Campul nume este obligatoriu'
          }
        }

      },
      prenume: {
        type: DataType.TEXT,
        allowNull: false,
         validate: {
          min: 0,
          max: 255,
          notNull: {
            msg: 'Campul prenume este obligatoriu'
          }
        }
      },
      cnp: {
        type: DataType.TEXT,
        allowNull: false,
        validate: {
          len: {
            args: [0,14],
            msg: "Lungime cnp incorecta"
       },
          notNull: {
            msg: 'Campul cnp este obligatoriu'
          }
        }
      },
      varsta: {
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 999,
          notNull: {
            msg: 'Campul varsta este obligatoriu'
          }
        }
      },

    }, {
      timestamps: true
    });

    model.associate = function (models){
      model.belongsToMany(models.Masini, { 
        through: models.Junction,
      foreignKey: "id_person",
    as: "masini" });
  }

    return model;
  };