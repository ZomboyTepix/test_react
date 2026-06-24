terraform {
    backend "s3" {
        bucket = "test-react-tf-state-bucket-juliotepixtle"
        key    = "app-infra/terraform.tfstate"
        region = "eu-west-3"
    }
    required_providers {
        aws = {
            source  = "hashicorp/aws"
            version = "~> 5.92"
        }
    }
    required_version = ">= 1.2"
}

provider "aws" {
    region = "eu-west-3" # Paris
}

data "aws_ami" "ubuntu" {
    most_recent = true
    owners      = ["099720109477"]

    filter {
        name   = "name"
        values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
    }
}

resource "tls_private_key" "pk" {
    algorithm = "RSA"
    rsa_bits  = 4096
}

resource "aws_key_pair" "generated_key" {
    key_name   = "app-key-terraform"
    public_key = tls_private_key.pk.public_key_openssh
}

resource "local_file" "ssh_key" {
    filename        = "${path.module}/app-key-terraform.pem"
    content         = tls_private_key.pk.private_key_pem
    file_permission = "0400"
}

resource "aws_security_group" "app_sg" {
    name_prefix = "app-sg-"
    description = "Allow SSH, Frontend, Backend, Adminer, DB"

    ingress {
        description = "SSH"
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        description = "Frontend React"
        from_port   = 3000
        to_port     = 3000
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        description = "Backend FastAPI"
        from_port   = 8000
        to_port     = 8000
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        description = "Adminer"
        from_port   = 8080
        to_port     = 8080
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        description = "MySQL Database"
        from_port   = 3306
        to_port     = 3306
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    lifecycle {
        create_before_destroy = true
    }
}

resource "aws_instance" "app_server" {
    ami           = data.aws_ami.ubuntu.id
    instance_type = "t3.micro"
    key_name      = aws_key_pair.generated_key.key_name

    vpc_security_group_ids = [aws_security_group.app_sg.id]

    root_block_device {
        volume_size = 20
        volume_type = "gp3"
    }

    tags = {
        Name = "Terraform-App-Server"
    }
}

output "instance_ip" {
    value = aws_instance.app_server.public_ip
}
