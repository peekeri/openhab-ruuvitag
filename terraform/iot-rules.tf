resource "aws_iot_topic_rule" "ruuvi-tag" {
  name              = "HomeRuuviTags"
  description       = "Home Ruuvi Tags"
  enabled           = true
  sql               = "SELECT * FROM 'home/ruuvi/#'"
  sql_version       = "2016-03-23"

  cloudwatch_metric {
    metric_name       = "Temperature-$${tagName}"
    metric_namespace  = "$${location}"
    metric_unit       = "None"
    metric_value      = "$${temperature}"
    role_arn          = aws_iam_role.iot-ruuvi-tag.arn
  }

  cloudwatch_metric {
    metric_name       = "Pressure-$${tagName}"
    metric_namespace  = "$${location}"
    metric_unit       = "None"
    metric_value      = "$${pressure}"
    role_arn          = aws_iam_role.iot-ruuvi-tag.arn
  }

  cloudwatch_metric {
    metric_name       = "Humidity-$${tagName}"
    metric_namespace  = "$${location}"
    metric_unit       = "None"
    metric_value      = "$${humidity}"
    role_arn          = aws_iam_role.iot-ruuvi-tag.arn
  }

  cloudwatch_metric {
    metric_name       = "Battery-$${tagName}"
    metric_namespace  = "$${location}"
    metric_unit       = "None"
    metric_value      = "$${battery}"
    role_arn          = aws_iam_role.iot-ruuvi-tag.arn
  }
}
