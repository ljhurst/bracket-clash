# Bracket Clash 🏀

[![Frontend](https://github.com/ljhurst/bracket-clash/actions/workflows/frontend.yaml/badge.svg)](https://github.com/ljhurst/bracket-clash/actions/workflows/frontend.yaml)

Combine men's and women's bracket scores

## Website

<http://lj-bracket-clash.s3-website-us-east-1.amazonaws.com>

## Tour

```tree
.
├── frontend/  # <-- Static website code
├── infra/     # <-- Infrastructure as Code
├── LICENSE
└── README.md
```

## Prerequisites

- Node.js (LTS version)
- Python 3 (for local development server)
- AWS CLI (for manual deployments)
- Terraform (for infrastructure management)
- pre-commit (optional, for git hooks)

## Deployment

Deployments are automated via GitHub Actions:

- **Push to main**: Automatically build and deploy frontend to S3

For manual deployments (useful for local testing), see the sections below.

### Authentication

A `bracket-clash-deploy-user` is available to manage the infrastructure and deploy
the code. If you don't have credentials you'll have to go to the console to create
new ones

Save the credentials in ~/.aws/credentials under a `[bracket-clash]` profile

```ini
[bracket-clash]
aws_access_key_id = <access-key-id>
aws_secret_access_key = <secret-access-key>
```

And then export the profile for use with Terraform and AWS CLI

```bash
export AWS_PROFILE=bracket-clash
```

### Infrastructure

Infrastructure is managed by [Terraform](https://www.terraform.io/).

Go to `infra/` and initialize Terraform

```bash
terraform init
```

Review the planned changes

```bash
terraform plan
```

Apply the changes

```bash
terraform apply
```

When making changes to the infrastructure be sure to format and validate

```bash
terraform fmt
terraform validate
```

### Frontend

From the `frontend/` directory

1. Install dependencies

 ```bash
 npm install
 ```

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

## Local Development

We use JavaScript modules to keep our code organized.
This means that you need to run a local server to view the website.
You can do this by running the following command in the terminal:

```bash
python3 test/simple-cors-http-server.py
```

Then, open your browser and navigate to `localhost:8000`.

Mock data is available in `test/data/` for testing.

### Code Conventions

Code conventions are handled by [pre-commit](https://pre-commit.com/) hooks.
Install pre-commit and run

```bash
pre-commit install
```

To make sure things are working run

```bash
pre-commit run --all-files
```

### Formatting

We use [Prettier](https://prettier.io/) for formatting

```bash
npm run format
```

### Linting

We use [ESLint](https://eslint.org/) for linting

```bash
npm run lint:fix
```

### Unit Tests

We use [Jest](https://jestjs.io/) for unit tests. Unit tests are in `test/unit`

```bash
npm run test
```

Code coverage can be viewed by opening `coverage/lcov-report/index.html` in the browser

### Bundling

We use [Webpack](https://webpack.js.org/) for bundling

```bash
npm run build
```

### Release

There is a helper command to do all of the above steps and build

```bash
npm run release
```

## Tech Stack

- TypeScript
- HTML
- Styling via [Bulma](https://bulma.io/)
- Charts by [Chart.js](https://www.chartjs.org/)
- Tables by [DataTables](https://datatables.net/)
- Hosted on [AWS S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/HostingWebsiteOnS3Setup.html)
- Infrastructure managed by [Terraform](https://www.terraform.io/)
- CI/CD via [GitHub Actions](https://github.com/features/actions)
