---
title: "The Chain Rule, but Actually Intuitive"
description: "Why 'differentiate the outside, multiply by the inside's derivative' actually works."
date: 2026-05-02
course: a-level
section: calculus
tags: [differentiation, chain-rule, calculus]
lang: en
---

## The rule (and why it looks confusing)

Most textbooks state the chain rule like this:

$$\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx}$$

That notation is elegant once you understand it, but completely opaque when you first see it. Let's build the intuition first.

---

## Intuition: peeling an onion

Think of a **composite function** as an onion. For example:

$$y = (3x^2 + 1)^5$$

The **outer layer** is $(\ldots)^5$ — the "raise to the power of 5" operation.  
The **inner layer** is $3x^2 + 1$ — what's actually inside.

The chain rule says:

> **Differentiate the outside** (leaving the inside untouched),  
> then **multiply by the derivative of the inside**.

$$\frac{dy}{dx} = 5(3x^2 + 1)^4 \cdot 6x = 30x(3x^2 + 1)^4$$

---

## Worked examples

### Example 1 — Power of a function

Differentiate $y = (2x^3 - 4)^7$.

Let $u = 2x^3 - 4$, so $y = u^7$.

$$\frac{dy}{du} = 7u^6, \qquad \frac{du}{dx} = 6x^2$$

$$\therefore \quad \frac{dy}{dx} = 7(2x^3-4)^6 \cdot 6x^2 = 42x^2(2x^3-4)^6$$

### Example 2 — Trig

Differentiate $y = \sin(x^2 + 1)$.

Outer: $\sin(\ldots)$ → derivative $\cos(\ldots)$  
Inner: $x^2 + 1$ → derivative $2x$

$$\frac{dy}{dx} = \cos(x^2 + 1) \cdot 2x = 2x\cos(x^2 + 1)$$

### Example 3 — Exponential

Differentiate $y = e^{3x}$.

Outer: $e^{(\ldots)}$ → derivative $e^{(\ldots)}$  
Inner: $3x$ → derivative $3$

$$\frac{dy}{dx} = e^{3x} \cdot 3 = 3e^{3x}$$

---

## A note on the Leibniz notation

The fraction-like notation $\frac{dy}{du} \cdot \frac{du}{dx}$ is helpful because it **looks like** the $du$'s cancel:

$$\frac{dy}{\cancel{du}} \cdot \frac{\cancel{du}}{dx} = \frac{dy}{dx}$$

This isn't literally true (derivatives are limits, not fractions), but as a **memory device** it's almost impossible to forget.

---

## Common mistakes

| Mistake | Correct |
|---|---|
| $\frac{d}{dx}[\sin(x^2)] = \cos(x^2)$ | $= 2x\cos(x^2)$ |
| $\frac{d}{dx}[e^{x^2}] = e^{x^2}$ | $= 2xe^{x^2}$ |
| $\frac{d}{dx}[(5x+3)^4] = 4(5x+3)^3$ | $= 20(5x+3)^3$ |

The mistake in every case: **forgetting to multiply by the inner derivative**.

---

## Practice

1. Differentiate $y = (x^2 - 3x)^4$
2. Differentiate $y = \cos(5x^2)$
3. Differentiate $y = e^{x^3 - 2}$
4. Differentiate $y = \ln(4x^2 + 1)$ *(recall: $\frac{d}{dx}[\ln u] = \frac{1}{u}\cdot\frac{du}{dx}$)*
