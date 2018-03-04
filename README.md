# npm-use-reg
A CLI to easily switch npm registries which are configured by your env varibles

## Install:
```
npm i npm-use-reg -g
```

## Usage
```
npm-use-reg myreg
npm-use-reg npm
```

## Setup
Specify your registries by configuring your environment variables

#### For OSX users
Open your .bash_profile in an editor  
```
nano ~/.bash_profile
```  

Add your registries with the following syntax 
```
export NPM_USE_REG_[your registry name]=[your registry url]
``` 

Examples:
```
export NPM_USE_REG_MYREG=https://my.company.com/registry/
export NPM_USE_REG_NPM=https://registry.npmjs.org/
```