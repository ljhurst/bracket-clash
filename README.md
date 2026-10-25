# Bracket Clash 🏀

[![Deploy](https://github.com/ljhurst/bracket-clash/actions/workflows/deploy.yml/badge.svg)](https://github.com/ljhurst/bracket-clash/actions/workflows/deploy.yml)

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

Merging to `main` deploys both the infrastructure and the site, through
[stych](https://github.com/ljhurst/stych)'s shared workflows:

- **Pull request**: comments the Terraform plan and a preview of the site
  sync (files to upload and delete).
- **Merge to `main`**: applies the Terraform plan, then builds `frontend/` and
  syncs `index.html`, `assets/` and `dist/` to the `lj-bracket-clash` bucket.

GitHub Actions authenticates to AWS via OIDC (no stored AWS secrets), and
applies only from the `prod` environment, which is limited to `main`.

### Break-glass local deploys

Deploying from a laptop is for emergencies only. Access is via AWS IAM
Identity Center (SSO), using the `bracket-clash-deploy` permission set.

One-time setup:

```bash
aws configure sso
```

When prompted, use the SSO start URL for this account and select the
`bracket-clash-deploy` permission set. Name the profile `bracket-clash-deploy`.

Then, before each session:

```bash
aws sso login --profile bracket-clash-deploy
export AWS_PROFILE=bracket-clash-deploy
```

Infrastructure:

```bash
terraform -chdir=infra init
terraform -chdir=infra plan -out=bracket-clash.tfplan
terraform -chdir=infra apply bracket-clash.tfplan
```

Site:

```bash
cd frontend
npm ci
npm run build
aws s3 cp index.html s3://lj-bracket-clash/index.html
aws s3 sync assets/ s3://lj-bracket-clash/assets/ --delete
aws s3 sync dist/ s3://lj-bracket-clash/dist/ --delete
```

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
