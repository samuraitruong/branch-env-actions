const core = require('@actions/core');
const github = require('@actions/github');
const inputs = ['branch-prefix', 'mode', 'fallback', 'uppercase', 'vars'];
try {
  const [branchName = '', mode, fallback = '', uppercase, vars = ''] =
    inputs.map((prop) => core.getInput(prop));
  const transform = (s) => (uppercase === 'true' ? s.toUpperCase() : s);

  const branch = github.context.ref
    .replace('refs/heads/', '')
    .replace(branchName, '');
  core.setOutput('env-name', branch);
  core.setOutput('env-name-lower', branch.toLocaleLowerCase());

  let awsAccessKeyId = transform('aws_access_key_id');
  let awsSecretAccessKey = transform('aws_secret_access_key');
  const awsAccessKeyIdName = 'aws-access-key-id';
  const awsSecretAccessKeyName = 'aws-secret-access-key';

  if (fallback.includes(branch)) {
    core.setOutput(awsAccessKeyIdName, awsAccessKeyId);
    core.setOutput(awsSecretAccessKeyName, awsSecretAccessKey);
    return;
  }

  if (mode === 'prefix') {
    awsSecretAccessKey = transform(branch + '_' + awsSecretAccessKey);
    awsAccessKeyId = transform(branch + '_' + awsAccessKeyId);
  } else {
    awsSecretAccessKey = transform(awsSecretAccessKey + '_' + branch);
    awsAccessKeyId = transform(awsAccessKeyId + '_' + branch);
  }
  console.log(awsAccessKeyIdName, awsAccessKeyId);
  console.log(awsSecretAccessKeyName, awsSecretAccessKey);
  core.setOutput(awsAccessKeyIdName, awsAccessKeyId);
  core.setOutput(awsSecretAccessKeyName, awsSecretAccessKey);
  const dynamicVars = vars.split(',').filter(Boolean);
  dynamicVars.forEach((name) => {
    let value = mode === 'prefix' ? branch + '_' + name : name + '_' + branch;
    if (fallback.includes(branch)) {
      value = name;
    }

    core.setOutput(name, transform(value));
  });
} catch (error) {
  core.setFailed(error.message);
}
