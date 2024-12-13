export const workflowSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    version: { type: "string" },
    isActive: { type: "boolean" },
    triggers: {
      type: "array",
      items: { type: "string" },
    },
    initiationEvent: {
      type: "object",
      properties: {
        eventType: { type: "string" },
        version: { type: "string" },
        fields: {
          type: "array",
          items: {
            type: "object",
            properties: {
              fieldName: { type: "string" },
              source: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  value: { type: "string" },
                },
                required: ["type", "value"],
              },
            },
            required: ["fieldName", "source"],
          },
        },
        actions: {
          type: "array",
          items: { type: "string" },
        },
        iterator: {
          type: "object",
          properties: {
            type: { type: "string" },
            value: { type: "string" },
          },
          required: ["type", "value"],
        },
      },
      required: ["eventType", "version", "fields", "actions", "iterator"],
    },
    tasks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          triggers: {
            type: "array",
            items: { type: "string" },
          },
          condition: {
            type: "object",
            properties: {
              expression: { type: "string" },
              parameters: { type: "array" },
            },
            required: ["expression", "parameters"],
          },
          templates: {
            type: "array",
            items: {
              type: "object",
              properties: {
                eventType: { type: "string" },
                version: { type: "string" },
                channel: { type: "string" },
                status: {
                  type: "object",
                  properties: {
                    text: { type: "string" },
                    category: { type: "string" },
                  },
                  required: ["text", "category"],
                },
                fields: {
                  type: "array",
                  items: { type: "string" },
                },
                actionTypes: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: [
                "eventType",
                "version",
                "channel",
                "status",
                "fields",
                "actionTypes",
              ],
            },
          },
          actions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: { type: "string" },
                eventType: { type: "string" },
                label: { type: "string" },
                requiredPrivilegeIds: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: ["type", "eventType", "label", "requiredPrivilegeIds"],
            },
          },
          additionalAwaitableUpdates: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: [
          "name",
          "triggers",
          "condition",
          "templates",
          "actions",
          "additionalAwaitableUpdates",
        ],
      },
    },
    terminationEvent: {
      type: "object",
      properties: {
        eventType: { type: "string" },
        version: { type: "string" },
        fields: {
          type: "array",
          items: { type: "string" },
        },
        terminators: {
          type: "array",
          items: {
            type: "object",
            properties: {
              eventType: { type: "string" },
              isSuccess: { type: "boolean" },
              outcome: { type: "string" },
              status: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  category: { type: "string" },
                },
                required: ["text", "category"],
              },
            },
            required: ["eventType", "isSuccess", "outcome", "status"],
          },
        },
      },
      required: ["eventType", "version", "fields", "terminators"],
    },
  },
  required: [
    "id",
    "name",
    "version",
    "isActive",
    "triggers",
    "initiationEvent",
    "tasks",
    "terminationEvent",
  ],
};
