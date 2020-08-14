import { Path } from "typescript";

// Global objects, attributes, and methods
export const PathBase: PathValue = {};
export const KeyBase: Key = {
  value: "key value",
  time: 0,
};
export const PropertyGroupBase = {};
export const PropertyBase: PathProperty = {
  value: "property base string value",
  name: "property name",
  velocity: 0,
  speed: 0,
  numKeys: 0,
  propertyIndex: 1,
  valueAtTime: (time) => this.value,
  velocityAtTime: (time) => this.velocity,
  speedAtTime: (time) => this.speed,
  wiggle: (freq, amp, octaves = 1, amp_mult = 0.5, t = time) => this.value,
  temporalWiggle: (freq, amp, octaves = 1, amp_mult = 0.5, t = time) =>
    this.value,
  smooth: (width = 0.2, samples = 5, t = time) => this.value,
  loopIn: (type = "cycle", numKeyframes = 0) => this.value,
  loopOut: (type = "cycle", numKeyframes = 0) => this.value,
  loopInDuration: (type = "cycle", duration = 0) => this.value,
  loopOutDuration: (type = "cycle", duration = 0) => this.value,
  createPath: (points, inTangents = [], outTangent = [], isClosed = true) =>
    PathBase,
  key: (indexOrName) => KeyBase,
  propertyGroup: (countUp = 1) => PropertyGroupBase,
};

export const layer = CompBase.layer;
export function comp(index: number | string) {
  return CompBase;
}

export const time: number = 0;
export const colorDepth: number = 8;

export function footage(name: string): Footage {}

// Time conversion methods

export function timeToFrames(
  t: number = time + CompBase.displayStartTime,
  fps: number = 1.0 / CompBase.frameDuration,
  isDuration: boolean = false
): number {
  return time * CompBase.frameDuration;
}

export function framesToTime(
  frames: number,
  fps: number = 1.0 / CompBase.frameDuration
): number {
  return frames * CompBase.frameDuration;
}

export function timeToTimecode(
  t: number = time + CompBase.displayStartTime,
  timecodeBase: number = 30,
  isDuration: boolean = false
): string {
  return "00:00:00:00";
}

export function timeToNTSCTimecode(
  t: number = time + CompBase.displayStartTime,
  ntscDropFrame: boolean = false,
  isDuration: boolean = false
) {
  return "00:00:00:00";
}

export function timeToFeetAndFrames(
  t: number = time + CompBase.displayStartTime,
  fps: number = 1.0 / CompBase.frameDuration,
  framesPerFoot: number = 16,
  isDuration: boolean = false
): string {
  return "00:00:00:00";
}

export function timeToCurrentFormat(
  t: number = time + CompBase.displayStartTime,
  fps: number = 1.0 / CompBase.frameDuration,
  isDuration: boolean = false,
  ntscDropFrame: boolean = CompBase.ntscDropFrame
): string {
  return "0000";
}

// Vector Math methods

export function add(vec1: Vector, vec2: Vector): Vector {
  return vec1;
}
export function sub(vec1: Vector, vec2: Vector): Vector {
  return vec1;
}
export function mul(vec1: Vector, amount: number): Vector {
  return vec1;
}
export function div(vec1: Vector, amount: number): Vector {
  return vec1;
}
export function clamp(
  value: number | [],
  limit1: number,
  limit2: number
): number | [] {
  return value;
}
export function dot(vec1: Vector, vec2: Vector): Vector {
  return vec1;
}
export function cross(vec1: Vector, vec2: Vector): Vector {
  return vec1;
}
export function normalize(vec1: Vector, vec2: Vector): Vector {
  return [1, 1];
}
export function length(point1: Vector, point2?: Vector): number {
  return 1;
}
export function lookAt(fromPoint: Vector, atPoint: Vector): Vector3D {
  return [0, 0, 0];
}

// Random number methods

export function seedRandom(offset: number, timeless: boolean = false): void {}
export function random(
  minValOrArray: number | [],
  maxValOrArray: number | []
): number | [] {
  return minValOrArray;
}
export function gaussRandom(
  minValOrArray: number | [],
  maxValOrArray: number | []
): number | [] {
  return minValOrArray;
}
export function noise(valOrArray: number | []): number {
  return 1;
}

// Interpolation methods

export function linear(
  t: number,
  tMin: number,
  tMax: number,
  value1?: number | [],
  value2?: number | []
): number | [] {
  return value1 || tMin;
}

export function ease(
  t: number,
  tMin: number,
  tMax: number,
  value1?: number | [],
  value2?: number | []
): number | [] {
  return value1 || tMin;
}

export function easeIn(
  t: number,
  tMin: number,
  tMax: number,
  value1?: number | [],
  value2?: number | []
): number | [] {
  return value1 || tMin;
}

export function easeOut(
  t: number,
  tMin: number,
  tMax: number,
  value1?: number | [],
  value2?: number | []
): number | [] {
  return value1 || tMin;
}

// Color Conversion methods

export function rgbToHsl(rgbaArray: Color): Color {
  return [1, 1, 1, 1];
}

export function hslToRgb(hslaArray: Color): Color {
  return [1, 1, 1, 1];
}

export function hexToRgb(hex: string): Color {
  return [1, 1, 1, 1];
}

// Other Math methods

export function degreesToRadians(degrees: number): number {
  return 1;
}

export function radiansToDegrees(radians: number): number {
  return 1;
}
