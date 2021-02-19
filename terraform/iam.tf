resource "aws_iam_role" "iot-ruuvi-tag" {
  name                        = "iot-ruuvi-tag"
  assume_role_policy          = jsonencode({
    Version                   = "2012-10-17"
    Statement                 = [
      {
        Effect                = "Allow"
        Principal             = {
          Service             = "iot.amazonaws.com"
        }
        Action                = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "docker-fleet-iam-policy" {
  name                        = "cloudwatch"
  role                        = aws_iam_role.iot-ruuvi-tag.id
  policy                      = jsonencode({
    Version                   = "2012-10-17"
    Statement                 = [
      {
        Effect                = "Allow"
        Action                = "cloudwatch:*"
        Resource              = "*"
      }
    ]
  })
}
