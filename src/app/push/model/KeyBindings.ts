export class KeyBindings {
  id: string;
  bindings: Array<{ row: number, column: number, key: string }>;

  static default = {
    id: "default", bindings: [
      {key: "y", row: 3, column: 1},
      {key: "x", row: 3, column: 2},
      {key: "c", row: 3, column: 3},
      {key: "v", row: 3, column: 4},
      {key: "b", row: 3, column: 5},
      {key: "n", row: 3, column: 6},
      {key: "m", row: 3, column: 7},
      {key: "a", row: 2, column: 1},
      {key: "s", row: 2, column: 2},
      {key: "d", row: 2, column: 3},
      {key: "f", row: 2, column: 4},
      {key: "g", row: 2, column: 5},
      {key: "h", row: 2, column: 6},
      {key: "j", row: 2, column: 7},
      {key: "q", row: 1, column: 1},
      {key: "w", row: 1, column: 2},
      {key: "e", row: 1, column: 3},
      {key: "r", row: 1, column: 4},
      {key: "t", row: 1, column: 5},
      {key: "z", row: 1, column: 6},
      {key: "u", row: 1, column: 7},
    ]
  };


}
