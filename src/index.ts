import { createHash } from "crypto";

const hashString = (str: string) =>
  createHash("sha256").update(str).digest("hex");

class SpinClient {
  private api_login: string;
  private api_password: string;
  private baseurl: string;
  private homeurl: string;
  private cashierurl: string;

  /**
   * Initialize the SpinClient SDK
   * @param api_login - The api_login which you can find on the backoffice
   * @param api_password - The api_password which you can find on the backoffice
   * @param base_url - The api endpoint url
   * @param home_url - The url to your main page
   * @param cashier_url - The url to your cashier page where the player can deposit
   */
  constructor(
    api_login: string,
    api_password: string,
    base_url: string,
    home_url: string,
    cashier_url: string
  ) {
    this.api_login = api_login;
    this.api_password = api_password;
    this.baseurl = base_url;
    this.homeurl = home_url;
    this.cashierurl = cashier_url;
  }

  protected async request<T>(data: Request) {
    const res = await fetch(this.baseurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_login: this.api_login,
        api_password: this.api_password,
        ...data,
      }),
    });

    const data_ = (await res.json()) as T & BaseResponse;

    // if error not 0 throw error
    if (data_.error !== 0) throw new Error(data_.message);

    return data_;
  }

  /**
   *  Create a new player
   * @param username - The username of the player
   * @param password - The password of the player
   * @param currency - {@link [Supported currencies](https://documentation.spin.ac/#supported-game-currencies)}
   *
   * @example Creating a player with username "example" and password "password" in USD currency
   * ```ts
   * const sdk = new SpinClient("api_login", "api_password", "https://url.to.api.com", "https://url.to.your.page.com", "https://url.to.cashier.page.com");
   *
   * const player = await sdk.createPlayer("example", "password", "USD");
   *
   * console.log(player);
   * ```
   */
  async createPlayer(username: string, password: string, currency: string) {
    return this.request<CreatePlayerResponse>({
      method: "createPlayer",
      user_username: username,
      user_password: hashString(password),
      currency,
    }).then((res) => res.response);
  }

  /**
   * Get an existing player object (deprecated)
   * @param username - The username of the player
   * @param currency - {@link [Supported currencies](https://documentation.spin.ac/#supported-game-currencies)}
   *
   * @deprecated Use {@link SpinClient.playerExists} instead
   * @example Getting an existing player object for a player with username "example" in USD currency
   * ```ts
   * const sdk = new SpinClient("api_login", "api_password", "https://url.to.api.com", "https://url.to.your.page.com", "https://url.to.cashier.page.com");
   *
   * const player = await sdk.playerExists("example", "USD");
   *
   * console.log(player);
   * ```
   */
  async playerExists(username: string, currency: string) {
    return this.request<CreatePlayerResponse>({
      method: "playerExists",
      user_username: username,
      currency,
    }).then((res) => res.response);
  }

  /**
   * Get a list of games
   * @param show_systems - Show systems (0 or 1)
   * @param currency - {@link [Supported currencies](https://documentation.spin.ac/#supported-game-currencies)}
   * @param list_type - If you prioritize performance, choose type 2 (1 or 2)
   * @param show_additionals - Show additional data (true or false)
   *
   * @example Getting a list of games without systems in USD currency
   * ```ts
   * const sdk = new SpinClient("api_login", "api_password", "https://url.to.api.com", "https://url.to.your.page.com", "https://url.to.cashier.page.com");
   *
   * const games = await sdk.getGameList(0, "USD");
   *
   * console.log(games);
   */
  //function overloads
  async getGameList(
    show_systems: 0,
    currency: string,
    list_type?: 1,
    show_additional?: boolean
  ): Promise<GameListType1Response["response"]>;
  async getGameList(
    show_systems: 0,
    currency: string,
    list_type?: 2,
    show_additional?: boolean
  ): Promise<GameListType2Response["response"]>;
  async getGameList(
    show_systems: 1,
    currency: string,
    list_type?: 1,
    show_additional?: boolean
  ): Promise<GameListType1WithSystemResponse["response"]>;
  async getGameList(
    show_systems: 1,
    currency: string,
    list_type?: 2,
    show_additional?: boolean
  ): Promise<GameListType2WithSystemResponse["response"]>;

  async getGameList(
    show_systems: 0 | 1,
    currency: string,
    list_type?: 1 | 2,
    show_additional?: boolean
  ) {
    return this.request<
      | GameListType1Response
      | GameListType2Response
      | GameListType1WithSystemResponse
      | GameListType2WithSystemResponse
    >({
      method: "getGameList",
      show_systems,
      currency,
      list_type,
      show_additional,
    }).then((res) => res.response);
  }

  /**
   * Initialize a game session
   * @param username - The username of the player
   * @param password - The password of the player
   * @param currency - {@link [Supported currencies](https://documentation.spin.ac/#supported-game-currencies)}
   * @param gameid - The game id
   * @param lang - {@link [Supported languages](https://documentation.spin.ac/#supported-game-language)}
   * @param play_for_fun - Can be either 0 or 1 (it's recommended to use getGameDemo directly)
   *
   * @example Initializing a game session for a player with username "example" and password "password" in USD currency for a game with id "softswiss/DiceBonanza"
   * ```ts
   * const sdk = new SpinClient("api_login", "api_password", "https://url.to.api.com", "https://url.to.your.page.com", "https://url.to.cashier.page.com");
   *
   * const game = await sdk.getGame("example", "password", "USD", "softswiss/DiceBonanza", "https://url.to.your.page.com", "https://url.to.cashier.page.com", 0, "en");
   *
   * console.log(game);
   * ```
   */
  async getGame(
    username: string,
    password: string,
    currency: string,
    gameid: string,
    lang: Language,
    play_for_fun: 0 | 1 = 0
  ) {
    return this.request<GameResponse>({
      method: "getGame",
      user_username: username,
      user_password: hashString(password),
      currency,
      gameid,
      play_for_fun,
      lang,
      homeurl: this.homeurl,
      cashierurl: this.cashierurl,
      // add session id to the return object
    }).then((res) => ({ response: res.response, session_id: res.session_id }));
  }

  /**
   * Initialize a game session in demo mode
   * @param gameid - The game id
   * @param currency - {@link [Supported currencies](https://documentation.spin.ac/#supported-game-currencies)}
   * @param lang - {@link [Supported languages](https://documentation.spin.ac/#supported-game-language)}
   *
   * @example Initializing a game session in demo mode for a game with id "softswiss/DiceBonanza" in USD currency
   * ```ts
   * const sdk = new SpinClient("api_login", "api_password", "https://url.to.api.com", "https://url.to.your.page.com", "https://url.to.cashier.page.com");
   *
   * const game = await sdk.getGameDemo("softswiss/DiceBonanza", "USD", "en");
   *
   * console.log(game);
   * ```
   */
  async getGameDemo(gameid: string, currency: string, lang: Language) {
    return this.request<GameResponse>({
      method: "getGameDemo",
      gameid,
      currency,
      lang,
      homeurl: this.homeurl,
      cashierurl: this.cashierurl,
    }).then((res) => ({ response: res.response, session_id: res.session_id }));
  }

  /**
   * Get available free rounds for a player
   * @param username - The username of the player
   * @param password - The password of the player
   * @param currency - {@link [Supported currencies](https://documentation.spin.ac/#supported-game-currencies)}
   *
   * @example Getting aviailable free rounds for a player with username "example" and password "password" in USD currency
   * ```ts
   * const sdk = new SpinClient("api_login", "api_password", "https://url.to.api.com", "https://url.to.your.page.com", "https://url.to.cashier.page.com");
   *
   *  const freeRounds = await sdk.getFreeRounds("example", "password", "USD");
   *
   * console.log(freeRounds);
   * ```
   */
  async getFreeRounds(username: string, password: string, currency: string) {
    return this.request<FreeRoundsResponse>({
      method: "getFreeRounds",
      user_username: username,
      user_password: hashString(password),
      currency,
    }).then((res) => res.response);
  }

  /**
   * Add free rounds to a player
   * @param username - The username of the player
   * @param password - The password of the player
   * @param currency - {@link [Supported currencies](https://documentation.spin.ac/#supported-game-currencies)}
   * @param gameid - The game id
   * @param freespins - The number of free spins
   * @param bet_level - Bet level (0 to 6)
   * @param valid_days - The number of days the free rounds are valid
   *
   * @example Adding free rounds for a player with username "example" and password "password" in USD currency for a game with id "softswiss/LuckyCrew"
   * ```ts
   * const sdk = new SpinClient("api_login", "api_password", "https://url.to.api.com", "https://url.to.your.page.com", "https://url.to.cashier.page.com");
   *
   * const resp = await sdk.addFreeRounds("example", "password", "USD", "softswiss/LuckyCrew", 12, 0, 7);
   *
   * console.log(resp);
   * ```
   */
  async addFreeRounds(
    username: string,
    password: string,
    currency: string,
    gameid: string,
    freespins: number,
    bet_level: BetLevel,
    valid_days: number
  ) {
    return this.request<AddFreeRoundsResponse>({
      method: "addFreeRounds",
      user_username: username,
      user_password: hashString(password),
      currency,
      gameid,
      freespins,
      bet_level,
      valid_days,
    });
  }

  /**
   * Deletes remaining free rounds for a player by a game id
   * @param username - The username of the player
   * @param password - The password of the player
   * @param currency - {@link [Supported currencies](https://documentation.spin.ac/#supported-game-currencies)}
   * @param gameid - The game id
   *
   * @example Deleting free rounds for a player with username "example" and password "password" in USD currency for a game with id "softswiss/LuckyCrew"
   * ```ts
   * const sdk = new SpinClient("api_login", "api_password", "https://url.to.api.com", "https://url.to.your.page.com", "https://url.to.cashier.page.com");
   *
   * await sdk.deleteFreeRounds("example", "password", "USD", "softswiss/LuckyCrew");
   * ```
   */
  async deleteFreeRounds(
    username: string,
    password: string,
    currency: string,
    gameid: string
  ) {
    return this.request({
      method: "deleteFreeRounds",
      user_username: username,
      user_password: hashString(password),
      currency,
      gameid,
    });
  }

  /**
   * Deletes all remaining free rounds for a player
   * @param username - The username of the player
   * @param password - The password of the player
   * @param currency - {@link [Supported currencies](https://documentation.spin.ac/#supported-game-currencies)}
   *
   * @example Deleting all free rounds for a player with username "example" and password "password" in USD currency
   * ```ts
   * const sdk = new SpinClient("api_login", "api_password", "https://url.to.api.com", "https://url.to.your.page.com", "https://url.to.cashier.page.com");
   *
   * await sdk.deleteAllFreeRounds("example", "password", "USD");
   * ```
   */
  async deleteAllFreeRounds(
    username: string,
    password: string,
    currency: string
  ) {
    return this.request({
      method: "deleteAllFreeRounds",
      user_username: username,
      user_password: hashString(password),
      currency,
    });
  }

  /**
   * Validates a webhook
   * @param key - The key from the payload
   * @param timestamp - The timestamp from the payload
   * @param salt - Your webhook secret
   *
   * @returns true if the webhook is valid, false otherwise
   * @example Validating a webhook
   * ```ts
   * const sdk = new SpinClient("api_login", "api_password", "https://url.to.api.com", "https://url.to.your.page.com", "https://url.to.cashier.page.com");
   *
   * const isValid = sdk.validateWebhook("4e54de0b17adf322365c0540bd7db57a", "1696463565", "salt");
   *
   * console.log(isValid);
   * ```
   */
  validateWebhook(key: string, timestamp: string, salt: string) {
    return (
      createHash("md5")
        .update(timestamp + salt)
        .digest("hex") === key
    );
  }
}

type Language = "en" | "fr" | "de" | "tr" | "ru" | "nl" | "pt" | "es";
type BetLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface BaseUser {
  user_username: string;
  user_password: string;
  currency: string;
}

interface addFreeRoundsRequest extends BaseUser {
  method: "addFreeRounds";
  gameid: string;
  freespins: number;
  bet_level: BetLevel;
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
    bet_level: BetLevel;
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
  type: "video-slots" | "live";
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
    bet_level: BetLevel;
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

export default SpinClient;
