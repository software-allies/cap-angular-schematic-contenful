# cap-angular-schematic-responsive  [![NPM version](https://badge.fury.io/js/CAP.svg)](https://npmjs.org/package/CAP) [![Build Status](https://travis-ci.org/Elena%20M.%20Sarabia/CAP.svg?branch=master)](https://travis-ci.org/Elena%20M.%20Sarabia/CAP) [![Generic badge](https://img.shields.io/badge/CAP-Active-<COLOR>.svg)](https://shields.io/)
 This repository is a Schematic for use with Contentful API. 

The Schematic will create a service to manage Contentful queries:
 

## Prerequisites
* Have an Angular app 
install  npm 6.13.7 
```	
nmp install 
```
* [Node](https://nodejs.org/en/download/current) 10.6 to the current. 


## Installation
To run the schematic, execute the following command.
```
ng add cap-angular-schematic-contentful 
```

The schematic will be configurated after you answer the following questions.

* What is the Contentful access token? : < string >
* What is the Contentful space? : < string >
* What is the Contentful environment? : < string >




## How to use
The Cap Contentful Service have 2 starting methods to send queries to Contentful API:

* getItems(contentType: string, relatedAssetKey?: string[])
* getItemById(contentType: string, id: string, relatedAssetKey?: string[])

### Params
* contentType: The name of content-type to get.
* relatedAssetKey: Array of params of related Assets, ex: ['image'], ['image', 'file']...

## Advantages over Official Contentful Client
Whit this service all http requests can be intercepted by a Angular Http interceptor, so, can be cached, show a loading screen, and apply to requests any common use with a interceptor.


## Usage
Angular 9

## Built With
[Schematic](https://www.schematics.com/)

## Version 
0.0.1

## Authors
Software Allies - [Software Allies](https://github.com/software-allies)
​
### Contributor 
César Alonso Magaña Gavilanes - [cesaralonso](https://github.com/cesaralonso)

## License
MIT © [Software Allies](https://github.com/software-allies/cap-angular-schematic-responsive)