import type { Easing } from "motion/react";

// Figma NskEi4jH2r9tqirRSZP7kr / 2237:267, get_motion_context.
// Exact exported tracks; all nodes belong to the same 3600 ms looping timeline.
export const CYCLE_MS = 3600;
export interface Track { values: number[]; timing: { times: number[]; ease: Easing[] } }
export type Tracks = Partial<Record<"opacity" | "x" | "y" | "rotate" | "scaleX" | "scaleY" | "width", Track>>;
const figmaSpring = (t: number) => 1 - Math.exp(-t * 7.4426) * (Math.cos(t * 10.5254) + 0.7071 * Math.sin(t * 10.5254));
const timing0: Track["timing"] = {"times":[0,0.0438,0.2778,0.3194,1],"ease":[[0.5,0,0.5,1],"linear","easeInOut","linear"]};
const timing1: Track["timing"] = {"times":[0,0.2778,0.3194,0.5833,0.625,1],"ease":["linear","easeInOut","linear","easeInOut","linear"]};
const timing2: Track["timing"] = {"times":[0,0.5833,0.625,0.9706,1],"ease":["linear","easeInOut","linear",[0.5,0,0.5,1]]};
const timing3: Track["timing"] = {"times":[0,0.8665,0.9706,1],"ease":["linear",[0.5,0,0.5,1],"linear"]};
const timing4: Track["timing"] = {"times":[0,0.0914,0.2916,0.3951,0.6082,0.7124,0.9705,0.9706,0.9994,1],"ease":["easeOut","linear","easeOut","linear","easeOut","linear","linear","easeOut","linear"]};
const timing5: Track["timing"] = {"times":[0,0.9611,0.9706,0.9766,1],"ease":["linear",[0.5,0,0.5,1],"linear",[0.5,0,0.5,1]]};
const timing6: Track["timing"] = {"times":[0,0.827,0.9706,0.9766,1],"ease":["linear",[0.5,0,0.5,1],[0.5,0,0.5,1],"linear"]};
const timing7: Track["timing"] = {"times":[0,0.9611,0.9706,1],"ease":["linear",[0.5,0,0.5,1],"linear"]};
const timing8: Track["timing"] = {"times":[0,0.2656,0.4429,0.5989,0.6112,0.6234,0.6356,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",figmaSpring,"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear",[0.5,0,0.5,1],"linear"]};
const timing9: Track["timing"] = {"times":[0,0.2656,0.4429,0.5989,0.9806,0.9994,1],"ease":["linear","easeInOut",figmaSpring,"linear",[0.5,0,0.5,1],"linear"]};
const timing10: Track["timing"] = {"times":[0,0.2656,0.4429,0.5989,0.6112,0.6234,0.6356,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",[0.68,0,0.92,0.32],"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear"]};
const timing11: Track["timing"] = {"times":[0,0.2656,0.4346,0.5951,0.6082,0.6214,0.6346,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",figmaSpring,"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear",[0.5,0,0.5,1],"linear"]};
const timing12: Track["timing"] = {"times":[0,0.2656,0.4346,0.5951,0.9806,0.9994,1],"ease":["linear","easeInOut",figmaSpring,"linear",[0.5,0,0.5,1],"linear"]};
const timing13: Track["timing"] = {"times":[0,0.2656,0.4346,0.5951,0.6082,0.6214,0.6346,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",[0.68,0,0.92,0.32],"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear"]};
const timing14: Track["timing"] = {"times":[0,0.2656,0.4307,0.5912,0.6053,0.6195,0.6336,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",figmaSpring,"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear",[0.5,0,0.5,1],"linear"]};
const timing15: Track["timing"] = {"times":[0,0.2656,0.4307,0.5912,0.9806,0.9994,1],"ease":["linear","easeInOut",figmaSpring,"linear",[0.5,0,0.5,1],"linear"]};
const timing16: Track["timing"] = {"times":[0,0.2656,0.4307,0.5912,0.6053,0.6195,0.6336,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",[0.68,0,0.92,0.32],"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear"]};
const timing17: Track["timing"] = {"times":[0,0.2656,0.4268,0.5873,0.6024,0.6175,0.6327,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",figmaSpring,"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear",[0.5,0,0.5,1],"linear"]};
const timing18: Track["timing"] = {"times":[0,0.2656,0.4268,0.5873,0.9806,0.9994,1],"ease":["linear","easeInOut",figmaSpring,"linear",[0.5,0,0.5,1],"linear"]};
const timing19: Track["timing"] = {"times":[0,0.2656,0.4268,0.5873,0.6024,0.6175,0.6327,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",[0.68,0,0.92,0.32],"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear"]};
const timing20: Track["timing"] = {"times":[0,0.2656,0.4184,0.5795,0.5966,0.6136,0.6307,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",figmaSpring,"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear",[0.5,0,0.5,1],"linear"]};
const timing21: Track["timing"] = {"times":[0,0.2656,0.4184,0.5795,0.9806,0.9994,1],"ease":["linear","easeInOut",figmaSpring,"linear",[0.5,0,0.5,1],"linear"]};
const timing22: Track["timing"] = {"times":[0,0.2656,0.4184,0.5795,0.5966,0.6136,0.6307,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",[0.68,0,0.92,0.32],"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear"]};
const timing23: Track["timing"] = {"times":[0,0.2656,0.4067,0.5678,0.5878,0.6078,0.6278,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",figmaSpring,"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear",[0.5,0,0.5,1],"linear"]};
const timing24: Track["timing"] = {"times":[0,0.2656,0.4067,0.5678,0.9806,0.9994,1],"ease":["linear","easeInOut",figmaSpring,"linear",[0.5,0,0.5,1],"linear"]};
const timing25: Track["timing"] = {"times":[0,0.2656,0.4067,0.5678,0.5878,0.6078,0.6278,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",[0.68,0,0.92,0.32],"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear"]};
const timing26: Track["timing"] = {"times":[0,0.2656,0.3989,0.5601,0.582,0.6039,0.6258,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",figmaSpring,"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear",[0.5,0,0.5,1],"linear"]};
const timing27: Track["timing"] = {"times":[0,0.2656,0.3989,0.5601,0.9806,0.9994,1],"ease":["linear","easeInOut",figmaSpring,"linear",[0.5,0,0.5,1],"linear"]};
const timing28: Track["timing"] = {"times":[0,0.2656,0.3989,0.5601,0.582,0.6039,0.6258,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",[0.68,0,0.92,0.32],"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear"]};
const timing29: Track["timing"] = {"times":[0,0.2656,0.3873,0.5484,0.5732,0.5981,0.6229,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",figmaSpring,"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear",[0.5,0,0.5,1],"linear"]};
const timing30: Track["timing"] = {"times":[0,0.2656,0.3873,0.5484,0.9806,0.9994,1],"ease":["linear","easeInOut",figmaSpring,"linear",[0.5,0,0.5,1],"linear"]};
const timing31: Track["timing"] = {"times":[0,0.2656,0.3873,0.5484,0.5732,0.5981,0.6229,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",[0.68,0,0.92,0.32],"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear"]};
const timing32: Track["timing"] = {"times":[0,0.2656,0.3795,0.5406,0.5674,0.5942,0.621,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",figmaSpring,"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear",[0.5,0,0.5,1],"linear"]};
const timing33: Track["timing"] = {"times":[0,0.2656,0.3795,0.5406,0.9806,0.9994,1],"ease":["linear","easeInOut",figmaSpring,"linear",[0.5,0,0.5,1],"linear"]};
const timing34: Track["timing"] = {"times":[0,0.2656,0.3795,0.5406,0.5674,0.5942,0.621,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",[0.68,0,0.92,0.32],"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear"]};
const timing35: Track["timing"] = {"times":[0,0.2656,0.3717,0.5328,0.5616,0.5903,0.619,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",figmaSpring,"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear",[0.5,0,0.5,1],"linear"]};
const timing36: Track["timing"] = {"times":[0,0.2656,0.3717,0.5328,0.9806,0.9994,1],"ease":["linear","easeInOut",figmaSpring,"linear",[0.5,0,0.5,1],"linear"]};
const timing37: Track["timing"] = {"times":[0,0.2656,0.3717,0.5328,0.5616,0.5903,0.619,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",[0.68,0,0.92,0.32],"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear"]};
const timing38: Track["timing"] = {"times":[0,0.2656,0.3639,0.5251,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",figmaSpring,"linear",[0.5,0,0.5,1],"linear"]};
const timing39: Track["timing"] = {"times":[0,0.2656,0.3639,0.5251,0.9806,0.9994,1],"ease":["linear","easeInOut",figmaSpring,"linear",[0.5,0,0.5,1],"linear"]};
const timing40: Track["timing"] = {"times":[0,0.2656,0.3639,0.5251,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",[0.68,0,0.92,0.32],"linear","linear","linear"]};
const timing41: Track["timing"] = {"times":[0,0.2656,0.3601,0.5212,0.5528,0.5845,0.6161,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",figmaSpring,"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear",[0.5,0,0.5,1],"linear"]};
const timing42: Track["timing"] = {"times":[0,0.2656,0.3601,0.5212,0.9806,0.9994,1],"ease":["linear","easeInOut",figmaSpring,"linear",[0.5,0,0.5,1],"linear"]};
const timing43: Track["timing"] = {"times":[0,0.2656,0.3601,0.5212,0.5528,0.5845,0.6161,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",[0.68,0,0.92,0.32],"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear"]};
const timing44: Track["timing"] = {"times":[0,0.2656,0.3678,0.5289,0.5587,0.5884,0.6181,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",figmaSpring,"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear",[0.5,0,0.5,1],"linear"]};
const timing45: Track["timing"] = {"times":[0,0.2656,0.3678,0.5289,0.9806,0.9994,1],"ease":["linear","easeInOut",figmaSpring,"linear",[0.5,0,0.5,1],"linear"]};
const timing46: Track["timing"] = {"times":[0,0.2656,0.3678,0.5289,0.5587,0.5884,0.6181,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",[0.68,0,0.92,0.32],"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear"]};
const timing47: Track["timing"] = {"times":[0,0.2656,0.3678,0.5289,0.5587,0.5884,0.6181,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",[0.68,0,0.92,0.32],"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear"]};
const timing48: Track["timing"] = {"times":[0,0.2656,0.3756,0.5367,0.5645,0.5923,0.62,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",figmaSpring,"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear",[0.5,0,0.5,1],"linear"]};
const timing49: Track["timing"] = {"times":[0,0.2656,0.3756,0.5367,0.9806,0.9994,1],"ease":["linear","easeInOut",figmaSpring,"linear",[0.5,0,0.5,1],"linear"]};
const timing50: Track["timing"] = {"times":[0,0.2656,0.3756,0.5367,0.5645,0.5923,0.62,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",[0.68,0,0.92,0.32],"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear"]};
const timing51: Track["timing"] = {"times":[0,0.2656,0.3834,0.5445,0.5703,0.5961,0.622,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",figmaSpring,"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear",[0.5,0,0.5,1],"linear"]};
const timing52: Track["timing"] = {"times":[0,0.2656,0.3834,0.5445,0.9806,0.9994,1],"ease":["linear","easeInOut",figmaSpring,"linear",[0.5,0,0.5,1],"linear"]};
const timing53: Track["timing"] = {"times":[0,0.2656,0.3834,0.5445,0.5703,0.5961,0.622,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",[0.68,0,0.92,0.32],"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear"]};
const timing54: Track["timing"] = {"times":[0,0.2656,0.3912,0.5523,0.5762,0.6,0.6239,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",figmaSpring,"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear",[0.5,0,0.5,1],"linear"]};
const timing55: Track["timing"] = {"times":[0,0.2656,0.3912,0.5523,0.9806,0.9994,1],"ease":["linear","easeInOut",figmaSpring,"linear",[0.5,0,0.5,1],"linear"]};
const timing56: Track["timing"] = {"times":[0,0.2656,0.3912,0.5523,0.5762,0.6,0.6239,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",[0.68,0,0.92,0.32],"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear"]};
const timing57: Track["timing"] = {"times":[0,0.2656,0.3951,0.5562,0.5791,0.602,0.6249,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",figmaSpring,"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear",[0.5,0,0.5,1],"linear"]};
const timing58: Track["timing"] = {"times":[0,0.2656,0.3951,0.5562,0.9806,0.9994,1],"ease":["linear","easeInOut",figmaSpring,"linear",[0.5,0,0.5,1],"linear"]};
const timing59: Track["timing"] = {"times":[0,0.2656,0.3951,0.5562,0.5791,0.602,0.6249,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",[0.68,0,0.92,0.32],"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear"]};
const timing60: Track["timing"] = {"times":[0,0.2656,0.4028,0.5639,0.5849,0.6059,0.6268,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",figmaSpring,"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear",[0.5,0,0.5,1],"linear"]};
const timing61: Track["timing"] = {"times":[0,0.2656,0.4028,0.5639,0.9806,0.9994,1],"ease":["linear","easeInOut",figmaSpring,"linear",[0.5,0,0.5,1],"linear"]};
const timing62: Track["timing"] = {"times":[0,0.2656,0.4028,0.5639,0.5849,0.6059,0.6268,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",[0.68,0,0.92,0.32],"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear"]};
const timing63: Track["timing"] = {"times":[0,0.2656,0.4106,0.5717,0.5907,0.6098,0.6288,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",figmaSpring,"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear",[0.5,0,0.5,1],"linear"]};
const timing64: Track["timing"] = {"times":[0,0.2656,0.4106,0.5717,0.9806,0.9994,1],"ease":["linear","easeInOut",figmaSpring,"linear",[0.5,0,0.5,1],"linear"]};
const timing65: Track["timing"] = {"times":[0,0.2656,0.4106,0.5717,0.5907,0.6098,0.6288,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",[0.68,0,0.92,0.32],"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear"]};
const timing66: Track["timing"] = {"times":[0,0.2656,0.4145,0.5756,0.5937,0.6117,0.6297,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",figmaSpring,"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear",[0.5,0,0.5,1],"linear"]};
const timing67: Track["timing"] = {"times":[0,0.2656,0.4145,0.5756,0.6034,1],"ease":["linear","easeInOut",figmaSpring,"linear","linear"]};
const timing68: Track["timing"] = {"times":[0,0.2656,0.4145,0.5756,0.5937,0.6117,0.6297,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",[0.68,0,0.92,0.32],"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear"]};
const timing69: Track["timing"] = {"times":[0,0.2656,0.4229,0.5834,0.5995,0.6156,0.6317,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",figmaSpring,"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear",[0.5,0,0.5,1],"linear"]};
const timing70: Track["timing"] = {"times":[0,0.2656,0.4229,0.5834,0.9806,0.9994,1],"ease":["linear","easeInOut",figmaSpring,"linear",[0.5,0,0.5,1],"linear"]};
const timing71: Track["timing"] = {"times":[0,0.2656,0.4229,0.5834,0.5995,0.6156,0.6317,0.6478,0.6651,0.6825,0.6999,0.7172,0.7346,0.7519,0.7693,0.7867,0.804,0.8214,0.8388,0.8561,0.9806,0.9994,1],"ease":[[0.5,0,0.5,1],"easeInOut",[0.68,0,0.92,0.32],"linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear","linear"]};

export const textTracks: Tracks[] = [
{
  opacity: { values: [0,1,1,0,0], timing: timing0 },
},
{
  opacity: { values: [0,0,1,1,0,0], timing: timing1 },
},
{
  opacity: { values: [0,0,1,1,0], timing: timing2 },
}
];
export const progressTracks: Tracks = {
  opacity: { values: [1,1,0,0], timing: timing3 },
  width: { values: [4,76,76,151,151,232,232,151,4,4], timing: timing4 },
};
export const fanTracks: Tracks = {
  opacity: { values: [1,1,0,0,1], timing: timing5 },
  scaleX: { values: [1,1,2.98,1,1], timing: timing6 },
  scaleY: { values: [1,1,2.98,1,1], timing: timing6 },
};
export const loadingCards: { id: string; left: number; top: number; tracks: Tracks }[] = [
  { id: "2237:856", left: 1301.8795, top: -34.9855, tracks: {
  opacity: { values: [1,1,0,0], timing: timing7 },
  rotate: { values: [31.954,91.954,88.954,91.954,94.041,96.946,100.798,105.726,112.139,119.843,128.063,136.026,143.988,152.209,159.913,166.325,171.253,175.105,178.011,180.098,180.098,31.954,31.954], timing: timing8 },
  scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing9 },
  scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing9 },
  x: { values: [-691.841,0,45.393,0,-0.867,-1.318,-7.078,-23.873,-53.294,-92.267,-139.515,-193.761,-260.827,-339.341,-417.231,-482.427,-533.178,-575.433,-608.667,-632.356,-632.356,-691.841,-691.841], timing: timing10 },
  y: { values: [179.539,0,-15.604,0,23.674,56.92,98.973,149.069,213.095,289.428,366.04,430.902,482.396,526.408,562.163,588.889,603.58,607.581,606.646,606.525,606.525,179.539,179.539], timing: timing10 },
} },
  { id: "2237:903", left: 1290.8275, top: 61.14, tracks: {
  opacity: { values: [1,1,0,0], timing: timing7 },
  rotate: { values: [41.175,101.175,98.175,101.175,103.044,105.646,109.095,113.507,119.249,126.147,133.507,140.637,147.766,155.126,162.024,167.766,172.179,175.628,178.229,180.098,180.098,41.175,41.175], timing: timing11 },
  scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing12 },
  scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing12 },
  x: { values: [-680.787,0,47.062,0,-3.985,-8.95,-19.497,-40.23,-73.081,-115.361,-164.735,-218.87,-282.547,-355.211,-426.516,-486.119,-532.369,-570.414,-600.107,-621.302,-621.302,-680.787,-680.787], timing: timing13 },
  y: { values: [83.41,0,-9.444,0,20.822,50.115,86.817,129.867,184.13,248.457,312.762,366.962,409.541,445.486,474.466,496.153,508.13,511.349,510.531,510.396,510.396,83.41,83.41], timing: timing13 },
} },
  { id: "2237:950", left: 1265.1435, top: 154.4285, tracks: {
  opacity: { values: [1,1,0,0], timing: timing7 },
  rotate: { values: [49.353,109.353,106.353,109.353,111.028,113.36,116.451,120.407,125.554,131.737,138.335,144.725,151.116,157.714,163.897,169.044,172.999,176.091,178.423,180.098,180.098,49.353,49.353], timing: timing14 },
  scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing15 },
  scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing15 },
  x: { values: [-655.105,0,47.907,0,-6.285,-14.604,-28.55,-51.711,-86.205,-129.731,-179.252,-231.729,-291.033,-357.224,-421.551,-475.262,-516.833,-550.661,-576.88,-595.619,-595.619,-655.105,-655.105], timing: timing16 },
  y: { values: [-9.883,0,-2.982,0,17.661,42.542,73.475,109.292,153.904,206.526,258.948,302.963,337.225,365.829,388.732,405.888,415.404,417.929,417.238,417.104,417.104,-9.883,-9.883], timing: timing16 },
} },
  { id: "2237:997", left: 1225.391, top: 242.663, tracks: {
  opacity: { values: [1,1,0,0], timing: timing7 },
  rotate: { values: [58.285,118.285,115.285,118.285,119.749,121.786,124.487,127.943,132.44,137.843,143.608,149.191,154.775,160.54,165.943,170.44,173.896,176.597,178.634,180.098,180.098,58.285,58.285], timing: timing17 },
  scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing18 },
  scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing18 },
  x: { values: [-615.354,0,47.84,0,-7.752,-18.244,-34.185,-58.288,-92.709,-135.524,-183.321,-232.689,-286.704,-345.858,-402.857,-450.408,-487.138,-516.746,-539.55,-555.868,-555.868,-615.354,-615.354], timing: timing19 },
  y: { values: [-98.115,0,3.916,0,14.363,34.622,59.65,88.322,123.672,165.189,206.427,240.938,267.591,289.627,307.162,320.31,327.629,329.551,328.992,328.871,328.871,-98.115,-98.115], timing: timing19 },
} },
  { id: "2237:1044", left: 1172.6175, top: 323.7755, tracks: {
  opacity: { values: [1,1,0,0], timing: timing7 },
  rotate: { values: [67.089,127.089,124.089,127.089,128.344,130.091,132.408,135.372,139.228,143.861,148.805,153.593,158.382,163.326,167.959,171.815,174.779,177.095,178.843,180.098,180.098,67.089,67.089], timing: timing20 },
  scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing21 },
  scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing21 },
  x: { values: [-562.578,0,46.706,0,-8.41,-19.922,-36.507,-60.14,-92.896,-133.207,-177.577,-222.515,-270.42,-322.045,-371.424,-412.591,-444.339,-469.721,-489.164,-503.093,-503.093,-562.578,-562.578], timing: timing22 },
  y: { values: [-179.223,0,11.072,0,11.103,26.779,46.046,67.922,94.665,125.958,156.962,182.836,202.685,218.957,231.834,241.497,246.894,248.296,247.865,247.763,247.763,-179.223,-179.223], timing: timing22 },
} },
  { id: "2237:1091", left: 1108.121, top: 395.9185, tracks: {
  opacity: { values: [1,1,0,0], timing: timing7 },
  rotate: { values: [75.837,135.837,132.837,135.837,136.885,138.344,140.278,142.753,145.973,149.841,153.969,157.967,161.966,166.093,169.962,173.182,175.657,177.591,179.05,180.098,180.098,75.837,75.837], timing: timing23 },
  scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing24 },
  scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing24 },
  x: { values: [-498.078,0,44.346,0,-8.313,-19.766,-35.74,-57.612,-87.271,-123.475,-162.905,-202.244,-243.318,-286.994,-328.509,-363.101,-389.746,-410.902,-427.03,-438.595,-438.595,-498.078,-498.078], timing: timing25 },
  y: { values: [-251.365,0,18.369,0,8.041,19.401,33.306,48.98,68.005,90.197,112.138,130.405,144.336,155.673,164.601,171.303,175.056,176.019,175.703,175.622,175.622,-251.365,-251.365], timing: timing25 },
} },
  { id: "2237:1138", left: 1033.3955, top: 457.402, tracks: {
  opacity: { values: [1,1,0,0], timing: timing7 },
  rotate: { values: [84.615,144.615,141.615,144.615,145.456,146.625,148.176,150.159,152.741,155.842,159.151,162.357,165.562,168.871,171.972,174.554,176.538,178.088,179.258,180.098,180.098,84.615,84.615], timing: timing26 },
  scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing27 },
  scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing27 },
  x: { values: [-423.36,0,40.586,0,-7.537,-17.967,-32.207,-51.176,-76.489,-107.2,-140.384,-173.116,-206.744,-242.117,-275.568,-303.43,-324.871,-341.797,-354.652,-363.875,-363.875,-423.36,-423.36], timing: timing28 },
  y: { values: [-312.85,0,25.627,0,5.319,12.839,22.013,32.293,44.699,59.134,73.378,85.213,94.193,101.452,107.143,111.416,113.811,114.414,114.198,114.136,114.136,-312.85,-312.85], timing: timing28 },
} },
  { id: "2237:1185", left: 950.1595, top: 506.7405, tracks: {
  opacity: { values: [1,1,0,0], timing: timing7 },
  rotate: { values: [93.503,153.503,150.503,153.503,154.133,155.01,156.172,157.659,159.594,161.918,164.398,166.801,169.203,171.683,174.008,175.943,177.429,178.592,179.468,180.098,180.098,93.503,93.503], timing: timing29 },
  scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing30 },
  scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing30 },
  x: { values: [-340.121,0,35.254,0,-6.186,-14.769,-26.325,-41.431,-61.359,-85.427,-111.286,-136.581,-162.255,-189.038,-214.266,-235.272,-251.426,-264.123,-273.735,-280.637,-280.637,-340.121,-340.121], timing: timing31 },
  y: { values: [-362.19,0,32.575,0,3.065,7.4,12.675,18.559,25.626,33.833,41.918,48.623,53.686,57.755,60.93,63.314,64.648,64.974,64.84,64.797,64.797,-362.19,-362.19], timing: timing31 },
} },
  { id: "2237:1232", left: 860.3345, top: 542.7175, tracks: {
  opacity: { values: [1,1,0,0], timing: timing7 },
  rotate: { values: [102.549,162.549,159.549,162.549,162.964,163.543,164.31,165.291,166.567,168.101,169.738,171.323,172.909,174.545,176.079,177.356,178.337,179.104,179.682,180.098,180.098,102.549,102.549], timing: timing32 },
  scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing33 },
  scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing33 },
  x: { values: [-250.29,0,28.23,0,-4.382,-10.473,-18.602,-29.097,-42.835,-59.377,-77.081,-94.301,-111.633,-129.609,-146.493,-160.549,-171.353,-179.818,-186.214,-190.807,-190.807,-250.29,-250.29], timing: timing34 },
  y: { values: [-398.167,0,38.821,0,1.382,3.337,5.71,8.348,11.505,15.165,18.766,21.746,23.985,25.773,27.161,28.202,28.781,28.914,28.845,28.819,28.819,-398.167,-398.167], timing: timing34 },
} },
  { id: "2237:1279", left: 766.033, top: 564.438, tracks: {
  opacity: { values: [1,1,0,0], timing: timing7 },
  rotate: { values: [111.746,171.746,168.746,171.746,171.944,172.219,172.584,173.051,173.659,174.389,175.168,175.922,176.677,177.455,178.185,178.793,179.26,179.625,179.9,180.098,180.098,111.746,111.746], timing: timing35 },
  scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing36 },
  scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing36 },
  x: { values: [-155.99,0,19.523,0,-2.268,-5.425,-9.616,-14.99,-21.994,-30.412,-39.401,-48.117,-56.846,-65.869,-74.329,-81.371,-86.783,-91.016,-94.21,-96.504,-96.504,-155.99,-155.99], timing: timing37 },
  y: { values: [-419.891,0,43.85,0,0.346,0.835,1.428,2.084,2.867,3.774,4.665,5.4,5.948,6.381,6.715,6.964,7.101,7.127,7.105,7.095,7.095,-419.891,-419.891], timing: timing37 },
} },
  { id: "2237:1326", left: 669.5195, top: 571.5335, tracks: {
  opacity: { values: [1,1,0,0], timing: timing7 },
  rotate: { values: [-239.902,-179.902,-182.902,-179.902,-179.902,-239.902,-239.902], timing: timing38 },
  scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing39 },
  scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing39 },
  x: { values: [-59.484,0,9.53,0,0,-59.484,-59.484], timing: timing40 },
  y: { values: [-426.986,0,47.044,0,0,-426.986,-426.986], timing: timing40 },
} },
  { id: "2237:1373", left: 573.0565, top: 563.983, tracks: {
  opacity: { values: [1,1,0,0], timing: timing7 },
  rotate: { values: [-231.578,-171.578,-168.578,-171.578,-171.775,-172.05,-172.413,-172.879,-173.484,-174.212,-174.988,-175.74,-176.492,-177.268,-177.996,-178.601,-179.067,-179.431,-179.705,-179.902,-179.902,-231.578,-231.578], timing: timing41 },
  scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing42 },
  scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing42 },
  x: { values: [36.983,0,-1.344,0,2.267,5.421,9.61,14.981,21.98,30.394,39.379,48.091,56.817,65.837,74.295,81.336,86.747,90.979,94.172,96.467,96.467,36.983,36.983], timing: timing43 },
  y: { values: [-419.435,0,47.981,0,0.356,0.86,1.473,2.155,2.971,3.918,4.852,5.628,6.217,6.693,7.067,7.349,7.511,7.558,7.551,7.552,7.552,-419.435,-419.435], timing: timing43 },
} },
  { id: "2237:1420", left: 478.9, top: 541.672, tracks: {
  opacity: { values: [1,1,0,0], timing: timing7 },
  rotate: { values: [-222.452,-162.452,-159.452,-162.452,-162.866,-163.441,-164.203,-165.179,-166.448,-167.974,-169.601,-171.177,-172.753,-174.381,-175.906,-177.176,-178.151,-178.914,-179.489,-179.902,-179.902,-222.452,-222.452], timing: timing44 },
  scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing45 },
  scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing45 },
  x: { values: [131.144,0,-12.466,0,4.374,10.454,18.569,29.049,42.768,59.289,76.971,94.173,111.491,129.456,146.33,160.378,171.178,179.642,186.037,190.63,190.63,131.144,131.144], timing: timing46 },
  y: { values: [-397.126,0,46.353,0,1.405,3.393,5.811,8.506,11.738,15.488,19.186,22.259,24.593,26.479,27.96,29.077,29.716,29.895,29.861,29.861,-397.126,-397.126], timing: timing47 },
} },
  { id: "2237:1467", left: 389.284, top: 505.162, tracks: {
  opacity: { values: [1,1,0,0], timing: timing7 },
  rotate: { values: [-213.489,-153.489,-150.489,-153.489,-154.114,-154.985,-156.139,-157.616,-159.537,-161.846,-164.309,-166.695,-169.081,-171.545,-173.853,-175.775,-177.252,-178.406,-179.277,-179.902,-179.902,-213.489,-213.489], timing: timing48 },
  scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing49 },
  scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing49 },
  x: { values: [220.751,0,-22.812,0,6.167,14.725,26.25,41.321,61.206,85.225,111.035,136.289,161.931,188.689,213.896,234.886,251.031,263.724,273.336,280.238,280.238,220.751,220.751], timing: timing50 },
  y: { values: [-360.615,0,42.233,0,3.099,7.482,12.821,18.789,25.968,34.309,42.539,49.386,54.593,58.813,62.13,64.633,66.058,66.455,66.376,66.372,66.372,-360.615,-360.615], timing: timing50 },
} },
  { id: "2237:1514", left: 306.3295, top: 455.351, tracks: {
  opacity: { values: [1,1,0,0], timing: timing7 },
  rotate: { values: [-204.664,-144.664,-141.664,-144.664,-145.498,-146.66,-148.2,-150.17,-152.733,-155.813,-159.1,-162.283,-165.466,-168.752,-171.832,-174.396,-176.366,-177.906,-179.068,-179.902,-179.902,-204.664,-204.664], timing: timing51 },
  scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing52 },
  scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing52 },
  x: { values: [303.71,0,-31.667,0,7.506,17.892,32.078,50.987,76.227,106.853,139.953,172.615,206.188,241.518,274.934,302.77,324.195,341.117,353.972,363.196,363.196,303.71,303.71], timing: timing53 },
  y: { values: [-310.802,0,36.072,0,5.361,12.939,22.192,32.578,45.126,59.733,74.163,86.182,95.352,102.811,108.691,113.122,115.638,116.337,116.194,116.184,116.184,-310.802,-310.802], timing: timing53 },
} },
  { id: "2237:1561", left: 231.9335, top: 393.482, tracks: {
  opacity: { values: [1,1,0,0], timing: timing7 },
  rotate: { values: [-195.911,-135.911,-132.911,-135.911,-136.953,-138.403,-140.326,-142.785,-145.985,-149.83,-153.933,-157.907,-161.88,-165.983,-169.828,-173.028,-175.488,-177.41,-178.86,-179.902,-179.902,-195.911,-195.911], timing: timing54 },
  scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing55 },
  scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing55 },
  x: { values: [378.111,0,-38.612,0,8.267,19.657,35.552,57.336,86.887,122.966,162.272,201.506,242.501,286.111,327.575,362.129,388.751,409.901,426.03,437.595,437.595,378.111,378.111], timing: timing56 },
  y: { values: [-248.929,0,28.516,0,8.086,19.51,33.503,49.298,68.487,90.88,113.038,131.524,145.684,157.264,166.422,173.318,177.219,178.3,178.074,178.058,178.058,-248.929,-248.929], timing: timing56 },
} },
  { id: "2237:1608", left: 167.794, top: 321.016, tracks: {
  opacity: { values: [1,1,0,0], timing: timing7 },
  rotate: { values: [-187.146,-127.146,-124.146,-127.146,-128.395,-130.134,-132.44,-135.389,-139.227,-143.838,-148.758,-153.524,-158.29,-163.21,-167.821,-171.659,-174.608,-176.914,-178.653,-179.902,-179.902,-187.146,-187.146], timing: timing57 },
  scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing58 },
  scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing58 },
  x: { values: [442.246,0,-43.536,0,8.35,19.776,36.256,59.77,92.379,132.519,176.72,221.515,269.311,320.846,370.153,411.266,442.984,468.358,487.803,501.731,501.731,442.246,442.246], timing: timing59 },
  y: { values: [-176.466,0,20.214,0,11.15,26.889,46.246,68.253,95.175,126.689,157.936,184.056,204.167,220.722,233.87,243.758,249.33,250.871,250.547,250.521,250.521,-176.466,-176.466], timing: timing59 },
} },
  { id: "2237:1655", left: 115.461, top: 239.623, tracks: {
  opacity: { values: [1,1,0,0], timing: timing7 },
  rotate: { values: [-178.285,-118.285,-115.285,-118.285,-119.744,-121.775,-124.468,-127.913,-132.396,-137.781,-143.528,-149.093,-154.659,-160.406,-165.791,-170.274,-173.719,-176.412,-178.443,-179.902,-179.902,-178.285,-178.285], timing: timing60 },
  scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing61 },
  scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing61 },
  x: { values: [494.574,0,-46.552,0,7.674,18.055,33.861,57.807,92.034,134.623,182.194,231.373,285.241,344.272,401.173,448.651,485.339,514.935,537.74,554.059,554.059,494.574,494.574], timing: timing62 },
  y: { values: [-95.076,0,11.702,0,14.406,34.722,59.838,88.64,124.178,165.93,207.429,242.209,269.157,291.517,309.363,322.771,330.292,332.376,331.942,331.91,331.91,-95.076,-95.076], timing: timing62 },
} },
  { id: "2237:1702", left: 76.2395, top: 151.156, tracks: {
  opacity: { values: [1,1,0,0], timing: timing7 },
  rotate: { values: [-169.273,-109.273,-106.273,-109.273,-110.946,-113.273,-116.36,-120.309,-125.447,-131.62,-138.207,-144.588,-150.968,-157.555,-163.728,-168.866,-172.815,-175.902,-178.229,-179.902,-179.902,-169.273,-169.273], timing: timing63 },
  scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing64 },
  scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing64 },
  x: { values: [533.796,0,-47.883,0,6.187,14.369,28.143,51.105,85.351,128.583,177.811,230.043,289.154,355.183,419.379,472.992,514.508,548.321,574.542,593.282,593.282,533.796,533.796], timing: timing65 },
  y: { values: [-6.604,0,3.356,0,17.694,42.62,73.628,109.572,154.372,207.231,259.925,304.229,338.817,367.787,391.046,408.499,418.244,420.958,420.412,420.382,420.382,-6.604,-6.604], timing: timing65 },
} },
  { id: "2237:1750", left: 51.106, top: 57.7205, tracks: {
  opacity: { values: [1,1,0,0], timing: timing7 },
  rotate: { values: [-161.026,-101.026,-98.026,-101.026,-102.894,-105.493,-108.94,-113.35,-119.089,-125.983,-133.339,-140.464,-147.589,-154.945,-161.839,-167.578,-171.987,-175.434,-178.034,-179.902,-179.902,-161.026,-161.026], timing: timing66 },
  scaleX: { values: [1,1,0.94,1.045,1,1], timing: timing67 },
  scaleY: { values: [1,1,0.94,1.045,1,1], timing: timing67 },
  x: { values: [558.936,0,-47.79,0,3.869,8.671,19.014,39.506,72.053,113.972,162.985,216.814,280.25,352.708,423.848,483.326,529.506,567.531,597.227,618.421,618.421,558.936,558.936], timing: timing68 },
  y: { values: [86.827,0,-4.49,0,20.842,50.16,86.916,130.077,184.518,249.074,313.648,368.144,411.074,447.422,476.798,498.816,511.05,514.482,513.83,513.813,513.813,86.827,86.827], timing: timing68 },
} },
  { id: "2237:1797", left: 40.6415, top: -35.661, tracks: {
  opacity: { values: [1,1,0,0], timing: timing7 },
  rotate: { values: [-152.688,-92.688,-89.688,-92.688,-94.753,-97.627,-101.439,-106.315,-112.66,-120.283,-128.417,-136.295,-144.173,-152.307,-159.93,-166.275,-171.151,-174.962,-177.837,-179.902,-179.902,-152.688,-152.688], timing: timing69 },
  scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing70 },
  scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing70 },
  x: { values: [569.397,0,-46.577,0,0.839,1.254,6.941,23.595,52.788,91.466,138.381,192.287,258.984,337.092,414.597,479.485,530.025,572.134,605.268,628.883,628.883,569.397,569.397], timing: timing71 },
  y: { values: [180.206,0,-11.6,0,23.602,56.744,98.681,148.669,212.573,288.769,365.279,430.124,481.721,525.921,561.899,588.831,603.719,607.931,607.182,607.192,607.192,180.206,180.206], timing: timing71 },
} },
];

