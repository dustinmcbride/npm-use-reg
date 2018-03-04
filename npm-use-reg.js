const fs = require('fs');
const npmrcFilePath = process.env.HOME + '/.npmrc';
const envVariblePrefix = 'NPM_USE_REG_';

function findRegistriesFromEnvVaribles() {
  return Object.keys(process.env)
    .filter(key =>
      key.slice(0, 12) === envVariblePrefix)
    .map(key => [key.slice(12, key.length).toLowerCase(), process.env[key]])
}

function createNpmrcFileContentWithNewRegistry(registryUrl) {
  let oldFileContents = fs.readFileSync(npmrcFilePath).toString().split('\n')
  let newFileContent = oldFileContents.map(line => {
    if(line.slice(0,9) === 'registry=') {
      return `registry=${registryUrl}`
    }
    return line
  })
  return newFileContent.join('\n')
}

function displayKnowRegistriesMessage(availableRegistries) {
  let exampleReg;
  console.log('Available registries are:');
  availableRegistries.forEach((url, registry) => {
    console.log(`${registry}: ${url}`);
    exampleReg = registry;
  });
  console.log(`\nUsage: npm-use-reg ${exampleReg}`);
}

function writeFileError (err) {
  if (err) {
    console.log('Error writing file: ' + npmrcFilePath);
  }
  process.exit();
}

function checkUsage(availableRegistries, regToUse) {
  if (!regToUse) {
    console.log('Please specify a registry to use.');
    displayKnowRegistriesMessage(availableRegistries);
    process.exit();
  }
  
  if (!availableRegistries.get(regToUse)) {
    console.log(`No know registry named ${regToUse}`);
    displayKnowRegistriesMessage();
    process.exit();
  }
}

function checkSetup(availableRegistries) {
  if (!availableRegistries.size) {
    console.log('No registires specificed in your env varibles');
    console.log('Please add registires to you ~/.bashrc file with they following syntax');
    console.log('NPM_USE_REG_[NAME]=[registry url]');
    console.log('Example: NPM_USE_REG_NPM=https://registry.npmjs.org/');
    console.log('Example: NPM_USE_REG_MYREG=https://my.company.com/registry/');
    process.exit();
  }
}

function displayHelpMessage(userArg) {
  if (userArg === 'help' || userArg === '--help' || userArg === '-h' || userArg === 'h') {
    console.log('help message');
    process.exit();
  }
}

function start (envArgs) {
  const regToUse = envArgs[2];
  let availableRegistries = new Map(findRegistriesFromEnvVaribles());
  const urlOfRegToUse = availableRegistries.get(regToUse)
  displayHelpMessage(regToUse);
  checkSetup(availableRegistries);
  checkUsage(availableRegistries, regToUse);

  fs.writeFile(npmrcFilePath, createNpmrcFileContentWithNewRegistry(urlOfRegToUse), writeFileError);
  console.log(`NPM will now use registry at ${urlOfRegToUse}`);
}

module.exports = {start}