# cap-angular-schematic-contentful  [![NPM version](https://badge.fury.io/js/CAP.svg)](https://npmjs.org/package/CAP) [![Build Status](https://travis-ci.org/Elena%20M.%20Sarabia/CAP.svg?branch=master)](https://travis-ci.org/Elena%20M.%20Sarabia/CAP) [![Generic badge](https://img.shields.io/badge/CAP-Active-<COLOR>.svg)](https://shields.io/)
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
The CapContentfulService have 2 starting methods to send queries to Contentful API:

* getItems(contentType: string, relatedAssetKey?: string[])
* getItemById(contentType: string, id: string, relatedAssetKey?: string[])

### Params
* contentType: The name of content-type to get.
* id: The id of a item to get.
* relatedAssetKey: Array of params of related Assets, ex: ['image'], ['image', 'file']...

## Advantages over Official Contentful Client
Using this service all http requests can be intercepted by a Angular Http interceptor, so, can be cached, show a loading screen, and apply to requests any common use with a interceptor.


# Example of implementation on a Angular app

### Template
```
<div class="row">
    <div class="col-lg-3 col-md-4 col-6" *ngFor="let item of items">
        <a routerLink="/items/{{item.id}}" title="{{item.name}}">
            <img src="{{item.logo.file.url}}" loading="lazy" class="img-fluid" alt="{{item.logo.file.title}}" title="{{item.logo.file.title}}">
        </a>
    </div>
</div>
```

### TS Logic
```
import { ContentfulService } from '../modules/cap-contentful/services/cap-contetful.service';
...

items: any[];

constructor(
    private contentfulService: ContentfulService
) {}

ngOnInit() {
    this.contentfulService.getItems('items', ['logo'])
        .subscribe((response: any) => {
            let _items = [];
            response.items.forEach((item) => {
                _items = [..._items, item.fields]
            });
            this.items = _items;
        });
}

```

## Pipes
Because in Contentful is possible use the Markdown format on text fileds, the CapContentfulModule have the next useful pipes:

* md-to-html 
    Convert Markdown to Html
* strip-tags
    Remove Html tags




## Usage
Angular 9

## Built With
[Schematic](https://www.schematics.com/)

## Version 
0.0.11

## Authors
Software Allies - [Software Allies](https://github.com/software-allies)
​
### Contributor 
César Alonso Magaña Gavilanes - [cesaralonso](https://github.com/cesaralonso)

## License
MIT © [Software Allies](https://github.com/software-allies/cap-angular-schematic-contentful)