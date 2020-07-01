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

## Functionality

The schematic add the module into the app.module.ts file 

```
import { CapContentfulModule } from 'cap-angular-contentful'
```
---
configure into the import section
```
@NgModule({
  imports: [
    CapContentfulModule.forRoot({
      space_id: '<your Contentful Space>',
      environment: '<your Contentful Environment>'
      delivery_accessToken: '<your Contentful Access Token>',
    })
  ],
})
export class AppModule { }

```
## Use
Import the CapContentfulService service into your .ts file.
*Example*
```

import { Component } from '@angular/core';
import { CapContentfulService } from 'cap-angular-contentful';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

constructor(private contentful: CapContentfulService) {
  
}
```


## Service
The module export the *CapContentfulService* service that allows you to use the followings methods:

*getItems*
Return the items related with a specific content type
Example:
```
contentful.getItems('person', 3, 2).subscribe( item => {
  console.log('items with specify limit: ', item);
})
```

*getItemById*
Return a specific item by Id
Example:
```
contentful.getItemById('3K9b0esdy0q0yGqgW2g6Ke').subscribe(resp => {
  console.log('getItemById: ', resp);
  this.title = resp.fields.title;
  this.author = resp.fields.author
  this.bodyD = resp.fields.body
  this.description = resp.fields.description
  this.heroImage = resp.fields.heroImage
  this.publishDate = resp.fields.publishDate
  this.slug = resp.fields.slug
  this.tags = resp.fields.tags

})
```
 
*getElementsByContentType*
Return a list of items related with a specific content type
Example:
```
contentful.getElementsByContentType('person', 2, 2).subscribe(resp => {
  console.log('getElementsByContentType: ', resp);
})
```

*getAssets*
Return an item related with a specific assetId
Example:
```
contentful.getAssets('6Od9v3wzLOysiMum0Wkmme').subscribe(resp => {
   console.log('resp: ', resp);
})
```
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