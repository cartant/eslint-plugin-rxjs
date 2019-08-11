declare module "esquery" {
  import * as es from "estree";
  declare function esquery<T extends es.Node = es.Node>(
    node: es.Node,
    selector: string
  ): T[];
  export = esquery;
}
