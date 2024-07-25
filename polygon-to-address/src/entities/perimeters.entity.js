import "reflect-metadata";
import { EntitySchema } from "typeorm";

export class Perimeters {
  constructor(type, geom, name, properties) {
    this.type = type; // 'Regione' | Comune
    this.geom = geom;
    this.name = name; // name of type
    this.properties = properties;
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
  },
});
