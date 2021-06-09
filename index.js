const core = require('@actions/core');
const github = require('@actions/github');
const inputs = ['branch-prefix', 'mode', 'fallback', 'uppercase'];
try {
  const [branchName, mode, fallback = '', uppercase] = inputs.map((prop) =>
    core.getInput(prop),
  );
  const transform = (s) => (uppercase === 'true' ? s.toUpperCase() : s);

  const branch = github.context.ref
    .replace('refs/heads/', '')
    .replace(branchName, '');
  core.setOutput('env-name', branch);

  const awsAccessKeyId = transform('aws_access_key_id');
  const awsSecretAccessKey = transform('aws_secret_access_key');
  const awsAccessKeyIdName = 'aws-access-key-id';
  const awsSecretAccessKeyName = 'aws-secret-access-key';

  if (fallback.includes(branch)) {
    core.setOutput(awsAccessKeyIdName, awsAccessKeyId);
    core.setOutput(awsSecretAccessKeyName, awsSecretAccessKey);
    return;
  }
  if (mode === 'prefix') {
    core.setOutput(
      awsAccessKeyIdName,
      transform(branch + '_' + awsSecretAccessKey),
    );
    core.setOutput(
      awsSecretAccessKeyName,
      transform(branch + '_' + awsSecretAccessKey),
    );
  } else {
    core.setOutput(
      awsAccessKeyIdName,
      transform(awsSecretAccessKey + '_' + branch),
    );
    core.setOutput(
      awsSecretAccessKeyName,
      transform(awsSecretAccessKey + '_' + branch),
    );
  }
  // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(github.context.payload, undefined, 2);
  // console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
