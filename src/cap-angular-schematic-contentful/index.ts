import { strings } from '@angular-devkit/core';
import { 
  apply,
  template,
  branchAndMerge,
  chain,
  forEach,
  FileEntry,
  move,
  Rule,
  mergeWith,
  SchematicsException,
  Tree,
  url
 } from '@angular-devkit/schematics';
import { Schema as ContentfulOptions } from './schema';
import { 
  addEnvironmentVar,
  // addStyles,
  getAppName,
  // addIdToElement
} from 'cap-utilities';
import { FileSystemSchematicContext } from '@angular-devkit/schematics/tools';
import { getWorkspace } from '@schematics/angular/utility/config';
import {
  // buildRelativePath, 
  findModule, 
  MODULE_EXT, 
  ROUTING_MODULE_EXT
} from '@schematics/angular/utility/find-module';
import { parseName } from '@schematics/angular/utility/parse-name';
import { buildDefaultPath } from '@schematics/angular/utility/project';
import { getProjectFromWorkspace } from '@angular/cdk/schematics/utils/get-project';




function addToEnvironments(options: ContentfulOptions): Rule {
    return (host: Tree) => {
        addEnvironmentVar(host, '', options.path || '/src', 'contAccessToken', options.contAccessToken);
        addEnvironmentVar(host, '', options.path || '/src', 'contSpace', options.contSpace);
        addEnvironmentVar(host, '', options.path || '/src', 'contentfulEnvironment', options.contentfulEnvironment);
        addEnvironmentVar(host, 'prod', options.path || '/src', 'contAccessToken', options.contAccessToken);
        addEnvironmentVar(host, 'prod', options.path || '/src', 'contSpace', options.contSpace);
        addEnvironmentVar(host, 'prod', options.path || '/src', 'contentfulEnvironment', options.contentfulEnvironment);
    }
}

export function capAngularSchematicContentful(options: any): Rule {
  return (tree: Tree, context: FileSystemSchematicContext) => {

    // Get project
    options.project = (options.project) ? options.project : getAppName(tree);
    if (!options.project) {
      throw new SchematicsException('Option "project" is required.');
    }

    const workspace = getWorkspace(tree);
    const project: any = getProjectFromWorkspace(workspace, options.project);
    if (!project) {
      throw new SchematicsException(`Project is not defined in this workspace.`);
    }

    if (options.path === undefined) {
      options.path = buildDefaultPath(project);
    }
    
    options.module = findModule(tree, options.path, 'app' + MODULE_EXT, ROUTING_MODULE_EXT);
    options.name = '';
    const parsedPath = parseName(options.path!, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;
    

    const projectType: string = project.projectType || project.projects[options.project].projectType;
    if (projectType !== 'application') {
      throw new SchematicsException(`Is required a project type of "application".`);
    }

    // Object that will be used as context for the EJS templates.
    const baseTemplateContext = {
      ...strings,
      ...options,
    };

    const templateSource = apply(url('./files'), [
      template(baseTemplateContext),
      move(null as any, parsedPath.path),
      forEach((fileEntry: FileEntry) => {
        if (tree.exists(fileEntry.path)) {
          tree.overwrite(fileEntry.path, fileEntry.content);
        }
        return fileEntry;
      })
    ]);

    return chain([
      branchAndMerge(chain([
        addToEnvironments(options),
        mergeWith(templateSource)
      ])),
    ])(tree, context);

  };
}
