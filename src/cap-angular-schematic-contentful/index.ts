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
//         key: 'contAccessToken',
//         value: options.contAccessToken
//       },
//       {
//         env: '',
//         appPath: options.path || '/src',
//         key: 'contSpace',
//         value: options.contSpace
//       },
//       {
//         env: '',
//         appPath: options.path || '/src',
//         key: 'contentfulEnvironment',
//         value: options.contentfulEnvironment
//       },
//       {
//         env: 'prod',
//         appPath: options.path || '/src',
//         key: 'contAccessToken',
//         value: options.contAccessToken
//       },
//       {
//         env: 'prod',
//         appPath: options.path || '/src',
//         key: 'contSpace',
//         value: options.contSpace
//       },
//       {
//         env: 'prod',
//         appPath: options.path || '/src',
//         key: 'contentfulEnvironment',
//         value: options.contentfulEnvironment
//       },
//     ])
//   }
// }


function installDependencies() {
  return (host: Tree) => {
    cap_utilities.addPackageToPackageJson(host, [{
      type: NodeDependencyType.Default,
      pkg: 'cap-angular-contentful',
      version: '~0.1.4'
    }])
  }
}



function addToRootModule(options: ContentfulOptions) {
  return (host: Tree) => {
    cap_utilities.addToNgModule(host, options, [
      {
        name: 'CapContentfulModule',
        path: 'cap-angular-contentful',
        type: 'module',
        forRootValues: {
          params: [
            {
              name: 'space_id',
              value: `${options.contSpace}`,
            },
            {
              name: 'environment',
              value: `${options.contentfulEnvironment}`
            },
            {
              name: 'delivery_accessToken',
              value: `${options.contAccessToken}`
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
        installDependencies(),
        installPackageJsonDependencies(),
        // addToEnvironments(options),
        addToRootModule(options)
      ])),
    ])(tree, context);

  };
}
