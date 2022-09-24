import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
const project = new pulumi.Config('gcp').require('project');

const podSa = new gcp.serviceaccount.Account('gke-node-cluster-pod-user', {
  accountId: 'gke-node-cluster-pod-user',
});

const roles = ['roles/cloudtrace.agent'];

roles.forEach((role) => {
  new gcp.projects.IAMMember(`gke-node-cluster-pod-user-iam-${role}`, {
    member: pulumi.interpolate`serviceAccount:${podSa.email}`,
    role,
    project,
  });
});

new gcp.serviceaccount.IAMMember(`allow-to-bind-gke-provider-to-pod-sa`, {
  member: pulumi.interpolate`serviceAccount:${project}.svc.id.goog[default/pod-kube-service-account]`,
  role: 'roles/iam.workloadIdentityUser',
  serviceAccountId: podSa.name,
});
