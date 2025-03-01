// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import type { RushConfigurationProject } from '../../api/RushConfigurationProject';
import type { IPhase } from '../../api/CommandLineConfiguration';

import { Operation } from './Operation';
import type {
  ICreateOperationsContext,
  IPhasedCommandPlugin,
  PhasedCommandHooks
} from '../../pluginFramework/PhasedCommandHooks';
import type { IOperationSettings } from '../../api/RushProjectConfiguration';

const PLUGIN_NAME: 'PhasedOperationPlugin' = 'PhasedOperationPlugin';

/**
 * Core phased command plugin that provides the functionality for generating a base operation graph
 * from the set of selected projects and phases.
 */
export class PhasedOperationPlugin implements IPhasedCommandPlugin {
  public apply(hooks: PhasedCommandHooks): void {
    hooks.createOperations.tap(PLUGIN_NAME, createOperations);
  }
}

function createOperations(
  existingOperations: Set<Operation>,
  context: ICreateOperationsContext
): Set<Operation> {
  const {
    projectsInUnknownState: changedProjects,
    phaseOriginal,
    phaseSelection,
    projectSelection,
    projectConfigurations,
    includePhaseDeps,
    isInitial
  } = context;

  const operations: Map<string, Operation> = new Map();

  // Create tasks for selected phases and projects
  // This also creates the minimal set of dependencies needed
  for (const phase of phaseOriginal) {
    for (const project of projectSelection) {
      getOrCreateOperation(phase, project);
    }
  }

  // Grab all operations that were explicitly requested.
  const operationsWithWork: Set<Operation> = new Set();
  for (const operation of existingOperations) {
    const { associatedPhase, associatedProject } = operation;
    if (!associatedPhase || !associatedProject) {
      // Fix this when these are required properties.
      continue;
    }

    if (phaseSelection.has(associatedPhase) && changedProjects.has(associatedProject)) {
      operationsWithWork.add(operation);
    }
  }

  // Add all operations that are selected that depend on the explicitly requested operations.
  // This will mostly be relevant during watch; in initial runs it should not add any new operations.
  for (const operation of operationsWithWork) {
    for (const consumer of operation.consumers) {
      operationsWithWork.add(consumer);
    }
  }

  if (includePhaseDeps && isInitial) {
    // Add all operations that are dependencies of the operations already scheduled.
    for (const operation of operationsWithWork) {
      for (const dependency of operation.dependencies) {
        operationsWithWork.add(dependency);
      }
    }
  }

  for (const operation of existingOperations) {
    // Enable exactly the set of operations that are requested.
    operation.enabled &&= operationsWithWork.has(operation);

    if (!includePhaseDeps || !isInitial) {
      const { associatedPhase, associatedProject } = operation;
      if (!associatedPhase || !associatedProject) {
        // Fix this when these are required properties.
        continue;
      }

      // This filter makes the "unsafe" selections happen.
      operation.enabled &&= phaseSelection.has(associatedPhase) && projectSelection.has(associatedProject);
    }
  }

  return existingOperations;

  // Binds phaseSelection, projectSelection, operations via closure
  function getOrCreateOperation(phase: IPhase, project: RushConfigurationProject): Operation {
    const key: string = getOperationKey(phase, project);
    let operation: Operation | undefined = operations.get(key);

    if (!operation) {
      const {
        dependencies: { self, upstream },
        name,
        logFilenameIdentifier
      } = phase;
      const operationSettings: IOperationSettings | undefined = projectConfigurations
        .get(project)
        ?.operationSettingsByOperationName.get(name);
      operation = new Operation({
        project,
        phase,
        settings: operationSettings,
        logFilenameIdentifier: logFilenameIdentifier
      });

      operations.set(key, operation);
      existingOperations.add(operation);

      for (const depPhase of self) {
        operation.addDependency(getOrCreateOperation(depPhase, project));
      }

      if (upstream.size) {
        const { dependencyProjects } = project;
        if (dependencyProjects.size) {
          for (const depPhase of upstream) {
            for (const dependencyProject of dependencyProjects) {
              operation.addDependency(getOrCreateOperation(depPhase, dependencyProject));
            }
          }
        }
      }
    }

    return operation;
  }
}

// Convert the [IPhase, RushConfigurationProject] into a value suitable for use as a Map key
function getOperationKey(phase: IPhase, project: RushConfigurationProject): string {
  return `${project.packageName};${phase.name}`;
}
