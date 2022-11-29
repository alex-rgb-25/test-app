module.exports = (sequelize, DataType) => {
    let model = sequelize.define('Masini', {
      denumire_marca: {
        type: DataType.TEXT,
        allowNull: false,
         validate: {
          min: 0,
          max: 255,
          notNull: {
            msg: 'Denumire marca este obligatoriu'
          }
        }

      },
      denumire_model: {
        type: DataType.TEXT,
        allowNull: false,
         validate: {
          min: 0,
          max: 255,
          notNull: {
            msg: 'Denumire model este obligatoriu'
          }
        }
      },
      anul_fabricatiei: {
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 9999,
          notNull: {
            msg: 'Anul fabricatiei este obligatoriu'
          }
        }
      },
      capacitatea_cilindrica: {
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 9999,
          notNull: {
            msg: 'Capacitatea cilindrica este obligatoriu'
          }
        }
      },
      taxa_de_impozit: {
        type: DataType.INTEGER,
        validate: {
          min: 0,
          max: 9999
        }
      },

    }, {
      timestamps: true
    }
    
    );
    
    model.associate = function (models){
      model.belongsToMany(models.Persoane, { 
        through: models.Junction,
      foreignKey: "id_car",
    as: "persoane" });
  }

  
    return model;
  };
  