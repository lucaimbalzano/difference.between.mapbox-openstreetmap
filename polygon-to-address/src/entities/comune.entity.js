import "reflect-metadata";
import { EntitySchema, OneToMany } from "typeorm";

export class Comune {
  constructor(
    istat,
    comune,
    provincia,
    regione,
    prefisso,
    cap,
    codFisco,
    abitanti,
    link
  ) {
    this.istat = istat;
    this.comune = comune;
    this.provincia = provincia;
    this.regione = regione;
    this.prefisso = prefisso;
    this.cap = cap;
    this.codFisco = codFisco;
    this.abitanti = abitanti;
    this.link = link;
  }
}

export const ComuneEntity = new EntitySchema({
  name: "Comune",
  target: Comune,
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    istat: {
      type: "varchar",
      nullable: false,
    },
    comune: {
      type: "varchar",
      nullable: false,
    },
    provincia: {
      type: "varchar",
      nullable: false,
    },
    regione: {
      type: "varchar",
      nullable: false,
    },
    prefisso: {
      type: "varchar",
      nullable: false,
    },
    cap: {
      type: "varchar",
      nullable: false,
    },
    codFisco: {
      type: "varchar",
      nullable: false,
    },
    abitanti: {
      type: "int",
      nullable: false,
    },
    link: {
      type: "varchar",
      nullable: false,
    },
  },
  relations: {
    overpasses: {
      type: "one-to-many",
      target: "Overpass",
      inverseSide: "comune",
      nullable: true,
    },
  },
});
