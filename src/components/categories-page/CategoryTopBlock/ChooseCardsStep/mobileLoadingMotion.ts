import type { Track, Tracks } from "./loadingMotion";

// Figma QCVIJzmqrUDEmNpnylq6bi / 1873:6157.
// Independent mobile timeline; preserve exported values, easing and card order.
export const MOBILE_CYCLE_MS = 3700;
export const MOBILE_REST_PROGRESS = 0.2584;
export const MOBILE_FAN_WIDTH = 729;
export const MOBILE_FAN_HEIGHT = 377.975;
export const MOBILE_CARD_WIDTH = 49.612;
export const MOBILE_CARD_HEIGHT = 88.594;
const figmaSpring = (t: number) => 1 - Math.exp(-t * 7.4426) * (Math.cos(t * 10.5254) + 0.7071 * Math.sin(t * 10.5254));
const timing0: Track["timing"] = { times: [0, 0.0426, 0.2703, 0.3108, 1], ease: [[0.5, 0, 0.5, 1], "linear", "easeInOut", "linear"] };
const timing1: Track["timing"] = { times: [0, 0.2703, 0.3108, 0.5676, 0.6081, 1], ease: ["linear", "easeInOut", "linear", "easeInOut", "linear"] };
const timing2: Track["timing"] = { times: [0, 0.5676, 0.6081, 0.9444, 0.973, 1], ease: ["linear", "easeInOut", "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing3: Track["timing"] = { times: [0, 0.843, 0.9444, 1], ease: ["linear", [0.5, 0, 0.5, 1], "linear"] };
const timing4: Track["timing"] = { times: [0, 0.0889, 0.2836, 0.2837, 0.3844, 0.5918, 0.6932, 0.9443, 0.9444, 0.9724, 1], ease: ["easeOut", "linear", "linear", "easeOut", "linear", "easeOut", "linear", "linear", "easeOut", "linear"] };
const timing5: Track["timing"] = { times: [0, 0.9351, 0.9444, 0.9502, 0.973, 1], ease: ["linear", [0.5, 0, 0.5, 1], "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing6: Track["timing"] = { times: [0, 0.8047, 0.9444, 0.9502, 1], ease: ["linear", [0.5, 0, 0.5, 1], [0.5, 0, 0.5, 1], "linear"] };
const timing7: Track["timing"] = { times: [0, 0.9351, 0.9444, 1], ease: ["linear", [0.5, 0, 0.5, 1], "linear"] };
const timing8: Track["timing"] = { times: [0, 0.2584, 0.4309, 0.5828, 0.5946, 0.6065, 0.6184, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", figmaSpring, "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing9: Track["timing"] = { times: [0, 0.2584, 0.4309, 0.5828, 0.9541, 0.9724, 1], ease: ["linear", "easeInOut", figmaSpring, "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing10: Track["timing"] = { times: [0, 0.2584, 0.4309, 0.5828, 0.5946, 0.6065, 0.6184, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear"] };
const timing11: Track["timing"] = { times: [0, 0.2584, 0.4228, 0.579, 0.5918, 0.6046, 0.6174, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", figmaSpring, "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing12: Track["timing"] = { times: [0, 0.2584, 0.4228, 0.579, 0.9541, 0.9724, 1], ease: ["linear", "easeInOut", figmaSpring, "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing13: Track["timing"] = { times: [0, 0.2584, 0.4228, 0.579, 0.5918, 0.6046, 0.6174, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear"] };
const timing14: Track["timing"] = { times: [0, 0.2584, 0.4191, 0.5752, 0.589, 0.6027, 0.6165, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", figmaSpring, "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing15: Track["timing"] = { times: [0, 0.2584, 0.4191, 0.5752, 0.9541, 0.9724, 1], ease: ["linear", "easeInOut", figmaSpring, "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing16: Track["timing"] = { times: [0, 0.2584, 0.4191, 0.5752, 0.589, 0.6027, 0.6165, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear"] };
const timing17: Track["timing"] = { times: [0, 0.2584, 0.4153, 0.5714, 0.5861, 0.6008, 0.6156, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", figmaSpring, "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing18: Track["timing"] = { times: [0, 0.2584, 0.4153, 0.5714, 0.9541, 0.9724, 1], ease: ["linear", "easeInOut", figmaSpring, "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing19: Track["timing"] = { times: [0, 0.2584, 0.4153, 0.5714, 0.5861, 0.6008, 0.6156, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear"] };
const timing20: Track["timing"] = { times: [0, 0.2584, 0.4071, 0.5638, 0.5804, 0.5971, 0.6137, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", figmaSpring, "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing21: Track["timing"] = { times: [0, 0.2584, 0.4071, 0.5638, 0.9541, 0.9724, 1], ease: ["linear", "easeInOut", figmaSpring, "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing22: Track["timing"] = { times: [0, 0.2584, 0.4071, 0.5638, 0.5804, 0.5971, 0.6137, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear"] };
const timing23: Track["timing"] = { times: [0, 0.2584, 0.3957, 0.5525, 0.5719, 0.5914, 0.6108, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", figmaSpring, "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing24: Track["timing"] = { times: [0, 0.2584, 0.3957, 0.5525, 0.9541, 0.9724, 1], ease: ["linear", "easeInOut", figmaSpring, "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing25: Track["timing"] = { times: [0, 0.2584, 0.3957, 0.5525, 0.5719, 0.5914, 0.6108, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear"] };
const timing26: Track["timing"] = { times: [0, 0.2584, 0.3882, 0.5449, 0.5663, 0.5876, 0.6089, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", figmaSpring, "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing27: Track["timing"] = { times: [0, 0.2584, 0.3882, 0.5449, 0.9541, 0.9724, 1], ease: ["linear", "easeInOut", figmaSpring, "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing28: Track["timing"] = { times: [0, 0.2584, 0.3882, 0.5449, 0.5663, 0.5876, 0.6089, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear"] };
const timing29: Track["timing"] = { times: [0, 0.2584, 0.3768, 0.5336, 0.5577, 0.5819, 0.6061, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", figmaSpring, "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing30: Track["timing"] = { times: [0, 0.2584, 0.3768, 0.5336, 0.9541, 0.9724, 1], ease: ["linear", "easeInOut", figmaSpring, "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing31: Track["timing"] = { times: [0, 0.2584, 0.3768, 0.5336, 0.5577, 0.5819, 0.6061, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear"] };
const timing32: Track["timing"] = { times: [0, 0.2584, 0.3692, 0.526, 0.5521, 0.5781, 0.6042, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", figmaSpring, "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing33: Track["timing"] = { times: [0, 0.2584, 0.3692, 0.526, 0.9541, 0.9724, 1], ease: ["linear", "easeInOut", figmaSpring, "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing34: Track["timing"] = { times: [0, 0.2584, 0.3692, 0.526, 0.5521, 0.5781, 0.6042, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear"] };
const timing35: Track["timing"] = { times: [0, 0.2584, 0.3617, 0.5184, 0.5464, 0.5744, 0.6023, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", figmaSpring, "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing36: Track["timing"] = { times: [0, 0.2584, 0.3617, 0.5184, 0.9541, 0.9724, 1], ease: ["linear", "easeInOut", figmaSpring, "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing37: Track["timing"] = { times: [0, 0.2584, 0.3617, 0.5184, 0.5464, 0.5744, 0.6023, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear"] };
const timing38: Track["timing"] = { times: [0, 0.2584, 0.3541, 0.5109, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", figmaSpring, "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing39: Track["timing"] = { times: [0, 0.2584, 0.3541, 0.5109, 0.9541, 0.9724, 1], ease: ["linear", "easeInOut", figmaSpring, "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing40: Track["timing"] = { times: [0, 0.2584, 0.3541, 0.5109, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear"] };
const timing41: Track["timing"] = { times: [0, 0.2584, 0.3503, 0.5071, 0.5379, 0.5687, 0.5995, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", figmaSpring, "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing42: Track["timing"] = { times: [0, 0.2584, 0.3503, 0.5071, 0.9541, 0.9724, 1], ease: ["linear", "easeInOut", figmaSpring, "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing43: Track["timing"] = { times: [0, 0.2584, 0.3503, 0.5071, 0.5379, 0.5687, 0.5995, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear"] };
const timing44: Track["timing"] = { times: [0, 0.2584, 0.3503, 0.5071, 0.5379, 0.5687, 0.5995, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear"] };
const timing45: Track["timing"] = { times: [0, 0.2584, 0.3579, 0.5147, 0.5436, 0.5725, 0.6014, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", figmaSpring, "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing46: Track["timing"] = { times: [0, 0.2584, 0.3579, 0.5147, 0.9541, 0.9724, 1], ease: ["linear", "easeInOut", figmaSpring, "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing47: Track["timing"] = { times: [0, 0.2584, 0.3579, 0.5147, 0.5436, 0.5725, 0.6014, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear"] };
const timing48: Track["timing"] = { times: [0, 0.2584, 0.3579, 0.5147, 0.5436, 0.5725, 0.6014, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear"] };
const timing49: Track["timing"] = { times: [0, 0.2584, 0.3655, 0.5222, 0.5492, 0.5762, 0.6033, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", figmaSpring, "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing50: Track["timing"] = { times: [0, 0.2584, 0.3655, 0.5222, 0.9541, 0.9724, 1], ease: ["linear", "easeInOut", figmaSpring, "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing51: Track["timing"] = { times: [0, 0.2584, 0.3655, 0.5222, 0.5492, 0.5762, 0.6033, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear"] };
const timing52: Track["timing"] = { times: [0, 0.2584, 0.373, 0.5298, 0.5549, 0.58, 0.6051, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", figmaSpring, "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing53: Track["timing"] = { times: [0, 0.2584, 0.373, 0.5298, 0.9541, 0.9724, 1], ease: ["linear", "easeInOut", figmaSpring, "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing54: Track["timing"] = { times: [0, 0.2584, 0.373, 0.5298, 0.5549, 0.58, 0.6051, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear"] };
const timing55: Track["timing"] = { times: [0, 0.2584, 0.3806, 0.5374, 0.5606, 0.5838, 0.607, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", figmaSpring, "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing56: Track["timing"] = { times: [0, 0.2584, 0.3806, 0.5374, 0.9541, 0.9724, 1], ease: ["linear", "easeInOut", figmaSpring, "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing57: Track["timing"] = { times: [0, 0.2584, 0.3806, 0.5374, 0.5606, 0.5838, 0.607, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear"] };
const timing58: Track["timing"] = { times: [0, 0.2584, 0.3844, 0.5411, 0.5634, 0.5857, 0.608, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", figmaSpring, "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing59: Track["timing"] = { times: [0, 0.2584, 0.3844, 0.5411, 0.9541, 0.9724, 1], ease: ["linear", "easeInOut", figmaSpring, "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing60: Track["timing"] = { times: [0, 0.2584, 0.3844, 0.5411, 0.5634, 0.5857, 0.608, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear"] };
const timing61: Track["timing"] = { times: [0, 0.2584, 0.392, 0.5487, 0.5691, 0.5895, 0.6099, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", figmaSpring, "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing62: Track["timing"] = { times: [0, 0.2584, 0.392, 0.5487, 0.9541, 0.9724, 1], ease: ["linear", "easeInOut", figmaSpring, "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing63: Track["timing"] = { times: [0, 0.2584, 0.392, 0.5487, 0.5691, 0.5895, 0.6099, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear"] };
const timing64: Track["timing"] = { times: [0, 0.2584, 0.3995, 0.5563, 0.5748, 0.5933, 0.6118, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", figmaSpring, "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing65: Track["timing"] = { times: [0, 0.2584, 0.3995, 0.5563, 0.9541, 0.9724, 1], ease: ["linear", "easeInOut", figmaSpring, "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing66: Track["timing"] = { times: [0, 0.2584, 0.3995, 0.5563, 0.5748, 0.5933, 0.6118, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear"] };
const timing67: Track["timing"] = { times: [0, 0.2584, 0.4033, 0.5601, 0.5776, 0.5952, 0.6127, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", figmaSpring, "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing68: Track["timing"] = { times: [0, 0.2584, 0.4033, 0.5601, 0.5871, 1], ease: ["linear", "easeInOut", figmaSpring, "linear", "linear"] };
const timing69: Track["timing"] = { times: [0, 0.2584, 0.4033, 0.5601, 0.5776, 0.5952, 0.6127, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear"] };
const timing70: Track["timing"] = { times: [0, 0.2584, 0.4115, 0.5676, 0.5833, 0.5989, 0.6146, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", figmaSpring, "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing71: Track["timing"] = { times: [0, 0.2584, 0.4115, 0.5676, 0.9541, 0.9724, 1], ease: ["linear", "easeInOut", figmaSpring, "linear", [0.5, 0, 0.5, 1], "linear"] };
const timing72: Track["timing"] = { times: [0, 0.2584, 0.4115, 0.5676, 0.5833, 0.5989, 0.6146, 0.6303, 0.6472, 0.6641, 0.6809, 0.6978, 0.7147, 0.7316, 0.7485, 0.7654, 0.7823, 0.7992, 0.8161, 0.833, 0.9541, 0.9724, 1], ease: [[0.5, 0, 0.5, 1], "easeInOut", [0.68, 0, 0.92, 0.32], "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear", "linear"] };

export const mobileTextTracks: Tracks[] = [
  {
    opacity: { values: [0,1,1,0,0], timing: timing0 },
  },
  {
    opacity: { values: [0,0,1,1,0,0], timing: timing1 },
  },
  {
    opacity: { values: [0,0,1,1,0,0], timing: timing2 },
  },
];
export const mobileProgressTracks: Tracks = {
    opacity: { values: [1,1,0,0], timing: timing3 },
    width: { values: [0,66,66,65,132,132,193.667,193.667,193.67,4,4], timing: timing4 },
  };
export const mobileFanTracks: Tracks = {
    opacity: { values: [1,1,0,0,1,1], timing: timing5 },
    scaleX: { values: [1,1,2.98,1,1], timing: timing6 },
    scaleY: { values: [1,1,2.98,1,1], timing: timing6 },
  };
export const mobileLoadingCards: { id: string; cardId: string; left: number; top: number; tracks: Tracks }[] = [
  { id: "2311:3813", cardId: "1", left: 659.0805, top: -17.715, tracks: {
    opacity: { values: [1,1,0,0], timing: timing7 },
    rotate: { values: [31.954,91.954,88.954,91.954,94.041,96.946,100.798,105.726,112.139,119.843,128.063,136.026,143.988,152.209,159.913,166.325,171.253,175.105,178.011,180.098,180.098,31.954,31.954], timing: timing8 },
    scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing9 },
    scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing9 },
    x: { values: [-334.017,0,22.98,0,-0.439,-0.667,-3.583,-12.086,-26.98,-46.71,-70.629,-98.091,-132.044,-171.792,-211.223,-244.229,-269.921,-291.313,-308.138,-320.13,-320.13,-350.244,-350.244], timing: timing10 },
    y: { values: [9.158,0,-7.9,0,11.985,28.816,50.105,75.466,107.879,146.523,185.308,218.144,244.213,266.494,284.595,298.125,305.562,307.588,307.114,307.053,307.053,90.892,90.892], timing: timing10 },
  } },
  { id: "2311:3872", cardId: "22", left: 653.4785, top: 30.9545, tracks: {
    opacity: { values: [1,1,0,0], timing: timing7 },
    rotate: { values: [41.175,101.175,98.175,101.175,103.044,105.646,109.095,113.507,119.249,126.147,133.507,140.637,147.766,155.126,162.024,167.766,172.179,175.628,178.229,180.098,180.098,41.175,41.175], timing: timing11 },
    scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing12 },
    scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing12 },
    x: { values: [-328.421,0,23.825,0,-2.017,-4.531,-9.871,-20.366,-36.997,-58.401,-83.397,-110.803,-143.039,-179.825,-215.924,-246.098,-269.512,-288.772,-303.804,-314.534,-314.534,-344.648,-344.648], timing: timing13 },
    y: { values: [-39.507,0,-4.781,0,10.541,25.371,43.951,65.745,93.216,125.781,158.336,185.774,207.33,225.527,240.199,251.178,257.241,258.871,258.456,258.388,258.388,42.226,42.226], timing: timing13 },
  } },
  { id: "2311:3931", cardId: "21", left: 640.478, top: 78.1775, tracks: {
    opacity: { values: [1,1,0,0], timing: timing7 },
    rotate: { values: [49.353,109.353,106.353,109.353,111.028,113.36,116.451,120.407,125.554,131.737,138.335,144.725,151.116,157.714,163.897,169.044,172.999,176.091,178.423,180.098,180.098,49.353,49.353], timing: timing14 },
    scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing15 },
    scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing15 },
    x: { values: [-315.42,0,24.253,0,-3.182,-7.393,-14.453,-26.179,-43.641,-65.676,-90.746,-117.313,-147.336,-180.845,-213.41,-240.601,-261.647,-278.772,-292.045,-301.532,-301.532,-331.647,-331.647], timing: timing16 },
    y: { values: [-86.736,0,-1.51,0,8.941,21.537,37.196,55.329,77.914,104.554,131.093,153.375,170.72,185.201,196.796,205.481,210.298,211.577,211.227,211.159,211.159,-5.003,-5.003], timing: timing16 },
  } },
  { id: "2311:3990", cardId: "20", left: 620.356, top: 122.8485, tracks: {
    opacity: { values: [1,1,0,0], timing: timing7 },
    rotate: { values: [58.285,118.285,115.285,118.285,119.749,121.786,124.487,127.943,132.44,137.843,143.608,149.191,154.775,160.54,165.943,170.44,173.896,176.597,178.634,180.098,180.098,58.285,58.285], timing: timing17 },
    scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing18 },
    scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing18 },
    x: { values: [-295.296,0,24.219,0,-3.925,-9.236,-17.306,-29.508,-46.934,-68.609,-92.806,-117.799,-145.144,-175.09,-203.946,-228.019,-246.614,-261.603,-273.147,-281.408,-281.408,-311.523,-311.523], timing: timing19 },
    y: { values: [-131.404,0,1.983,0,7.271,17.528,30.198,44.713,62.609,83.627,104.504,121.975,135.468,146.624,155.501,162.157,165.862,166.835,166.552,166.491,166.491,-49.671,-49.671], timing: timing19 },
  } },
  { id: "2311:4049", cardId: "19", left: 593.6385, top: 163.905, tracks: {
    opacity: { values: [1,1,0,0], timing: timing7 },
    rotate: { values: [67.089,127.089,124.089,127.089,128.344,130.091,132.408,135.372,139.228,143.861,148.805,153.593,158.382,163.326,167.959,171.815,174.779,177.095,178.843,180.098,180.098,67.089,67.089], timing: timing20 },
    scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing21 },
    scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing21 },
    x: { values: [-268.578,0,23.645,0,-4.258,-10.085,-18.482,-30.446,-47.029,-67.436,-89.898,-112.648,-136.9,-163.035,-188.033,-208.874,-224.946,-237.797,-247.639,-254.691,-254.691,-284.805,-284.805], timing: timing22 },
    y: { values: [-172.465,0,5.605,0,5.621,13.557,23.311,34.386,47.924,63.766,79.462,92.561,102.609,110.847,117.366,122.258,124.99,125.7,125.482,125.43,125.43,-90.732,-90.732], timing: timing22 },
  } },
  { id: "2311:4108", cardId: "18", left: 560.98, top: 200.433, tracks: {
    opacity: { values: [1,1,0,0], timing: timing7 },
    rotate: { values: [75.837,135.837,132.837,135.837,136.885,138.344,140.278,142.753,145.973,149.841,153.969,157.967,161.966,166.093,169.962,173.182,175.657,177.591,179.05,180.098,180.098,75.837,75.837], timing: timing23 },
    scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing24 },
    scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing24 },
    x: { values: [-235.925,0,22.45,0,-4.208,-10.007,-18.093,-29.166,-44.181,-62.509,-82.471,-102.386,-123.18,-145.291,-166.308,-183.82,-197.309,-208.019,-216.184,-222.039,-222.039,-252.152,-252.152], timing: timing25 },
    y: { values: [-208.987,0,9.299,0,4.071,9.822,16.861,24.796,34.427,45.662,56.77,66.017,73.07,78.81,83.329,86.722,88.622,89.11,88.95,88.909,88.909,-127.253,-127.253], timing: timing25 },
  } },
  { id: "2311:4167", cardId: "17", left: 523.158, top: 231.5525, tracks: {
    opacity: { values: [1,1,0,0], timing: timing7 },
    rotate: { values: [84.615,144.615,141.615,144.615,145.456,146.625,148.176,150.159,152.741,155.842,159.151,162.357,165.562,168.871,171.972,174.554,176.538,178.088,179.258,180.098,180.098,84.615,84.615], timing: timing26 },
    scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing27 },
    scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing27 },
    x: { values: [-198.099,0,20.547,0,-3.816,-9.096,-16.305,-25.908,-38.723,-54.27,-71.069,-87.64,-104.664,-122.572,-139.506,-153.612,-164.466,-173.035,-179.542,-184.212,-184.212,-214.326,-214.326], timing: timing28 },
    y: { values: [-240.114,0,12.974,0,2.693,6.5,11.144,16.348,22.629,29.936,37.148,43.139,47.685,51.36,54.241,56.405,57.617,57.922,57.813,57.781,57.781,-158.38,-158.38], timing: timing28 },
  } },
  { id: "2311:4226", cardId: "16", left: 481.017, top: 256.5345, tracks: {
    opacity: { values: [1,1,0,0], timing: timing7 },
    rotate: { values: [93.503,153.503,150.503,153.503,154.133,155.01,156.172,157.659,159.594,161.918,164.398,166.801,169.203,171.683,174.008,175.943,177.429,178.592,179.468,180.098,180.098,93.503,93.503], timing: timing29 },
    scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing30 },
    scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing30 },
    x: { values: [-155.959,0,17.847,0,-3.131,-7.477,-13.327,-20.975,-31.063,-43.248,-56.338,-69.144,-82.141,-95.701,-108.472,-119.107,-127.284,-133.712,-138.578,-142.072,-142.072,-172.186,-172.186], timing: timing31 },
    y: { values: [-265.092,0,16.491,0,1.552,3.746,6.417,9.395,12.973,17.128,21.221,24.615,27.179,29.238,30.846,32.053,32.728,32.893,32.825,32.803,32.803,-183.359,-183.359], timing: timing31 },
  } },
  { id: "2311:4285", cardId: "15", left: 435.5425, top: 274.7505, tracks: {
    opacity: { values: [1,1,0,0], timing: timing7 },
    rotate: { values: [102.549,162.549,159.549,162.549,162.964,163.543,164.31,165.291,166.567,168.101,169.738,171.323,172.909,174.545,176.079,177.356,178.337,179.104,179.682,180.098,180.098,102.549,102.549], timing: timing32 },
    scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing33 },
    scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing33 },
    x: { values: [-110.482,0,14.291,0,-2.218,-5.302,-9.417,-14.73,-21.685,-30.06,-39.022,-47.74,-56.514,-65.615,-74.162,-81.278,-86.748,-91.033,-94.271,-96.596,-96.596,-126.709,-126.709], timing: timing34 },
    y: { values: [-283.306,0,19.653,0,0.699,1.689,2.891,4.226,5.824,7.677,9.5,11.009,12.142,13.047,13.75,14.277,14.57,14.638,14.603,14.59,14.59,-201.572,-201.572], timing: timing34 },
  } },
  { id: "2311:4344", cardId: "14", left: 387.802, top: 285.742, tracks: {
    opacity: { values: [1,1,0,0], timing: timing7 },
    rotate: { values: [111.746,171.746,168.746,171.746,171.944,172.219,172.584,173.051,173.659,174.389,175.168,175.922,176.677,177.455,178.185,178.793,179.26,179.625,179.9,180.098,180.098,111.746,111.746], timing: timing35 },
    scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing36 },
    scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing36 },
    x: { values: [-62.743,0,9.884,0,-1.148,-2.746,-4.868,-7.589,-11.134,-15.396,-19.947,-24.359,-28.778,-33.346,-37.629,-41.194,-43.934,-46.077,-47.694,-48.855,-48.855,-78.97,-78.97], timing: timing37 },
    y: { values: [-294.303,0,22.199,0,0.175,0.423,0.723,1.055,1.452,1.911,2.362,2.734,3.011,3.23,3.4,3.526,3.595,3.608,3.597,3.592,3.592,-212.57,-212.57], timing: timing37 },
  } },
  { id: "2311:4403", cardId: "13", left: 338.946, top: 289.342, tracks: {
    opacity: { values: [1,1,0,0], timing: timing7 },
    rotate: { values: [-239.902,-179.902,-182.902,-179.902,-179.902,-239.902,-239.902], timing: timing38 },
    scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing39 },
    scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing39 },
    x: { values: [-13.887,0,4.825,0,0,-30.114,-30.114], timing: timing40 },
    y: { values: [-297.895,0,23.816,0,0,-216.162,-216.162], timing: timing40 },
  } },
  { id: "2311:4462", cardId: "12", left: 290.11, top: 285.5155, tracks: {
    opacity: { values: [1,1,0,0], timing: timing7 },
    rotate: { values: [-231.578,-171.578,-168.578,-171.578,-171.775,-172.05,-172.413,-172.879,-173.484,-174.212,-174.988,-175.74,-176.492,-177.268,-177.996,-178.601,-179.067,-179.431,-179.705,-179.902,-179.902,-231.578,-231.578], timing: timing41 },
    scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing42 },
    scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing42 },
    x: { values: [34.95,0,-0.68,0,1.148,2.744,4.865,7.584,11.128,15.387,19.936,24.346,28.764,33.33,37.612,41.176,43.916,46.058,47.675,48.836,48.836,18.723,18.723], timing: timing43 },
    y: { values: [-294.072,0,24.29,0,0.18,0.436,0.746,1.091,1.504,1.984,2.456,2.849,3.147,3.388,3.578,3.721,3.803,3.826,3.823,3.823,-212.339,-212.339], timing: timing44 },
  } },
  { id: "2311:4521", cardId: "10", left: 242.441, top: 274.218, tracks: {
    opacity: { values: [1,1,0,0], timing: timing7 },
    rotate: { values: [-222.452,-162.452,-159.452,-162.452,-162.866,-163.441,-164.203,-165.179,-166.448,-167.974,-169.601,-171.177,-172.753,-174.381,-175.906,-177.176,-178.151,-178.914,-179.489,-179.902,-179.902,-222.452,-222.452], timing: timing45 },
    scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing46 },
    scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing46 },
    x: { values: [82.619,0,-6.311,0,2.214,5.292,9.401,14.706,21.651,30.015,38.966,47.675,56.443,65.537,74.079,81.192,86.659,90.944,94.181,96.506,96.506,66.392,66.392], timing: timing47 },
    y: { values: [-282.778,0,23.466,0,0.712,1.718,2.942,4.306,5.942,7.841,9.713,11.269,12.45,13.405,14.155,14.72,15.044,15.134,15.117,15.117,-201.045,-201.045], timing: timing48 },
  } },
  { id: "2311:4580", cardId: "9", left: 197.074, top: 255.735, tracks: {
    opacity: { values: [1,1,0,0], timing: timing7 },
    rotate: { values: [-213.489,-153.489,-150.489,-153.489,-154.114,-154.985,-156.139,-157.616,-159.537,-161.846,-164.309,-166.695,-169.081,-171.545,-173.853,-175.775,-177.252,-178.406,-179.277,-179.902,-179.902,-213.489,-213.489], timing: timing49 },
    scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing50 },
    scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing50 },
    x: { values: [127.982,0,-11.549,0,3.122,7.454,13.289,20.919,30.985,43.145,56.211,68.996,81.978,95.524,108.285,118.911,127.084,133.51,138.377,141.87,141.87,111.755,111.755], timing: timing51 },
    y: { values: [-264.295,0,21.38,0,1.569,3.788,6.491,9.512,13.146,17.369,21.535,25.002,27.638,29.774,31.453,32.72,33.442,33.643,33.603,33.601,33.601,-182.561,-182.561], timing: timing51 },
  } },
  { id: "2311:4639", cardId: "8", left: 155.08, top: 230.517, tracks: {
    opacity: { values: [1,1,0,0], timing: timing7 },
    rotate: { values: [-204.664,-144.664,-141.664,-144.664,-145.498,-146.66,-148.2,-150.17,-152.733,-155.813,-159.1,-162.283,-165.466,-168.752,-171.832,-174.396,-176.366,-177.906,-179.068,-179.902,-179.902,-204.664,-204.664], timing: timing52 },
    scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing53 },
    scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing53 },
    x: { values: [169.98,0,-16.031,0,3.8,9.058,16.24,25.812,38.59,54.094,70.851,87.386,104.383,122.268,139.185,153.277,164.124,172.691,179.198,183.868,183.868,153.753,153.753], timing: timing54 },
    y: { values: [-239.077,0,18.262,0,2.714,6.55,11.235,16.493,22.845,30.24,37.545,43.63,48.272,52.048,55.025,57.268,58.542,58.896,58.823,58.818,58.818,-157.344,-157.344], timing: timing54 },
  } },
  { id: "2311:4698", cardId: "7", left: 117.4115, top: 199.2, tracks: {
    opacity: { values: [1,1,0,0], timing: timing7 },
    rotate: { values: [-195.911,-135.911,-132.911,-135.911,-136.953,-138.403,-140.326,-142.785,-145.985,-149.83,-153.933,-157.907,-161.88,-165.983,-169.828,-173.028,-175.488,-177.41,-178.86,-179.902,-179.902,-195.911,-195.911], timing: timing55 },
    scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing56 },
    scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing56 },
    x: { values: [207.646,0,-19.547,0,4.185,9.951,17.998,29.026,43.987,62.251,82.15,102.013,122.766,144.844,165.835,183.328,196.805,207.512,215.678,221.532,221.532,191.419,191.419], timing: timing57 },
    y: { values: [-207.754,0,14.436,0,4.094,9.877,16.961,24.957,34.671,46.008,57.226,66.584,73.752,79.615,84.251,87.742,89.717,90.264,90.15,90.142,90.142,-126.02,-126.02], timing: timing57 },
  } },
  { id: "2311:4757", cardId: "6", left: 84.9415, top: 162.515, tracks: {
    opacity: { values: [1,1,0,0], timing: timing7 },
    rotate: { values: [-187.146,-127.146,-124.146,-127.146,-128.395,-130.134,-132.44,-135.389,-139.227,-143.838,-148.758,-153.524,-158.29,-163.21,-167.821,-171.659,-174.608,-176.914,-178.653,-179.902,-179.902,-187.146,-187.146], timing: timing58 },
    scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing59 },
    scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing59 },
    x: { values: [240.114,0,-22.04,0,4.227,10.011,18.355,30.258,46.767,67.088,89.464,112.142,136.339,162.428,187.39,208.204,224.261,237.106,246.95,254.001,254.001,223.887,223.887], timing: timing60 },
    y: { values: [-171.069,0,10.233,0,5.645,13.612,23.412,34.553,48.182,64.136,79.955,93.179,103.36,111.741,118.397,123.403,126.223,127.003,126.839,126.826,126.826,-89.336,-89.336], timing: timing60 },
  } },
  { id: "2311:4816", cardId: "5", left: 58.456, top: 121.3085, tracks: {
    opacity: { values: [1,1,0,0], timing: timing7 },
    rotate: { values: [-178.285,-118.285,-115.285,-118.285,-119.744,-121.775,-124.468,-127.913,-132.396,-137.781,-143.528,-149.093,-154.659,-160.406,-165.791,-170.274,-173.719,-176.412,-178.443,-179.902,-179.902,-178.285,-178.285], timing: timing61 },
    scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing62 },
    scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing62 },
    x: { values: [266.605,0,-23.567,0,3.885,9.141,17.142,29.265,46.592,68.153,92.236,117.132,144.403,174.287,203.094,227.129,245.703,260.686,272.231,280.492,280.492,250.378,250.378], timing: timing63 },
    y: { values: [-129.866,0,5.924,0,7.293,17.578,30.293,44.874,62.865,84.002,105.011,122.618,136.261,147.58,156.615,163.403,167.21,168.265,168.046,168.03,168.03,-48.132,-48.132], timing: timing63 },
  } },
  { id: "2311:4875", cardId: "4", left: 38.596, top: 76.5205, tracks: {
    opacity: { values: [1,1,0,0], timing: timing7 },
    rotate: { values: [-169.273,-109.273,-106.273,-109.273,-110.946,-113.273,-116.36,-120.309,-125.447,-131.62,-138.207,-144.588,-150.968,-157.555,-163.728,-168.866,-172.815,-175.902,-178.229,-179.902,-179.902,-169.273,-169.273], timing: timing64 },
    scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing65 },
    scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing65 },
    x: { values: [286.461,0,-24.241,0,3.132,7.274,14.247,25.872,43.209,65.095,90.017,116.459,146.384,179.811,212.311,239.452,260.47,277.588,290.862,300.349,300.349,270.234,270.234], timing: timing66 },
    y: { values: [-85.077,0,1.699,0,8.958,21.576,37.274,55.471,78.151,104.911,131.587,154.016,171.526,186.192,197.967,206.803,211.736,213.11,212.834,212.819,212.819,-3.343,-3.343], timing: timing66 },
  } },
  { id: "2311:4934", cardId: "3", left: 25.8675, top: 29.2235, tracks: {
    opacity: { values: [1,1,0,0], timing: timing7 },
    rotate: { values: [-161.026,-101.026,-98.026,-101.026,-102.894,-105.493,-108.94,-113.35,-119.089,-125.983,-133.339,-140.464,-147.589,-154.945,-161.839,-167.578,-171.987,-175.434,-178.034,-179.902,-179.902,-161.026,-161.026], timing: timing67 },
    scaleX: { values: [1,1,0.94,1.045,1,1], timing: timing68 },
    scaleY: { values: [1,1,0.94,1.045,1,1], timing: timing68 },
    x: { values: [299.188,0,-24.193,0,1.959,4.39,9.626,20,36.477,57.698,82.511,109.762,141.876,178.559,214.573,244.684,268.063,287.312,302.346,313.076,313.076,282.961,282.961], timing: timing69 },
    y: { values: [-37.777,0,-2.273,0,10.551,25.393,44.001,65.852,93.412,126.094,158.784,186.373,208.106,226.507,241.379,252.526,258.719,260.456,260.126,260.118,260.118,43.956,43.956], timing: timing69 },
  } },
  { id: "2311:4993", cardId: "2", left: 20.5755, top: -18.051, tracks: {
    opacity: { values: [1,1,0,0], timing: timing7 },
    rotate: { values: [-152.688,-92.688,-89.688,-92.688,-94.753,-97.627,-101.439,-106.315,-112.66,-120.283,-128.417,-136.295,-144.173,-152.307,-159.93,-166.275,-171.151,-174.962,-177.837,-179.902,-179.902,-152.688,-152.688], timing: timing70 },
    scaleX: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing71 },
    scaleY: { values: [1,1,0.94,1.045,1.045,1,1], timing: timing71 },
    x: { values: [304.484,0,-23.58,0,0.425,0.635,3.514,11.945,26.724,46.305,70.055,97.345,131.111,170.653,209.89,242.739,268.325,289.643,306.417,318.372,318.372,288.257,288.257], timing: timing72 },
    y: { values: [9.496,0,-5.873,0,11.948,28.726,49.957,75.264,107.615,146.189,184.922,217.75,243.871,266.247,284.461,298.096,305.633,307.765,307.386,307.391,307.391,91.229,91.229], timing: timing72 },
  } },
];
