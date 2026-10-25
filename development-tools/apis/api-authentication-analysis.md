# API authentication at a glance

What each of the 114 APIs in [popular](popular-api-call-examples.md), [information](information-api-call-examples.md) and [additional](additional-popular-app-apis.md) needs before you can call it. The same information is shown as a badge on every API's entry; this page is for comparing them. Details come from each provider's documentation as understood when these lists were written, so check the entry's documentation link before relying on it.

| Type | APIs | What it takes | Effort |
|---|---|---|---|
| No auth | 35 | Call it straight away from a browser or script. | Simplest |
| API key | 28 | Register, copy a key, send it as a header or parameter. | Simple |
| Key optional | 1 | Works without a key; a key raises the rate limit. | Simple |
| OAuth 2.0 | 39 | Create an app, then run an authorisation flow for each user. | Hardest day-to-day |
| Bot or JWT token | 2 | Create a bot or sign a token yourself. | Moderate |
| Key + secret | 4 | Two credentials; the secret must be stored safely. | Moderate |
| Account login | 4 | Full cloud or account setup with permissions. | Heaviest |
| Partner only | 1 | No public sign-up; you need an agreement. | Not self-serve |
| **Total** | **114** | | |

35 of 114 need no sign-up at all (31%). Social, business and marketplace APIs are almost all OAuth, while the open-data lists (museums, books, food, public holidays) are mostly open.

## Who needs what

