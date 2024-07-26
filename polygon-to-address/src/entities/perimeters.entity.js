import "reflect-metadata";
import { EntitySchema } from "typeorm";

export class Perimeters {
  constructor(type, geom, name, properties, comuneId) {
    this.type = type; // 'Regione' | Comune
    this.geom = geom;
    this.name = name; // name of type
    this.properties = properties;
    this.comuneId = comuneId;
  }
}

export const PerimetersEntity = new EntitySchema({
  name: "Perimeters",
  target: Perimeters,
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    type: {
      type: "varchar",
    },
    geom: {
      type: "geometry",
      srid: 4326,
      nullable: true,
      spatial: true,
    },
    name: {
      type: "varchar",
    },
    properties: {
      type: "varchar",
    },
    comuneId: {
      type: "int",
      nullable: true,
    },
  },
  relations: {
    overpasses: {
      type: "one-to-many",
      target: "Overpass",
      inverseSide: "comune",
      nullable: true,
    },
    comune: {
      type: "many-to-one",
      target: "Comune",
      joinColumn: {
        name: "comuneId",
        referencedColumnName: "id",
      },
      nullable: true,
    },
  },
});
