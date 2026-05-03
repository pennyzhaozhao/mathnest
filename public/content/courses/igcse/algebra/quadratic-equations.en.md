---
title: "Three Ways to Solve a Quadratic"
description: "Factoring, completing the square, and the quadratic formula — when to use which."
date: 2026-05-01
course: igcse
section: algebra
tags: [quadratics, algebra, factoring]
youtube: ""
lang: en
---

## What is a quadratic?

A **quadratic equation** has the form

$$ax^2 + bx + c = 0 \quad (a \neq 0)$$

There are three standard methods to solve it. Knowing which to reach for is half the battle.

---

## Method 1 — Factoring

Works cleanly when the roots are integers or simple fractions.

**Example:** Solve $x^2 - 5x + 6 = 0$

Find two numbers that **multiply to 6** and **add to −5**: they are −2 and −3.

$$x^2 - 5x + 6 = (x - 2)(x - 3) = 0$$

$$\therefore \quad x = 2 \quad \text{or} \quad x = 3$$

> **Tip:** Always check by substitution. $2^2 - 5(2) + 6 = 4 - 10 + 6 = 0$ ✓

---

## Method 2 — Completing the Square

Useful when factoring doesn't work neatly, and essential for **deriving the quadratic formula**.

**Example:** Solve $x^2 - 6x + 7 = 0$

**Step 1:** Move the constant to the right.
$$x^2 - 6x = -7$$

**Step 2:** Add $\left(\frac{b}{2}\right)^2 = \left(\frac{-6}{2}\right)^2 = 9$ to both sides.
$$x^2 - 6x + 9 = 2$$

**Step 3:** Write the left side as a perfect square.
$$(x - 3)^2 = 2$$

**Step 4:** Square root both sides.
$$x - 3 = \pm\sqrt{2} \implies x = 3 \pm \sqrt{2}$$

---

## Method 3 — The Quadratic Formula

Always works. Use it when the equation looks messy or the others fail.

$$\boxed{x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}}$$

**Example:** Solve $2x^2 + 3x - 2 = 0$

Here $a=2,\, b=3,\, c=-2$.

$$x = \frac{-3 \pm \sqrt{9 + 16}}{4} = \frac{-3 \pm 5}{4}$$

$$x = \frac{2}{4} = \frac{1}{2} \quad \text{or} \quad x = \frac{-8}{4} = -2$$

---

## The Discriminant — $b^2 - 4ac$

The expression under the square root tells you the **nature of the roots** before you solve:

| Value of $b^2-4ac$ | Roots |
|---|---|
| $> 0$ | Two distinct real roots |
| $= 0$ | One repeated real root |
| $< 0$ | No real roots (complex) |

---

## Which method to choose?

1. **Look for whole-number factors first** — if you spot them in ~5 seconds, factor.
2. **Coefficient of $x^2$ is 1 and factoring fails?** → Complete the square (or formula).
3. **Anything else, or in an exam under time pressure?** → Quadratic formula, always safe.

---

## Practice problems

Try these without looking at the solutions:

1. $x^2 + 7x + 12 = 0$
2. $x^2 - 4x - 1 = 0$ *(hint: completing the square)*
3. $3x^2 - x - 2 = 0$
