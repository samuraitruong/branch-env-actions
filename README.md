# branch-env-actions

The simple action that return dynamic key by using branch name as environment name and prefix or posfix to return the aws-access-key-id and aws-secret-access

For example, the workflow run on branch release/prod, the secrets has the key 'PROD_AWS_ACCESS_KEY_ID', we also have other environment and PREFIX with envionment name we want dynamic load the envionment

## Inputs

### `branch-prefix`

**Required** The prefix of branch var. Default `release/`.

### `mode`

prefix or posfix. Default `prefix`.

### `fallback`

the list of branch name comma separator will return default key

## Outputs

### `uppercase`

true | false. if true the key will return as uppercase

## Outputs

### env-name

### env-name-lower

### aws-access-key-id

### aws-secret-access-key

## Example usage

```yml
uses: samuraitruong/branch-env-actions@v1.0
with:
  branch-prefix: 'release/'
  fallback: main,dev
  uppercase: true
  mode: prefix
```

## Example with aws credentials

```yml
- uses: samuraitruong/branch-env-actions@v1.0
  id: env
  with:
    branch-prefix: 'release/'
    fallback: main,dev
    uppercase: true
    mode: prefix

- name: Configure AWS Credentials
    uses: aws-actions/configure-aws-credentials@v1
    with:
      aws-access-key-id: ${{ secrets[steps.env.outputs.aws-access-key-id] }}
      aws-secret-access-key: ${{ secrets[steps.env.outputs.aws-secret-access-key] }}
      aws-region: us-east-2

```

### Usage of dynamic var names

```yml

- name: Run test action
        id: test
        uses: samuraitruong/branch-env-actions@v1
        with:
          fallback: main
          vars: var1,var2,var3
- name: Print Output
  run: |
    echo var1 = ${{ steps.test.outputs.var1 }}
    echo var2 = ${{ steps.test.outputs.var2 }}
    echo var3 = ${{ steps.test.outputs.var3 }}
```
