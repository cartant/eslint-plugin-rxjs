declare module "esquery" {
  import * as es from "estree";
  declare function esquery(node: es.Node, selector: string): es.Node[];
  export = esquery;
}
