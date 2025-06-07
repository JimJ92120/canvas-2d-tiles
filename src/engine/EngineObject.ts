export enum ObjectDirection {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
}

export type ObjectSpriteDirectionOffset = {
  [ObjectDirection.Up]: [number, number];
  [ObjectDirection.Down]: [number, number];
  [ObjectDirection.Left]: [number, number];
  [ObjectDirection.Right]: [number, number];
};

export type ObjectSpriteAnimationRecord = {
  [key: string]: {
    spritePositionList: [number, number][];
    duration: number;
  };
};

export default class EngineOjbect {
  position: [number, number];
  direction: ObjectDirection;
  readonly color: string;
  readonly spriteImageUrl: string;
  private spriteDirectionOffset: ObjectSpriteDirectionOffset;
  readonly animationRecord: ObjectSpriteAnimationRecord;

  constructor(
    position: EngineOjbect["position"],
    direction: EngineOjbect["direction"],
    color: EngineOjbect["color"],
    spriteImageUrl: EngineOjbect["spriteImageUrl"],
    spriteDirectionOffset: EngineOjbect["spriteDirectionOffset"],
    animationRecord: EngineOjbect["animationRecord"]
  ) {
    this.position = position;
    this.direction = direction;
    this.color = color;
    this.spriteImageUrl = spriteImageUrl;
    this.spriteDirectionOffset = spriteDirectionOffset;
    this.animationRecord = animationRecord;
  }

  getSpriteDirectionOffset(): [number, number] {
    return this.spriteDirectionOffset[this.direction];
  }
}
