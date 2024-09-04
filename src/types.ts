import { z } from "zod";

const currencySchema = z.union(
  [
    z.literal("USD"),
    z.literal("EUR"),
    z.literal("GBP"),
    z.literal("BRL"),
    z.literal("AUD"),
    z.literal("CAD"),
    z.literal("NZD"),
    z.literal("TRY"),
    z.string(), // Allow custom currency as string
  ],
  { message: "Invalid currency" }
);

const languageSchema = z.union(
  [
    z.literal("en"),
    z.literal("fr"),
    z.literal("de"),
    z.literal("tr"),
    z.literal("ru"),
    z.literal("nl"),
    z.literal("pt"),
    z.literal("es"),
  ],
  { message: "Invalid language" }
);

const baseUserSchema = z.object({
  user_username: z.string({ message: "You have to provide a username" }),
  user_password: z.string({ message: "You have to provide a password" }),
  currency: currencySchema,
});

// ADD FREE ROUNDS
const addFreeRoundsRequestSchema = z.object({
  method: z.literal("addFreeRounds"),
  gameid: z.string(),
  freespins: z.number(),
  bet_level: z.number(),
  valid_days: z.number(),
  user_username: z.string(),
  user_password: z.string(),
  currency: currencySchema,
});

// CREATE PLAYER
const createPlayerRequestSchema = baseUserSchema.extend({
  method: z.literal("createPlayer"),
});

// DELETE FREE ROUNDS
const deleteFreeRoundsRequestSchema = baseUserSchema.extend({
  method: z.literal("deleteFreeRounds"),
  gameid: z.string(),
});

const deleteAllFreeRoundsRequestSchema = baseUserSchema.extend({
  method: z.literal("deleteAllFreeRounds"),
});

// GET GAME LIST
const getGameListRequestSchema = z.object({
  method: z.literal("getGameList"),
  show_systems: z.union([z.literal(0), z.literal(1)], {
    message: "Invalid show_systems",
  }),
  currency: currencySchema,
  list_type: z.union([z.literal(1), z.literal(2)]).optional(),
  show_additional: z.boolean().optional(),
});

// GET FREE ROUNDS
const getFreeRoundsRequestSchema = baseUserSchema.extend({
  method: z.literal("getFreeRounds"),
});

const getGameBaseRequestSchema = z.object({
  lang: languageSchema,
  gameid: z.string(),
  homeurl: z.string(),
  cashierurl: z.string(),
});

const getGameRequestSchema = baseUserSchema
  .merge(getGameBaseRequestSchema)
  .extend({
    method: z.literal("getGame"),
    play_for_fun: z.union([z.literal(0), z.literal(1)], {
      message: "Invalid play_for_fun",
    }),
  });

const getGameDemoRequestSchema = getGameBaseRequestSchema.extend({
  method: z.literal("getGameDemo"),
  currency: currencySchema,
});

// PLAYER EXISTS
const playerExistsRequestSchema = z.object({
  method: z.literal("playerExists"),
  user_username: z.string(),
  currency: currencySchema,
});

//thats all for now

const Requests = z.discriminatedUnion("method", [
  addFreeRoundsRequestSchema,
  createPlayerRequestSchema,
  deleteFreeRoundsRequestSchema,
  deleteAllFreeRoundsRequestSchema,
  getGameListRequestSchema,
  getFreeRoundsRequestSchema,
  getGameRequestSchema,
  getGameDemoRequestSchema,
  playerExistsRequestSchema,
]);

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

type Request = z.infer<typeof Requests>;
type Language = z.infer<typeof languageSchema>;

export { Requests };
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
