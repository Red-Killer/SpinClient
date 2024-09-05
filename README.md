# SpinClient
SpinClient is a JavaScript SDK designed to facilitate easier integration with the [spin.ac](https://documentation.spin.ac/) API.

## Table of Contents
- [SpinClient](#spinclient)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Methods](#methods)
    - [createPlayer](#createplayer)
    - [~~playerExists~~ (deprecated)](#playerexists-deprecated)
    - [getGameList](#getgamelist)
    - [getGame](#getgame)
    - [getGameDemo](#getgamedemo)
    - [getFreeRounds](#getfreerounds)
    - [addFreeRounds](#addfreerounds)
    - [deleteFreeRounds](#deletefreerounds)
    - [deleteAllFreeRounds](#deleteallfreerounds)
  - [Helper Functions](#helper-functions)
    - [validateWebhook](#validatewebhook)
  - [Error Handling](#error-handling)
  - [Contributing](#contributing)
  - [License](#license)

## Installation
To install SpinClient, use your preferred package manager:

```bash
# Using npm
npm install spinclient

# Using yarn
yarn add spinclient

# Using pnpm
pnpm add spinclient
```

## Usage
To use SpinClient, you need to create an instance of the `SpinClient` class with your API credentials and the base URLs for the API, your website, and the cashier page. You can then use the methods provided by the `SpinClient` class to interact with the Spin API.

```ts
import SpinClient from 'spinclient';

const client = new SpinClient("api_login", "api_password", "https://url.to.api.com", "https://url.to.your.page.com", "https://url.to.cashier.page.com");

// Example: Initializing a game session in demo mode
const demo = await client.getGameDemo("softswiss/DiceBonanza", "USD", "en");
```

<!-- all endpoints are available as methods on the `SpinClient` class, and the response is returned as a promise. -->

## Methods
The following methods are available on the `SpinClient` class:


### createPlayer
```typescript
createPlayer(username: string, password: string, currency: string)
```

### ~~playerExists~~ (deprecated)
```typescript
playerExists(username: string, currency: string)
```

### getGameList
```typescript
getGameList(
  show_systems: 0 | 1,
  currency: string,
  list_type?: 1 | 2,
  show_additional?: boolean
)
```

### getGame
```typescript
getGame(
  username: string,
  password: string,
  currency: string,
  gameid: string,
  lang: Language,
  play_for_fun: 0 | 1 = 0
)
```

### getGameDemo
```typescript
getGameDemo(gameid: string, currency: string, lang: Language)
```

### getFreeRounds
```typescript
getFreeRounds(username: string, password: string, currency: string)
```

### addFreeRounds
```typescript
addFreeRounds(
  username: string,
  password: string,
  currency: string,
  gameid: string,
  freespins: number,
  bet_level: number,
  valid_days: number
)
```

### deleteFreeRounds
```typescript
deleteFreeRounds(
  username: string,
  password: string,
  currency: string,
  gameid: string
)
```

### deleteAllFreeRounds
```typescript
deleteAllFreeRounds(
  username: string,
  password: string,
  currency: string
)
```

## Helper Functions
The following helper functions are available on the `SpinClient` class:
### validateWebhook
```typescript
validateWebhook(
  key: string,
  timestamp: string,
  salt: string,
)
```

## Error Handling

To handle errors in the `SpinClient` SDK, you can use the `SpinError` class. Here is an example:

```typescript
import SpinClient, { SpinError } from "spinclient";

const sdk = new SpinClient("api_login", "api_password", "https://url.to.api.com", "https://url.to.your.page.com", "https://url.to.cashier.page.com");

try {
   await sdk.deleteAllFreeRounds("example", "password", "USD");
} catch (e) {
   if (e instanceof SpinError) {
       console.error(`Caught a SpinError with code ${e.code} and message ${e.message}`);
   } else {
       console.error(`Caught an error with message ${e.message}`);
   }
}
```

## Contributing
If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.