**No auth** (35): [Art Institute of Chicago](information-api-call-examples.md#15-art-institute-of-chicago-api), [Bhagavad Gita](information-api-call-examples.md#26-bhagavad-gita-api), [Bible](information-api-call-examples.md#24-bible-api), [Bored](information-api-call-examples.md#50-bored-api), [Cat Facts](information-api-call-examples.md#8-cat-facts-api), [Chess.com](information-api-call-examples.md#42-chesscom-api), [Chuck Norris Jokes](information-api-call-examples.md#49-chuck-norris-jokes-api), [CoinGecko](popular-api-call-examples.md#7-coingecko-api), [CoinGecko](information-api-call-examples.md#16-coingecko-api), [Dog Facts](information-api-call-examples.md#7-dog-facts-api), [FishWatch](information-api-call-examples.md#11-fishwatch-api), [Free Dictionary](information-api-call-examples.md#4-free-dictionary-api), [Fruityvice](information-api-call-examples.md#22-fruityvice-api), [Gutendex](information-api-call-examples.md#35-gutendex-api), [JokeAPI](information-api-call-examples.md#33-jokeapi), [Lichess](information-api-call-examples.md#43-lichess-api), [Metropolitan Museum of Art](information-api-call-examples.md#12-metropolitan-museum-of-art-api), [Nager.Date](information-api-call-examples.md#28-nagerdate-api), [Numbers](information-api-call-examples.md#38-numbers-api), [Open Brewery DB](information-api-call-examples.md#21-open-brewery-db-api), [Open Food Facts](information-api-call-examples.md#18-open-food-facts-api), [Open Library](information-api-call-examples.md#2-open-library-api), [Open Trivia Database](information-api-call-examples.md#32-open-trivia-database-api), [OpenAQ](information-api-call-examples.md#29-openaq-api), [PoetryDB](information-api-call-examples.md#3-poetrydb-api), [Public Holidays](information-api-call-examples.md#27-public-holidays-api), [PunkAPI](information-api-call-examples.md#40-punkapi), [Quran Cloud](information-api-call-examples.md#25-quran-cloud-api), [Random Useless Facts](information-api-call-examples.md#34-random-useless-facts-api), [REST Countries](popular-api-call-examples.md#20-rest-countries-api), [REST Countries](information-api-call-examples.md#1-rest-countries-api), [UK Carbon Intensity](information-api-call-examples.md#30-uk-carbon-intensity-api), [Wizard World](information-api-call-examples.md#39-wizard-world-api), [xeno-canto](information-api-call-examples.md#46-xeno-canto-api), [Zoo Animals](information-api-call-examples.md#9-zoo-animals-api)

**API key** (28): [Alpha Vantage](popular-api-call-examples.md#17-alpha-vantage-api), [Binance](popular-api-call-examples.md#18-binance-api), [Calendarific](information-api-call-examples.md#44-calendarific-api), [Checkiday](information-api-call-examples.md#45-checkiday-api), [Coinbase](information-api-call-examples.md#47-coinbase-api), [CoinMarketCap](information-api-call-examples.md#17-coinmarketcap-api), [DoorDash Drive](additional-popular-app-apis.md#31-doordash-drive-api), [eBird](information-api-call-examples.md#10-ebird-api), [Europeana](information-api-call-examples.md#48-europeana-api), [Fixer.io](popular-api-call-examples.md#16-fixerio-api), [Foursquare Places](additional-popular-app-apis.md#34-foursquare-places-api), [Google Maps](popular-api-call-examples.md#1-google-maps-api), [Google Places](additional-popular-app-apis.md#35-google-places-api), [Harvard Art Museums](information-api-call-examples.md#14-harvard-art-museums-api), [IQAir](information-api-call-examples.md#31-iqair-api), [Mailchimp](popular-api-call-examples.md#15-mailchimp-api), [Merriam-Webster](information-api-call-examples.md#6-merriam-webster-api), [New York Times](popular-api-call-examples.md#19-new-york-times-api), [OpenAI/GPT](popular-api-call-examples.md#8-openaigpt-api), [OpenWeatherMap / Weatherstack](popular-api-call-examples.md#2-openweathermap--weatherstack), [Rijksmuseum](information-api-call-examples.md#13-rijksmuseum-api), [Spoonacular](information-api-call-examples.md#23-spoonacular-api), [Steam Web](additional-popular-app-apis.md#37-steam-web-api), [Stripe](popular-api-call-examples.md#3-stripe-api), [TheCocktailDB](information-api-call-examples.md#20-thecocktaildb-api), [TheMealDB](information-api-call-examples.md#19-themealdb-api), [Words](information-api-call-examples.md#5-words-api), [Yelp Fusion](additional-popular-app-apis.md#33-yelp-fusion-api)

**Key optional** (1): [Google Books](information-api-call-examples.md#36-google-books-api)

**OAuth 2.0** (39): [Asana](additional-popular-app-apis.md#14-asana-api), [Discord](additional-popular-app-apis.md#5-discord-api), [Dropbox](additional-popular-app-apis.md#17-dropbox-api), [eBay](additional-popular-app-apis.md#25-ebay-api), [Etsy](additional-popular-app-apis.md#26-etsy-api), [Facebook Graph API (Meta)](additional-popular-app-apis.md#2-facebook-graph-api-meta), [GitHub](popular-api-call-examples.md#5-github-api), [Google Docs/Sheets](additional-popular-app-apis.md#19-google-docssheets-api), [Google Drive](additional-popular-app-apis.md#16-google-drive-api), [HubSpot](additional-popular-app-apis.md#42-hubspot-api), [Instagram API (Meta)](additional-popular-app-apis.md#1-instagram-api-meta), [Intercom](additional-popular-app-apis.md#44-intercom-api), [LinkedIn](additional-popular-app-apis.md#7-linkedin-api), [Lyft](additional-popular-app-apis.md#30-lyft-api), [Microsoft Teams](additional-popular-app-apis.md#18-microsoft-teams-api), [Monday.com](additional-popular-app-apis.md#21-mondaycom-api), [Notion](additional-popular-app-apis.md#12-notion-api), [OneDrive](additional-popular-app-apis.md#20-onedrive-api), [PayPal](additional-popular-app-apis.md#23-paypal-api), [Pinterest](additional-popular-app-apis.md#8-pinterest-api), [PlayStation Network API (Unofficial)](additional-popular-app-apis.md#40-playstation-network-api-unofficial), [Reddit](additional-popular-app-apis.md#4-reddit-api), [Salesforce](additional-popular-app-apis.md#41-salesforce-api), [Shopify](additional-popular-app-apis.md#22-shopify-api), [Slack](popular-api-call-examples.md#12-slack-api), [Snapchat](additional-popular-app-apis.md#11-snapchat-api), [SoundCloud](additional-popular-app-apis.md#39-soundcloud-api), [Spotify](popular-api-call-examples.md#9-spotify-api), [Square](additional-popular-app-apis.md#24-square-api), [TikTok](additional-popular-app-apis.md#6-tiktok-api), [Trello](additional-popular-app-apis.md#13-trello-api), [Twitch](additional-popular-app-apis.md#36-twitch-api), [Twitter/X](popular-api-call-examples.md#6-twitterx-api), [Uber](additional-popular-app-apis.md#29-uber-api), [Venmo](additional-popular-app-apis.md#28-venmo-api), [WhatsApp Business](additional-popular-app-apis.md#9-whatsapp-business-api), [YouTube Data](additional-popular-app-apis.md#3-youtube-data-api), [Zendesk](additional-popular-app-apis.md#43-zendesk-api), [Zoom](additional-popular-app-apis.md#15-zoom-api)

**Bot or JWT token** (2): [Apple Music](additional-popular-app-apis.md#38-apple-music-api), [Telegram Bot](additional-popular-app-apis.md#10-telegram-bot-api)

**Key + secret** (4): [Amazon Product Advertising](additional-popular-app-apis.md#27-amazon-product-advertising-api), [Coinbase](popular-api-call-examples.md#11-coinbase-api), [Edamam Nutrition](information-api-call-examples.md#41-edamam-nutrition-api), [Twilio](popular-api-call-examples.md#4-twilio-api)

**Account login** (4): [AWS](popular-api-call-examples.md#13-aws-api), [Azure](popular-api-call-examples.md#14-azure-api), [Firebase](popular-api-call-examples.md#10-firebase-api), [GeoNames](information-api-call-examples.md#37-geonames-api)

**Partner only** (1): [Grubhub API (Limited)](additional-popular-app-apis.md#32-grubhub-api-limited)

## Free tiers worth knowing

| API | Free allowance |
|---|---|
| OpenWeatherMap | 1,000 calls a day |
| Merriam-Webster | 1,000 calls a day |
| New York Times | 1,000 calls a day |
| Spoonacular | 150 calls a day |
| Alpha Vantage | 5 calls a minute |
| Fixer.io | 100 calls a month |
| Google Maps | $200 monthly credit |
| OpenAI | No free tier, pay per use |
| Harvard Art Museums, Rijksmuseum, eBird, Europeana | Free with a key; museum APIs ask for attribution |

## Where to start

- **Nothing to sign up for:** [REST Countries](information-api-call-examples.md#1-rest-countries-api), [Open Trivia Database](information-api-call-examples.md#32-open-trivia-database-api), [JokeAPI](information-api-call-examples.md#33-jokeapi), [PoetryDB](information-api-call-examples.md#3-poetrydb-api), [Numbers API](information-api-call-examples.md#38-numbers-api), [Metropolitan Museum of Art](information-api-call-examples.md#12-metropolitan-museum-of-art-api).
- **Easiest with a key:** [OpenWeatherMap](popular-api-call-examples.md#2-openweathermap--weatherstack), [Alpha Vantage](popular-api-call-examples.md#17-alpha-vantage-api), [New York Times](popular-api-call-examples.md#19-new-york-times-api).
- **Worth the setup for real products:** Google Maps, Stripe, Twilio, GitHub, Spotify, AWS.

## Before you depend on a free API

- Most have rate limits, and free tiers carry weaker uptime promises.
- Museum and data APIs often require attribution.
- Check the terms before commercial use.
- Paid tiers usually bring higher limits, more features and support.
