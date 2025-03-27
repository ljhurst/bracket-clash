# Bracket Clash 🏀

Combine men's and women's bracket scores

# Website

http://lj-bracket-clash.s3-website-us-east-1.amazonaws.com

# Deploy Instructions

1. Build

	```bash
	npm run build
	```

1. Log in to AWS

	Go to [AWS](https://aws.com) and log in with root user email

1. Go to S3

	Find the `lj-bracket-clash` bucket

1. Upload files

	- `assets/`
	- `index.html`
	- `dist/`

# Local Development

We use Javascript modules to keep our code organized. This means that you need to run a local server to view the website. You can do this by running the following command in the terminal:

```bash
python3 test/simple-cors-http-server.py
```

Then, open your browser and navigate to `localhost:8000`.

Mock data is available in `test/data/` for testing.

## Unit Tests

We use [Jest](https://jestjs.io/) for unit tests. Unit tests are in `test/unit`

```bash
npm run test
```

Code coverage can be viewed by opening `coverage/lcov-report/index.html` in the browser

## Formatting

We use [Prettier](https://prettier.io/) for formatting

```bash
npm run format
```

## Linting

We use [ESLint](https://eslint.org/) for linting

```bash
npm run lint:fix
```

## Bundling

We use [Webpack](https://webpack.js.org/) for bundling

```bash
npm run build
```

## Release

There is a helper command to do all of the above steps and build

```bash
npm run release
```


# Tech Stack

- TypeScript
- HTML
- Styling via [Bulma](https://bulma.io/)
- Charts by [Chart.js](https://www.chartjs.org/)
- Tables by [DataTables](https://datatables.net/)
- Hosted on [AWS S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/HostingWebsiteOnS3Setup.html)
