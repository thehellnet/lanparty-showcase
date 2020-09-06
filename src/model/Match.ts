import { MatchStatus } from "@/model/constant/MatchStatus";

export interface Match {
  id: number;
  status: MatchStatus;
  scheduledStartTs: number | undefined;
  scheduledEndTs: number | undefined;
  startTs: number | undefined;
  endTs: number | undefined;
  playOrder: number;
  level: number;
  gameMap: string | undefined;
  gametype: string | undefined;
  localTeam: string | undefined;
  guestTeam: string | undefined;
}
