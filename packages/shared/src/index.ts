// Shared types and functions

export type User = {
  id: string;
  name: string;
};

export const sayHello = (name: string): string => {
  return `Hello, ${name}!`;
}; 