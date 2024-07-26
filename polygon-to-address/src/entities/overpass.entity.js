import "reflect-metadata";
import { EntitySchema, ManyToOne } from "typeorm";

export class Overpass {
  constructor(
    location,
    geom,
    idOsm,
    type_location,
    lanes,
    name,
    old_ref,
    surface,
    type,
    comuneId
  ) {
    this.location = location;
    this.geom = geom;
    this.idOsm = idOsm;
    this.type_location = type_location;
    this.lanes = lanes;
    this.name = name;
    this.old_ref = old_ref;
    this.surface = surface;
    this.type = type;
  }
}

export const OverpassEntity = new EntitySchema({
  name: "Overpass",
  target: Overpass,
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    location: {
      type: "varchar",
      nullable: false,
    },
    geom: {
      type: "geometry",
      srid: 4326,
      nullable: true,
      spatial: true,
    },
    idOsm: {
      type: "varchar",
      nullable: false,
    },
    type_location: {
      type: "varchar",
    },
    lanes: {
      type: "varchar",
    },
    name: {
      type: "varchar",
    },
    old_ref: {
      type: "varchar",
    },
    surface: {
      type: "varchar",
    },
    type: {
      type: "varchar",
    },
    perimetersId: {
      type: "int",
      nullable: true,
    },
  },
  relations: {
    perimeters: {
      type: "many-to-one",
      target: "Perimeters",
      joinColumn: {
        name: "perimetersId",
        referencedColumnName: "id",
      },
      nullable: true,
    },
  },
});
