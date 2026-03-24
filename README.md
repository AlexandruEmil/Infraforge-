# What is InfraForge?
Most developers waste days writing the same infrastructure boilerplate from scratch — VPC configs, security groups, IAM roles, Kubernetes manifests. InfraForge eliminates that entirely.
Type one sentence. Get a complete, deployable infrastructure stack.
"Deploy a scalable Node.js API on AWS with load balancer, 
auto-scaling, RDS PostgreSQL, and CloudFront CDN"
InfraForge generates:

main.tf 
— Complete Terraform HCL with provider, VPC, EC2/EKS, RDS, IAM, security groups
deployment.yaml 
— Kubernetes Deployments, Services, HPA, Ingress with health checks
Architecture diagram 
— ASCII visual map of all components and connections .github/workflows/deploy.yml
— Full GitHub Actions CI/CD pipeline


Demo
Input:  "Kubernetes microservices with API Gateway, Redis cache, and PostgreSQL on AWS"

Output:
  ✓ Terraform HCL        — VPC, EKS cluster, ElastiCache, RDS, API Gateway, IAM roles
  ✓ Kubernetes YAML      — 3 Deployments, Services, HPA, Ingress, ConfigMaps
  ✓ Architecture Diagram — ASCII map of all components
  ✓ GitHub Actions       — build → test → terraform apply → kubectl deploy

Tech Stack
LayerTechnologyAI / IntelligenceClaude Sonnet (Anthropic API)Infrastructure as CodeTerraform HCLContainer OrchestrationKubernetesCloud PlatformAWS (EKS, RDS, Lambda, CloudFront, S3)CI/CDGitHub ActionsFrontendReact + Hooks

## Getting Started
### Prerequisites

### Node.js 18+
Anthropic API key → console.anthropic.com

### Installation
```bashgit clone https://github.com/yourhandle/infraforge```
```cd infraforge```
```npm install```
### Configuration
#### Create a .env file:
```envANTHROPIC_API_KEY=your_api_key_here```
Or set up the backend proxy (recommended for production):
```
js// server.js — simple Express proxy
app.post('/api/claude', async (req, res) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(req.body)
  });
  res.json(await response.json());
});
```
Run
```bashnpm run dev```
# Open http://localhost:5173

### Example Prompts
"Deploy a scalable Node.js app on AWS with load balancer and auto-scaling"
"Set up microservices architecture with API Gateway, Lambda, and RDS"
"Create a high-availability Redis cluster on EKS with persistent storage"
"Deploy a Next.js app with CloudFront CDN, S3 assets, and PostgreSQL"
"Kubernetes deployment with horizontal pod autoscaling and ingress"

Project Structure
infraforge/
├── src/
│   └── cloud-infra-generator.jsx   # Main React component
├── server.js                        # API proxy (optional)
├── package.json
└── README.md

What makes this different
Most AI tools that touch infrastructure generate pseudocode or incomplete snippets.
InfraForge generates real, deployable configs — syntactically correct HCL and YAML,
with security best practices applied automatically:

IAM least-privilege roles
Encrypted RDS storage at rest
Private subnets with NAT gateway
TLS termination at load balancer
Resource limits and liveness probes on all K8s workloads


Roadmap

 Terraform Cloud integration (trigger apply directly)
 AWS CDK output as alternative to Terraform
 Infracost integration (monthly cost estimate per generation)
 Multi-cloud support (GCP, Azure)
 Save and version generated configs
 Export as downloadable .zip
