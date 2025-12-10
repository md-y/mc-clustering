import template from './template.sc?raw';

export function generateScript(assignment: string[][]) {
  return template.replace('{{json}}', JSON.stringify(assignment).replaceAll('"', "'"));
}
