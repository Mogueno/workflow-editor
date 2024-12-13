import React, { useState } from "react";
import { WorkflowDefinition } from "./types";
import Ajv from "ajv";
import { workflowSchema } from "./workflowSchema";
import workflowBoilerplate from "./assets/workflow-boilerplate.json";

// Comprehensive validation function
function validateWorkflowDefinition(obj: WorkflowDefinition): string[] {
  const errors: string[] = [];

  // Validate triggers
  if (!Array.isArray(obj.triggers) || obj.triggers.length === 0) {
    errors.push("Triggers must be a non-empty array");
  }

  // Validate initiation event
  if (!obj.initiationEvent) {
    errors.push("Initiation event is required");
  } else {
    if (!obj.initiationEvent.eventType)
      errors.push("Initiation event type is required");
    if (!obj.initiationEvent.version)
      errors.push("Initiation event version is required");
  }

  // Validate tasks
  if (!Array.isArray(obj.tasks) || obj.tasks.length === 0) {
    errors.push("Tasks must be a non-empty array");
  } else {
    obj.tasks.forEach((task, index) => {
      if (!task.name) errors.push(`Task at index ${index} is missing a name`);

      // Validate triggers
      if (!Array.isArray(task.triggers) || task.triggers.length === 0) {
        errors.push(`Task at index ${index} must have at least one trigger`);
      }

      // Validate templates
      if (!Array.isArray(task.templates) || task.templates.length === 0) {
        errors.push(`Task at index ${index} must have at least one template`);
      }
    });
  }

  // Validate termination event
  if (!obj.terminationEvent) {
    errors.push("Termination event is required");
  } else {
    if (!obj.terminationEvent.eventType)
      errors.push("Termination event type is required");
    if (!obj.terminationEvent.version)
      errors.push("Termination event version is required");
    if (
      !Array.isArray(obj.terminationEvent.terminators) ||
      obj.terminationEvent.terminators.length === 0
    ) {
      errors.push("Termination event must have at least one terminator");
    }
  }

  // Validate using Ajv
  const ajv = new Ajv();
  const validate = ajv.compile(workflowSchema);
  const valid = validate(obj);
  if (!valid) {
    errors.push(
      ...(validate.errors?.map((error) => error.message || "") || [])
    );
  }

  return errors;
}

const JsonEditor: React.FC = () => {
  const [jsonText, setJsonText] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [saveConfirmation] = useState(false);
  const [fileName, setFileName] = useState("workflow.json");

  const handleJsonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setJsonText(text);

    try {
      // Attempt to parse the JSON
      const parsedJson = JSON.parse(text);

      // Validate the parsed JSON against our interface
      const errors = validateWorkflowDefinition(parsedJson);

      setValidationErrors(errors);
      setIsValid(errors.length === 0);
    } catch (error) {
      console.error(error);
      // JSON parsing error
      setValidationErrors(["Invalid JSON syntax"]);
      setIsValid(false);
    }
  };

  const handleSave = () => {
    if (!isValid) return;

    // Create a Blob with the JSON content
    const blob = new Blob([jsonText], { type: "application/json" });

    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName || "workflow.json";

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(link.href);
  };

  // Pre-populate with the provided JSON
  const handlePopulate = () => {
    const prePopulatedJson = `${JSON.stringify(workflowBoilerplate, null, 2)}`;
    setJsonText(prePopulatedJson);

    try {
      const parsedJson = JSON.parse(prePopulatedJson);
      const errors = validateWorkflowDefinition(parsedJson);

      setValidationErrors(errors);
      setIsValid(errors.length === 0);
    } catch (error) {
      console.error(error);

      setValidationErrors(["Invalid JSON syntax"]);
      setIsValid(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Workflow JSON Editor
        </h1>
        <label className="block flex-grow">
          <span className="text-gray-700">Filename:</span>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
            placeholder="Enter filename"
          />
        </label>

        <div className="flex mb-4 space-x-4 items-center w-100 h-100 border rounded-md">
          <textarea
            className="w-100 h-100 font-mono text-sm p-3 border rounded-md 
          focus:outline-none focus:ring-2 focus:ring-blue-500 
          border-gray-300 bg-gray-50"
            value={jsonText}
            onChange={handleJsonChange}
            placeholder="Paste your JSON here..."
          />
        </div>

        <div className="flex items-center mt-4 mb-4 space-x-2">
          <button
            onClick={handlePopulate}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Populate with Example
          </button>

          {isValid ? (
            <span className="text-green-600 mr-2">✓</span>
          ) : (
            <span className="text-red-600 mr-2">✗</span>
          )}
          <span
            className={`font-semibold ${
              isValid ? "text-green-600" : "text-red-600"
            }`}
          >
            {isValid ? "Valid JSON" : "Invalid JSON"}
          </span>
        </div>

        {validationErrors.length > 0 && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold block mb-2">Validation Errors:</strong>
            <ul className="list-disc list-inside">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          className={`mt-4 px-4 py-2 rounded transition-colors duration-300 ${
            isValid
              ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={handleSave}
          disabled={!isValid}
        >
          Save
        </button>

        {saveConfirmation && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
            JSON successfully saved!
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonEditor;
