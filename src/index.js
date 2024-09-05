"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var hashString = function (str) {
    return (0, crypto_1.createHash)("sha256").update(str).digest("hex");
};
/**
 * SpinClient SDK
 * @example
 * ```ts
 * const sdk = new SpinClient("api_login", "api_password", "https://url.to.api.com", "https://url.to.your.page.com", "https://url.to.cashier.page.com");
 * const player = await sdk.createPlayer("example", "password", "USD");
 * console.log(player);
 * ```
 */
var SpinClient = /** @class */ (function () {
    /**
     * Initialize the SpinClient SDK
     * @param api_login - The api_login which you can find on the backoffice
     * @param api_password - The api_password which you can find on the backoffice
     * @param base_url - The api endpoint url
     * @param home_url - The url to your main page
     * @param cashier_url - The url to your cashier page where the player can deposit
     */
    function SpinClient(api_login, api_password, base_url, home_url, cashier_url) {
        this.api_login = api_login;
        this.api_password = api_password;
        this.baseurl = base_url;
        this.homeurl = home_url;
        this.cashierurl = cashier_url;
    }
    SpinClient.prototype.request = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data_;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.baseurl, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(__assign({ api_login: this.api_login, api_password: this.api_password }, data)),
                        })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data_ = (_a.sent());
                        // if error not 0 throw error
                        if (data_.error !== 0)
                            throw new Error(data_.message);
                        return [2 /*return*/, data_];
                }
            });
        });
    };
    /**
     *  Create a new player
     * @param username - The username of the player
     * @param password - The password of the player
     * @param currency - {@link [Supported currencies](https://documentation.spin.ac/#supported-game-currencies)}
     */
    SpinClient.prototype.createPlayer = function (username, password, currency) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: "createPlayer",
                        user_username: username,
                        user_password: hashString(password),
                        currency: currency,
                    }).then(function (res) { return res.response; })];
            });
        });
    };
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
    SpinClient.prototype.playerExists = function (username, currency) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: "playerExists",
                        user_username: username,
                        currency: currency,
                    }).then(function (res) { return res.response; })];
            });
        });
    };
    SpinClient.prototype.getGameList = function (show_systems, currency, list_type, show_additional) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: "getGameList",
                        show_systems: show_systems,
                        currency: currency,
                        list_type: list_type,
                        show_additional: show_additional,
                    }).then(function (res) { return res.response; })];
            });
        });
    };
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
    SpinClient.prototype.getGame = function (username_1, password_1, currency_1, gameid_1, lang_1) {
        return __awaiter(this, arguments, void 0, function (username, password, currency, gameid, lang, play_for_fun) {
            if (play_for_fun === void 0) { play_for_fun = 0; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: "getGame",
                        user_username: username,
                        user_password: hashString(password),
                        currency: currency,
                        gameid: gameid,
                        play_for_fun: play_for_fun,
                        lang: lang,
                        homeurl: this.homeurl,
                        cashierurl: this.cashierurl,
                    }).then(function (res) { return res.response; })];
            });
        });
    };
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
    SpinClient.prototype.getGameDemo = function (gameid, currency, lang) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: "getGameDemo",
                        gameid: gameid,
                        currency: currency,
                        lang: lang,
                        homeurl: this.homeurl,
                        cashierurl: this.cashierurl,
                    }).then(function (res) { return res.response; })];
            });
        });
    };
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
    SpinClient.prototype.getFreeRounds = function (username, password, currency) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: "getFreeRounds",
                        user_username: username,
                        user_password: hashString(password),
                        currency: currency,
                    }).then(function (res) { return res.response; })];
            });
        });
    };
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
    SpinClient.prototype.addFreeRounds = function (username, password, currency, gameid, freespins, bet_level, valid_days) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: "addFreeRounds",
                        user_username: username,
                        user_password: hashString(password),
                        currency: currency,
                        gameid: gameid,
                        freespins: freespins,
                        bet_level: bet_level,
                        valid_days: valid_days,
                    })];
            });
        });
    };
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
    SpinClient.prototype.deleteFreeRounds = function (username, password, currency, gameid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: "deleteFreeRounds",
                        user_username: username,
                        user_password: hashString(password),
                        currency: currency,
                        gameid: gameid,
                    })];
            });
        });
    };
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
    SpinClient.prototype.deleteAllFreeRounds = function (username, password, currency) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: "deleteAllFreeRounds",
                        user_username: username,
                        user_password: hashString(password),
                        currency: currency,
                    })];
            });
        });
    };
    //validateWebhook
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
     * const isValid = sdk.validateWebhook("key", "timestamp", "salt");
     * console.log(isValid);
     * ```
     */
    //too determine if the webhook is valid we need to create a md5 timestamp + salt and compare it with the key
    SpinClient.prototype.validateWebhook = function (key, timestamp, salt) {
        return __awaiter(this, void 0, void 0, function () {
            var md5;
            return __generator(this, function (_a) {
                md5 = (0, crypto_1.createHash)("md5")
                    .update(timestamp + salt)
                    .digest("hex");
                console.log(md5, key);
                return [2 /*return*/, md5 === key];
            });
        });
    };
    return SpinClient;
}());
var sdk = new SpinClient("api_login", "api_password", "https://url.to.api.com", "https://url.to.your.page.com", "https://url.to.cashier.page.com");
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var testValid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Creating player");
                return [4 /*yield*/, sdk.validateWebhook("6512bd43d9caa6e02c990b0a82652dca", "1", "1")];
            case 1:
                testValid = _a.sent();
                console.log(testValid);
                return [2 /*return*/];
        }
    });
}); })();
exports.default = SpinClient;
