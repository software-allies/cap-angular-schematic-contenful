import {
  branchAndMerge,
  chain,
  Rule,
  Tree,
  SchematicContext
} from '@angular-devkit/schematics';
import { Schema as ContentfulOptions } from './schema';
import { FileSystemSchematicContext } from '@angular-devkit/schematics/tools';
import { NodeDependencyType } from 'schematics-utilities';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import * as cap_utilities from 'cap-utilities';

export function installPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.log('info', `🔍 Installing packages...`);
    return host;
  };
}

// function addToEnvironments(options: ContentfulOptions): Rule {
//   return (host: Tree) => {
//     cap_utilities.addEnvironmentVar(host, [
//       {
//         env: '',
//         appPath: options.path || '/src',
//         key: 'CONTENTFUL_SPACE_ID',
//         value: options.space_id
//       },
//       {
//         env: '',
//         appPath: options.path || '/src',
//         key: 'CONTENTFUL_ENVIRONMENT',
//         value: options.environment
//       },
//       {
//         env: '',
//         appPath: options.path || '/src',
//         key: 'CONTENTFUL_DELIVERY_ACCESS_TOKEN',
//         value: options.delivery_accessToken
//       },
//       {
//         env: 'prod',
//         appPath: options.path || '/src',
//         key: 'CONTENTFUL_SPACE_ID',
//         value: ''
//       },
//       {
//         env: 'prod',
//         appPath: options.path || '/src',
//         key: 'CONTENTFUL_ENVIRONMENT',
//         value: ''
//       },
//       {
//         env: 'prod',
//         appPath: options.path || '/src',
//         key: 'CONTENTFUL_DELIVERY_ACCESS_TOKEN',
//         value: ''
//       }
//     ])
//   }
// }


function installDependencies(version: number) {
  return (host: Tree) => {
    if (version === 8) {
      cap_utilities.addPackageToPackageJson(host, [{
        type: NodeDependencyType.Default,
        pkg: 'cap-angular-contentful',
        version: '~0.1.7'
      }])
    } else {
      cap_utilities.addPackageToPackageJson(host, [{
        type: NodeDependencyType.Default,
        pkg: 'cap-angular-contentful',
        version: '~1.0.0'
      }])
    }

  }
}


function addToRootModule(options: ContentfulOptions) {
  return (host: Tree) => {
    // const filePath = `${options.path}/app/app.module.ts`;
    // cap_utilities.appendToStartFile(host, filePath, `import { environment } from '../environments/environment';`)
    cap_utilities.addToNgModule(host, options, [
      {
        name: 'CapContentfulModule',
        path: 'cap-angular-contentful',
        type: 'module',
        forRootValues: {
          params: [
            {
              name: 'space_id',
              value: `${options.space_id}`,
              
            },
            {
              name: 'environment',
              value: `${options.environment}`
            },
            {
              name: 'delivery_accessToken',
              value: `${options.delivery_accessToken}`
            }
          ]
        }
      }
    ])
  }
}

export function capAngularSchematicContentful(options: any): Rule {
  return (tree: Tree, context: FileSystemSchematicContext) => {

    cap_utilities.setupOptions(tree, options)

    return chain([
      branchAndMerge(chain([
        installDependencies(options.version),
        installPackageJsonDependencies(),
        // addToEnvironments(options),
        addToRootModule(options)
      ])),
    ])(tree, context);

  };
}
