locals {
  ruuvi-tags = {
    "f8:5e:2d:d7:10:75" = {
      name        = "home-ruuvi-bedroom"
      mqtt        = "home/ruuvi/bedroom"
    }
  }
}

resource "aws_iot_certificate" "ruuvi-tag" {
  active          = true
}

resource "aws_iot_policy" "ruuvi-tag" {
  name            = "ruuvi-tag-policy"

  policy          = jsonencode({
    Version       = "2012-10-17"
    Statement     = [
      {
        Action    = [
          "iot:*",
        ]
        Effect    = "Allow"
        Resource  = "*"
      },
    ]
  })
}

resource "aws_iot_policy_attachment" "att" {
  policy          = aws_iot_policy.ruuvi-tag.name
  target          = aws_iot_certificate.ruuvi-tag.arn
}

resource "aws_iot_thing_type" "ruuvi-tag" {
  name            = "RuuviTag"

  properties {
    description   = "Ruuvi Tag"
  }
}

resource "aws_iot_thing" "ruuvi-tag" {
  for_each        = local.ruuvi-tags

  name            = each.value.name
  thing_type_name = aws_iot_thing_type.ruuvi-tag.name

  attributes = {
    MacAddress    = each.key
  }
}

resource "aws_iot_thing_principal_attachment" "ruuvi-tag-cert-attachment" {
  for_each        = aws_iot_thing.ruuvi-tag

  principal       = aws_iot_certificate.ruuvi-tag.arn
  thing           = each.value.name
}

output "ruuvi-tag-certificate-public-key" { value = aws_iot_certificate.ruuvi-tag.public_key }
output "ruuvi-tag-certificate-private-key" { value = aws_iot_certificate.ruuvi-tag.private_key }

data "aws_iot_endpoint" "ruuvi-tag" {}

output "ruuvi-tag-endpoint" { value = data.aws_iot_endpoint.ruuvi-tag.endpoint_address }
