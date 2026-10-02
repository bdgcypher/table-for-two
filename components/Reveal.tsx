"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Scroll/load reveal: every content block fades up and slides in from below,
 * once, when it enters the viewport.
 *
 * These render the *same* element they replace (div, section, header) rather
 * than wrapping one. That matters: the pages lay their blocks out with grid
 * `col-span-*` and `space-y-*`, and an extra wrapper div would become the grid
 * or flex item, silently dropping those classes onto the wrong node.
 */
const revealVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const MotionDiv = motion.create("div");
const MotionSection = motion.create("section");
const MotionHeader = motion.create("header");

type RevealConfig = {
  /**
   * Seconds to hold before revealing. Pass an increasing value down a page to
   * stagger the blocks so they settle in sequence rather than all at once.
   */
  delay?: number;
};

function revealProps(delay: number) {
  return {
    initial: "hidden",
    whileInView: "visible",
    // `once` so a block that has already played never re-animates on the way
    // back up; `amount` so a tall block reveals as soon as a sliver is visible
    // instead of waiting for the whole thing to fit on screen.
    viewport: { once: true, amount: 0.2 },
    variants: revealVariants,
    transition: { duration: 0.5, ease: "easeOut" as const, delay },
  };
}

export function RevealDiv({
  delay = 0,
  ...rest
}: RevealConfig & React.ComponentPropsWithoutRef<typeof MotionDiv>) {
  return <MotionDiv {...rest} {...revealProps(delay)} />;
}

export function RevealSection({
  delay = 0,
  ...rest
}: RevealConfig & React.ComponentPropsWithoutRef<typeof MotionSection>) {
  return <MotionSection {...rest} {...revealProps(delay)} />;
}

export function RevealHeader({
  delay = 0,
  ...rest
}: RevealConfig & React.ComponentPropsWithoutRef<typeof MotionHeader>) {
  return <MotionHeader {...rest} {...revealProps(delay)} />;
}
