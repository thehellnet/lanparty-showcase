import { PaneMode } from "@/model/constant/PaneMode";

export interface Pane {
  id: number;
  showcase: number;
  mode: PaneMode;
  tournament: number;
  match: number;
  displayOrder: number;
}
