module.exports = db => {
    return {
      create: (req, res) => {
        db.models.Persoane.create(req.body).then(() => {
          res.send({ success: true });
        }).catch(() => res.status(401));
      },
  
      update: (req, res) => {
        db.models.Persoane.update(req.body, { where: { id: req.body.id } }).then(() => {
          res.send({ success: true })
        }).catch(() => res.status(401));
      },
  
      findAll: (req, res) => {


      db.query(`SELECT "Persoane"."id", "Persoane"."nume", "Persoane"."prenume", "Persoane"."cnp", "Persoane"."varsta", "Persoane"."createdAt", "Persoane"."updatedAt", "masini"."id" AS "masini.id", "masini"."denumire_marca" AS "masini.denumire_marca", "masini"."denumire_model" AS "masini.denumire_model", "masini"."anul_fabricatiei" AS "masini.anul_fabricatiei", "masini"."capacitatea_cilindrica" AS "masini.capacitatea_cilindrica", "masini"."taxa_de_impozit" AS "masini.taxa_de_impozit", "masini"."createdAt" AS "masini.createdAt", "masini"."updatedAt" AS "masini.updatedAt", "masini->Junction"."id_person" AS "masini.Junction.id_person", "masini->Junction"."id_car" AS "masini.Junction.id_car", "masini->Junction"."createdAt" AS "masini.Junction.createdAt", "masini->Junction"."updatedAt" AS "masini.Junction.updatedAt" FROM "Persoane" AS "Persoane" LEFT OUTER JOIN ( "Junction" AS "masini->Junction" INNER JOIN "Masini" AS "masini" ON "masini"."id" = "masini->Junction"."id_car") ON "Persoane"."id" = "masini->Junction"."id_person";`, { type: db.QueryTypes.SELECT}).then(resp => {
          res.send(resp);
        }).catch(() => res.status(401));
      },

  
      find: (req, res) => {
        db.query(`SELECT id, nume, prenume, cnp, varsta
        FROM "Persoane" WHERE id=${req.params.id}`, { type: db.QueryTypes.SELECT }).then(resp => {
          res.send(resp[0]);
        }).catch(() => res.status(401));
      },
  
      destroy: (req, res) => {
        db.query(`DELETE FROM "Persoane" WHERE id = ${req.params.id}`, { type: db.QueryTypes.DELETE }).then(() => {
          res.send({ success: true });
        }).catch(() => res.status(401));
      }
    };
  };
  