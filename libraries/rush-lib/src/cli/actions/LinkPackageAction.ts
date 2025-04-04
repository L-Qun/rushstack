// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import type { RushCommandLineParser } from '../RushCommandLineParser';
import type { RushConfigurationProject } from '../../api/RushConfigurationProject';
import { BaseHotlinkPackageAction } from './BaseHotlinkPackageAction';
import type { HotlinkManager } from '../../utilities/HotlinkManager';
import { BRIDGE_PACKAGE_ACTION_NAME, LINK_PACKAGE_ACTION_NAME } from '../../utilities/actionNameConstants';
import type { CommandLineStringListParameter } from '@rushstack/ts-command-line';
import { RushConstants } from '../../logic/RushConstants';
import { Async } from '@rushstack/node-core-library';

export class LinkPackageAction extends BaseHotlinkPackageAction {
  protected readonly _projectList: CommandLineStringListParameter;

  public constructor(parser: RushCommandLineParser) {
    super({
      actionName: LINK_PACKAGE_ACTION_NAME,
      summary:
        '(EXPERIMENTAL) Use hotlinks to simulate installation of a locally built project folder as a dependency' +
        ' of specific projects.',
      documentation:
        'This command enables you to test a locally built project by creating a symlink under the specified' +
        ' projects\' node_modules folders.  The implementation is similar to "pnpm link" and "npm link", but' +
        ' better integrated with Rush features.  Like those commands, the symlink ("hotlink") is not reflected' +
        ' in pnpm-lock.yaml, affects the consuming project only, and has the same limitations as "workspace:*".' +
        '  The hotlinks will be cleared when you next run "rush install" or "rush update".' +
        `  Compare with the "rush ${BRIDGE_PACKAGE_ACTION_NAME}" command, which affects the entire lockfile` +
        ' including indirect dependencies.',
      parser
    });

    this._projectList = this.defineStringListParameter({
      parameterLongName: '--project',
      required: false,
      argumentName: 'PROJECT',
      description:
        'A list of Rush project names that will be hotlinked to the "--path" folder. ' +
        'If not specified, the default is the project of the current working directory.'
    });
  }

  protected async getProjectsToLinkAsync(): Promise<Set<RushConfigurationProject>> {
    const projectsToLink: Set<RushConfigurationProject> = new Set();
    const projectNames: readonly string[] = this._projectList.values;

    if (projectNames.length > 0) {
      for (const projectName of projectNames) {
        const project: RushConfigurationProject | undefined =
          this.rushConfiguration.getProjectByName(projectName);
        if (!project) {
          throw new Error(`The project "${projectName}" was not found in "${RushConstants.rushPackageName}"`);
        }
        projectsToLink.add(project);
      }
    } else {
      const currentProject: RushConfigurationProject | undefined =
        this.rushConfiguration.tryGetProjectForPath(process.cwd());
      if (!currentProject) {
        throw new Error(`No Rush project was found in the current working directory`);
      }
      projectsToLink.add(currentProject);
    }

    return projectsToLink;
  }

  public async connectPackageAsync(linkedPackagePath: string, hotlinkManager: HotlinkManager): Promise<void> {
    const projectsToLink: Set<RushConfigurationProject> = await this.getProjectsToLinkAsync();
    await Async.forEachAsync(
      projectsToLink,
      async (project) => {
        await hotlinkManager.linkPackageAsync(this.terminal, project, linkedPackagePath);
      },
      { concurrency: 5 }
    );
  }
}
