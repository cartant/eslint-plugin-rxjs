declare module "esquery" {
  import * as es from "estree";
  declare function esquery<T = es.Node>(node: es.Node, selector: string): T[];
  export = esquery;
}
