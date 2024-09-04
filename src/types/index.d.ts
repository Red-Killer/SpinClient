type Language = "en" | "fr" | "de" | "tr" | "ru" | "nl" | "pt" | "es";

interface BaseUser {
  user_username: string;
  user_password: string;
  currency: string;
}

interface addFreeRoundsRequest extends BaseUser {
  method: "addFreeRounds";
  gameid: string;
  freespins: number;
  bet_level: number;
  valid_days: number;
}

interface createPlayerRequest extends BaseUser {
  method: "createPlayer";
}

interface deleteFreeRoundsRequest extends BaseUser {
  method: "deleteFreeRounds";
  gameid: string;
}

interface deleteAllFreeRoundsRequest extends BaseUser {
  method: "deleteAllFreeRounds";
}

interface getGameListRequest {
  method: "getGameList";
  show_systems: 0 | 1;
  currency: string;
  list_type?: 1 | 2;
  show_additional?: boolean;
}

interface getFreeRoundsRequest extends BaseUser {
  method: "getFreeRounds";
}

interface getGameBaseRequest {
  lang: Language;
  gameid: string;
  homeurl: string;
  cashierurl: string;
}

interface getGameRequest extends BaseUser, getGameBaseRequest {
  method: "getGame";
  play_for_fun: 0 | 1;
}

interface getGameDemoRequest extends getGameBaseRequest {
  method: "getGameDemo";
  currency: string;
}

interface playerExistsRequest {
  method: "playerExists";
  user_username: string;
  currency: string;
}

//thats all for now

interface BaseResponse {
  error: number;
  message?: string;
}

interface AddFreeRoundsResponse extends BaseResponse {
  response: {
    id: number;
    player_id: number;
    game_id: string;
    freespins: number;
    freespins_wallet: number;
    freespins_performed: number;
    bet_level: number;
    currency: string;
    operator_id: number;
    valid_until: string;
    created_at: string;
    updated_at: string;
    active: boolean;
  };
}

interface CreatePlayerResponse extends BaseResponse {
  response: {
    id: number;
    username: string;
    balance: string;
    currencycode: string;
    created: string;
    agent_balance: string | null;
  };
}

interface GameType1 {
  id: number;
  name: string;
  type: "video-slot" | "live";
  category: string;
  subcategory: string;
  details: unknown[];
  new: boolean;
  mobile: boolean;
  id_hash: string;
  ts: number;
  id_hash_parent: string;
  freerounds_supported: boolean;
  featurebuy_supported: boolean;
  has_jackpot: boolean;
  play_for_fun_supported: boolean;
  image: string;
  image_square: string;
  image_portrait: string;
  currency: string;
  source: string;
  use_at_own_risk: boolean;
}

interface GameType2 {
  n: string;
  p: string;
  s: string;
  new: boolean;
  cdn: number;
  fs: boolean;
  fb: boolean;
  d: boolean;
  src: string;
  id: number;
}

interface GameListType1Response extends BaseResponse {
  response: Record<string, GameType1>;
}

interface GameListType2Response extends BaseResponse {
  response: Record<string, GameType2>;
}

interface GameListType1WithSystemResponse extends BaseResponse {
  response: Record<
    string,
    GameType1 & {
      system: string;
      created_at: string;
      provider: string;
      provider_name: string;
    }
  >;
}

interface GameListType2WithSystemResponse extends BaseResponse {
  response: Record<string, GameType2 & { c: string }>;
}

interface FreeRoundsResponse extends BaseResponse {
  response: {
    id: number;
    game_id: string;
    currency: string;
    player_id: number;
    freespins: number;
    freespins_bet: number;
    freespins_wallet: number;
    freespins_performed: number;
    bet_level: number;
    extra_data: unknown;
    active: boolean;
    operator_id: number;
    valid_until: string;
    created_at: string;
  }[];
}

interface GameResponse extends BaseResponse {
  response: string;
  session_id: string;
}

type Request =
  | addFreeRoundsRequest
  | createPlayerRequest
  | deleteFreeRoundsRequest
  | deleteAllFreeRoundsRequest
  | getGameListRequest
  | getFreeRoundsRequest
  | getGameRequest
  | getGameDemoRequest
  | playerExistsRequest;

export type {
  Request,
  Language,
  BaseResponse,
  GameResponse,
  AddFreeRoundsResponse,
  CreatePlayerResponse,
  GameListType1Response,
  GameListType2Response,
  GameListType1WithSystemResponse,
  GameListType2WithSystemResponse,
  FreeRoundsResponse,
};
