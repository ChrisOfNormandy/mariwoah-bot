import CommandGroup = require("./objects/CommandGroup");
export const cache: Map<string, CommandGroup>;
export function addCommandGroup(name: string): CommandGroup;
export function getCommandGroup(name: string): CommandGroup;
