interface EventSource {
  type: string;
  value: string;
}

interface EventField {
  fieldName: string;
  source: EventSource;
}

interface Condition {
  expression: string;
  parameters: string[];
}

interface Status {
  text: string;
  category: string;
}

interface Template {
  eventType: string;
  version: string;
  channel: string;
  status: Status;
  fields: string[];
  actionTypes: string[];
}

interface Action {
  type: string;
  eventType: string;
  label: string;
  requiredPrivilegeIds?: string[];
}

interface Terminator {
  eventType: string;
  isSuccess: boolean;
  outcome: string;
  status: Status;
}

interface Task {
  name: string;
  triggers: string[];
  condition: Condition;
  templates: Template[];
  actions: Action[];
  //   additionalAwaitableUpdates: any[];
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  version: string;
  isActive: boolean;
  triggers: string[];
  initiationEvent: {
    eventType: string;
    version: string;
    fields: EventField[];
    actions: Action[];
    iterator: {
      type: string;
      value: string;
    };
  };
  tasks: Task[];
  terminationEvent: {
    eventType: string;
    version: string;
    fields: string[];
    terminators: Terminator[];
  };
}
