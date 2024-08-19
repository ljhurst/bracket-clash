# bracket-clash
Combine men's and women's bracket scores

# Website

http://lj-bracket-clash.s3-website-us-east-1.amazonaws.com

# Deploy Instructions

## Log in to AWS

Go to [AWS](aws.com) and log in with root user email

## Go to S3

Find the `lj-bracket-clash` bucket

## Upload files

- `index.html`
- `script.js`
- `fetch-data.js`

# Local Development

We use Javascript modules to keep our code organized. This means that you need to run a local server to view the website. You can do this by running the following command in the terminal:

```
python3 test/simple-cors-http-server.py
```

Then, open your browser and navigate to `localhost:8000`.

Mock data is available in `test/data/` for testing.

# Tech Stack

- Native JavaScript
- HTML
- Styling via [Bulma](https://bulma.io/)
- Charts by [Chart.js](https://www.chartjs.org/)
- Hosted on [AWS S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/HostingWebsiteOnS3Setup.html)
