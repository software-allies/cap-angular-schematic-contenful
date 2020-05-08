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
  url,
  SchematicContext
 } from '@angular-devkit/schematics';
import { Schema as ContentfulOptions } from './schema';
import { 
  addEnvironmentVar
} from './cap-utils';
import { 
  getAppName
} from './cap-utils/package';
// import { FileSystemSchematicContext } from '@angular-devkit/schematics/tools';
import { getWorkspace } from '@schematics/angular/utility/config';
import {
  findModule, 
  MODULE_EXT, 
  ROUTING_MODULE_EXT
} from '@schematics/angular/utility/find-module';
import { parseName } from '@schematics/angular/utility/parse-name';
import { buildDefaultPath } from '@schematics/angular/utility/project';
import { getProjectFromWorkspace } from '@angular/cdk/schematics/utils/get-project';
import * as ts from 'typescript';
import { InsertChange } from '@schematics/angular/utility/change';
import {
  buildRelativePath
} from '@schematics/angular/utility/find-module';
import {
  addImportToModule
} from './vendored-ast-utils';
import {
  addPackageJsonDependency,
  NodeDependency,
  NodeDependencyType
} from 'schematics-utilities';



function readIntoSourceFile(host: Tree, filePath: string) {
  const text = host.read(filePath);
  if (text === null) {
    throw new SchematicsException(`File ${filePath} does not exist.`);
  }
  return ts.createSourceFile(filePath, text.toString('utf-8'), ts.ScriptTarget.Latest, true);
}

function addToNgModule(options: ContentfulOptions): Rule {
  return (host: Tree) => {
    
    const modulePath = options.module;
    // Import CapAngularContentfulModule and declare
    let source = readIntoSourceFile(host, modulePath);

    const componentPath = `${options.path}/app/modules/cap-contentful/cap-angular-contentful.module`;
    const relativePath = buildRelativePath(modulePath, componentPath);
    const classifiedName = 'CapAngularContentfulModule';
    const importRecorder = host.beginUpdate(modulePath);
    const importChanges: any = addImportToModule(
        source,
        modulePath,
        classifiedName,
        relativePath);

    for (const change of importChanges) {
        if (change instanceof InsertChange) {
          importRecorder.insertLeft(change.pos, change.toAdd);
        }
    }
    host.commitUpdate(importRecorder);

    return host;
  };
}

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

function addPackageJsonDependencies(): Rule {
    return (host: Tree, context: SchematicContext) => {
        const dependencies: NodeDependency[] = [
            { type: NodeDependencyType.Default, version: '^0.0.1', name: 'cap-angular-contentful' },
        ];
        dependencies.forEach(dependency => {
            addPackageJsonDependency(host, dependency);
            context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
        });
        return host;
    };
}

export function capAngularSchematicContentful(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {

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
        mergeWith(templateSource),
        addToEnvironments(options),
        addToNgModule(options),
        addPackageJsonDependencies()
      ])),
    ])(tree, context);

  };
}
