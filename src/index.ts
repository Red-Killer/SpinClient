
import { createHash } from "crypto";
import type {
  Request,
  Language,
  BaseResponse,
  AddFreeRoundsResponse,
  CreatePlayerResponse,
  GameListType1Response,
  GameListType2Response,
  GameListType1WithSystemResponse,
  GameListType2WithSystemResponse,
  FreeRoundsResponse,
  GameResponse,
} from "./types/index";

const hashString = (str: string) =>
  createHash("sha256").update(str).digest("hex");

/**
 * SpinClient SDK
 * @example
 * ```ts
 * const sdk = new SpinClient("api_login", "api_password", "https://url.to.api.com", "https://url.to.your.page.com", "https://url.to.cashier.page.com");
 * const player = await sdk.createPlayer("example", "password", "USD");
 * console.log(player);
 * ```
 */
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
   * @example
   * ```ts
   * const sdk = new SpinClient("api_login", "api_password", "https://url.to.api.com", "https://url.to.your.page.com", "https://url.to.cashier.page.com");
   * const player = await sdk.playerExists("example", "USD");
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
   * @param show_systems - Show systems
   * @param currency - {@link [Supported currencies](https://documentation.spin.ac/#supported-game-currencies)}
   * @param list_type - If you prioritize performance, choose type 2
   * @param show_additionals - Show additional data
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
   * const game = await sdk.getGame("example", "password", "USD", "softswiss/DiceBonanza", "https://url.to.your.page.com", "https://url.to.cashier.page.com", 0, "en");
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
    }).then((res) => res.response);
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
   * const game = await sdk.getGameDemo("softswiss/DiceBonanza", "USD", "en");
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
    }).then((res) => res.response);
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
   * const freeRounds = await sdk.getFreeRounds("example", "password", "USD");
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
   * @param currency - Supported currencies
   * @param gameid - The game id
   * @param freespins - The number of free spins
   * @param bet_level - Bet level (0 to 6)
   * @param valid_days - The number of days the free rounds are valid
   *
   * @example Adding free rounds for a player with username "example" and password "password" in USD currency for a game with id "softswiss/LuckyCrew"
   * ```ts
   * const sdk = new SpinClient("api_login", "api_password", "https://url.to.api.com", "https://url.to.your.page.com", "https://url.to.cashier.page.com");
   * const resp = await sdk.addFreeRounds("example", "password", "USD", "softswiss/LuckyCrew", 12, 0, 7);
   * console.log(resp);
   * ```
   */
  async addFreeRounds(
    username: string,
    password: string,
    currency: string,
    gameid: string,
    freespins: number,
    bet_level: number,
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
}

export default SpinClient;
