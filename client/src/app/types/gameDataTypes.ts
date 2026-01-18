export type TeamDataType = {
  attack_speed: string;
  attack_strategy: "normal" | "wide-back";
  default_strategy:
    | "4-4-2"
    | "5-3-2"
    | "3-5-2"
    | "3-3-4"
    | "4-3-3"
    | "3-4-3"
    | "5-4-1";
  defence_speed: number;
  defence_strategy: "wide-attack" | "wide-back" | "normal";
  fault_possibility: number;
  goalkeeper_speed: number;
  id: number;
  midfielder_speed: number;
  midfielder_strategy: "wide-attack" | "wide-back" | "center-attack" | "normal";
  name: string;
  pass_accuracy: number;
  pass_speed: number;
  primary_color: string;
  secondary_color: string;
  shoot_accuracy: number;
  tablo_name: string;
  team_logo_url: string;
  fifa_raiting: number;
  is_national_team: string
};
