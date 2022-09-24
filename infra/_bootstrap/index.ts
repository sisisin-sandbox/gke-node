import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';

const project = new pulumi.Config('gcp').require('project');

const pulumiSa = new gcp.serviceaccount.Account('pulumi-sa', {
  accountId: 'pulumi-sa',
  displayName: 'pulumi service account',
});

[
  'roles/editor',
  'roles/iam.serviceAccountAdmin',
  'roles/iam.workloadIdentityPoolAdmin',
  'roles/resourcemanager.projectIamAdmin',
].forEach((role) => {
  new gcp.projects.IAMMember(`pulumi-sa-roles-${role}`, {
    project,
    role,
    member: pulumi.interpolate`serviceAccount:${pulumiSa.email}`,
  });
});

// ref. https://cloud.google.com/blog/ja/products/identity-security/enabling-keyless-authentication-from-github-actions
const wip = new gcp.iam.WorkloadIdentityPool('ci-pool', {
  workloadIdentityPoolId: 'ci-pool-id',
});

const repo = 'sisisin-sandbox/gke-node';
new gcp.iam.WorkloadIdentityPoolProvider('ci-pool-oidc-provider', {
  workloadIdentityPoolProviderId: 'ci-pool-oidc-provider-id',
  workloadIdentityPoolId: wip.workloadIdentityPoolId,
  displayName: 'ci-pool-oidc-provider',
  oidc: {
    issuerUri: 'https://token.actions.githubusercontent.com',
  },
  // ref. https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect#understanding-the-oidc-token
  attributeMapping: {
    'google.subject': 'assertion.sub',
    'attribute.actor': 'assertion.actor',
    'attribute.aud': 'assertion.aud',
  },
  // attributeCondition: `
  //   assertion.job_workflow_ref.startsWith("${repo}/.github/workflows/preview-infra-bootstrap.yaml") ||
  //   assertion.job_workflow_ref.startsWith("${repo}/.github/workflows/deploy-infra-bootstrap.yaml")
  // `,
  attributeCondition: `
    assertion.job_workflow_ref.startsWith("${repo}/.github/workflows) &&
    (
      assertion.job_workflow_ref.contains("preview-infra-main.yaml") ||
      assertion.job_workflow_ref.contains("deploy-infra-main.yaml") ||
      assertion.job_workflow_ref.contains("preview-infra-bootstrap.yaml") ||
      assertion.job_workflow_ref.contains("deploy-infra-bootstrap.yaml")
    )
  `,
});

new gcp.serviceaccount.IAMMember('allow-to-bind-ci-pool-provider-to-pulumi-sa', {
  member: pulumi.interpolate`principalSet://iam.googleapis.com/${wip.name}/attribute.repository/${repo}`,
  role: 'roles/iam.workloadIdentityUser',
  serviceAccountId: pulumiSa.name,
});
