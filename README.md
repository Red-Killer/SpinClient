# SpinClient

SpinClient is a JavaScript SDK designed to facilitate easier integration with the [spin.ac](https://documentation.spin.ac/) API. This SDK provides a set of tools and types to interact seamlessly with the Spin API, making it easier to integrate spin.ac games into your website.

## Table of Contents

- [SpinClient](#spinclient)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [Licnse](#licnse)

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


## Contributing
If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.

## Licnse
This project is licensed under the MIT License. See the LICENSE file for more details.