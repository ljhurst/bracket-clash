terraform {
  backend "s3" {
    bucket       = "lj-tf-state"
    key          = "bracket-clash/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
