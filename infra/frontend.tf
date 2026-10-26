locals {
  site_domain = "bracket-clash.bylukehurst.com"
}

module "site" {
  source = "git::https://github.com/ljhurst/stych.git//infra/modules/static-site?ref=v1.4.0"

  bucket_name             = "lj-bracket-clash"
  domain_name             = local.site_domain
  content_security_policy = "default-src 'self'; script-src 'self'; style-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://cdn.datatables.net; font-src 'self' https://cdnjs.cloudflare.com; img-src 'self' data:; connect-src 'self' https://gambit-api.fantasy.espn.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'"
}

moved {
  from = aws_s3_bucket.static_site
  to   = module.site.aws_s3_bucket.this
}

moved {
  from = aws_s3_bucket_policy.static_site
  to   = module.site.aws_s3_bucket_policy.this
}
