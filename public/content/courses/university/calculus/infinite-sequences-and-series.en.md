---
title: "infinite sequences and series"
description: "Power series represent functions as infinite polynomials, with convergence determining where the representation is valid."
date: 2026-05-06
course: university
section: calculus
tags: [calculus, taylor series, maclaurin series]
lang: en
---

# Infinite Sequences and Series

## Objective

1. Radius and Interval of Convergence  
2. Representations  
3. Differentiation and Integration of Power Series  
4. Taylor Series and Maclaurin Series  

---

# 1. Power Series

The basic form of a power series is:

$$
\sum_{n=0}^{\infty} c_n(x-a)^n
$$

where:

- $c_n$ are the coefficients;
- $x$ is the variable;
- $a$ is the center of expansion;
- $(x-a)^n$ represents powers centered at $a$.

If $a=0$, the power series becomes:

$$
\sum_{n=0}^{\infty} c_nx^n
$$

This is called a power series centered at $0$.

An ordinary polynomial has finitely many terms, for example:

$$
1+x+x^2+x^3
$$

whereas a power series has infinitely many terms:

$$
1+x+x^2+x^3+\cdots
$$

---

Many complicated functions can be written in the form of a power series.

For example:

$$
\frac{1}{1-x}=1+x+x^2+x^3+\cdots
$$

That is:

$$
\frac{1}{1-x}=\sum_{n=0}^{\infty}x^n
$$

---

# 2. Radius of Convergence

## 2.1 What is convergence?

Whether an infinite series is meaningful depends on whether it converges.

For example:

$$
1+\frac{1}{2}+\frac{1}{4}+\frac{1}{8}+\cdots
$$

The sum of this series gets closer and closer to $2$, so it converges.

However, a series such as:

$$
1+1+1+1+\cdots
$$

grows without bound, so it diverges.

---

## 2.2 Why do we need to discuss convergence for power series?

A power series contains a variable $x$. Therefore, for different values of $x$, the same power series may sometimes converge and sometimes diverge.

For example:

$$
\sum_{n=0}^{\infty}x^n
$$

If $x=\frac{1}{2}$:

$$
1+\frac{1}{2}+\frac{1}{4}+\frac{1}{8}+\cdots
$$

it converges.

If $x=2$:

$$
1+2+4+8+\cdots
$$

it diverges.

So we need to study:

<span style="color: red">For which values of $x$ does this power series converge?</span>

---

## 2.3 Radius of convergence $R$

For the power series:

$$
\sum_{n=0}^{\infty}c_n(x-a)^n
$$

there usually exists a number $R$ such that:

- when $|x-a|<R$, the series converges;
- when $|x-a|>R$, the series diverges;
- $a$ is the center of convergence.

![image](https://raw.githubusercontent.com/pennyzhaozhao/mathnest/main/content/images/1778100698105-t3qs8g02jue.png)

This number $R$ is called the **radius of convergence**.

---

**Three cases for $R$**

Case 1: The series converges only at the center

If $R=0$, this means the series converges only at:

$$
x=a
$$

---

Case 2: The series converges for all real numbers

If $R=\infty$, this means the series converges for all $x$.

That is, the interval of convergence is:

$$
(-\infty,\infty)
$$

---

Case 3: The series converges near the center

If $0<R<\infty$, then the series converges when:

$$
|x-a|<R
$$

This inequality can be rewritten as:

$$
a-R<x<a+R
$$

So the basic interval of convergence is:

$$
(a-R,a+R)
$$

---

# 3. Interval of Convergence

## 3.1 What is the interval of convergence?

The interval of convergence is the interval consisting of all values of $x$ for which the power series converges.

If the radius of convergence is $R$ and the center is $a$, then the interior of the interval must be:

$$
(a-R,a+R)
$$

However, the endpoints $x=a-R$ and $x=a+R$ must be checked separately.

---

<span style="color: red">Why do the endpoints need to be checked separately?</span>

Because the radius of convergence only tells us that:

- the series definitely converges inside the interval;
- the series definitely diverges outside the interval.

However, at the endpoints, where $|x-a|=R$, the series may converge or diverge. Therefore, the endpoints must be substituted back into the original series and checked separately.

Thus, if the center is $a$ and the radius is $R$, the interval of convergence may be one of the following four possibilities:

$$
(a-R,a+R)
$$

$$
(a-R,a+R]
$$

$$
[a-R,a+R)
$$

$$
[a-R,a+R]
$$

In other words:

- the left endpoint may or may not be included;
- the right endpoint may or may not be included.

---

# 4. Geometric Series

The most important starting point is:

$$
\frac{1}{1-x}=1+x+x^2+x^3+\cdots
$$

It can also be written as:

$$
\frac{1}{1-x}=\sum_{n=0}^{\infty}x^n
$$

This is valid when:

$$
|x|<1
$$

<span style="color:#CC0000"><span style="font-size:1.1em">Why is this true?</span></span>

The finite partial sum is:

$$
s_n=1+x+x^2+\cdots+x^n
$$

This is the sum of a finite geometric sequence:

$$
s_n=\frac{1-x^{n+1}}{1-x}
$$

When $|x|<1$:

$$
x^{n+1}\to 0
$$

So:

$$
s_n\to \frac{1}{1-x}
$$

Therefore:

$$
1+x+x^2+\cdots=\frac{1}{1-x}
$$

---

# 5. Representing Functions Using Geometric Series

The core idea of this section is:

> Rewrite the target function into the form $\frac{1}{1-r}$, and then apply the geometric series formula.

---

<span style="font-size:1.5em">1. Example: Represent $\frac{1}{1+x^2}$</span>

We know:

$$
\frac{1}{1-x}=\sum_{n=0}^{\infty}x^n
$$

Now we want to represent:

$$
\frac{1}{1+x^2}
$$

Notice that:

$$
1+x^2=1-(-x^2)
$$

So:

$$
\frac{1}{1+x^2}=\frac{1}{1-(-x^2)}
$$

Let:

$$
r=-x^2
$$

Then:

$$
\frac{1}{1+x^2}=\sum_{n=0}^{\infty}(-x^2)^n
$$

Expanding:

$$
\frac{1}{1+x^2}=1-x^2+x^4-x^6+x^8-\cdots
$$

It can also be written as:

$$
\frac{1}{1+x^2}=\sum_{n=0}^{\infty}(-1)^nx^{2n}
$$

The convergence condition is:

$$
|-x^2|<1
$$

That is:

$$
x^2<1
$$

So:

$$
|x|<1
$$

The interval of convergence is:

$$
(-1,1)
$$

---

<span style="font-size:1.5em">2. Example: Represent $\frac{1}{x+2}$</span>

We want to rewrite it into the form $\frac{1}{1-r}$.

First factor out $2$ from the denominator:

$$
x+2=2\left(1+\frac{x}{2}\right)
$$

So:

$$
\frac{1}{x+2}=\frac{1}{2\left(1+\frac{x}{2}\right)}
$$

That is:

$$
\frac{1}{x+2}=\frac{1}{2}\cdot\frac{1}{1+\frac{x}{2}}
$$

Rewrite the plus sign as a minus sign:

$$
1+\frac{x}{2}=1-\left(-\frac{x}{2}\right)
$$

So:

$$
\frac{1}{x+2}=\frac{1}{2}\cdot \frac{1}{1-\left(-\frac{x}{2}\right)}
$$

Apply the geometric series formula:

$$
\frac{1}{1-r}=\sum_{n=0}^{\infty}r^n
$$

Let:

$$
r=-\frac{x}{2}
$$

Then:

$$
\frac{1}{x+2}=\frac{1}{2}\sum_{n=0}^{\infty}\left(-\frac{x}{2}\right)^n
$$

Simplifying:

$$
\frac{1}{x+2}=\sum_{n=0}^{\infty}\frac{(-1)^n}{2^{n+1}}x^n
$$

The convergence condition is:

$$
\left|-\frac{x}{2}\right|<1
$$

So:

$$
\frac{|x|}{2}<1
$$

That is:

$$
|x|<2
$$

The interval of convergence is:

$$
(-2,2)
$$

---

<span style="font-size:1.5em">3. Example: Represent $\frac{x^3}{x+2}$</span>

Since we already know that:

$$
\frac{1}{x+2}=\sum_{n=0}^{\infty}\frac{(-1)^n}{2^{n+1}}x^n
$$

we have:

$$
\frac{x^3}{x+2}=x^3\cdot \frac{1}{x+2}
$$

Thus:

$$
\frac{x^3}{x+2}=x^3\sum_{n=0}^{\infty}\frac{(-1)^n}{2^{n+1}}x^n
$$

Multiplying by $x^3$:

$$
\frac{x^3}{x+2}=\sum_{n=0}^{\infty}\frac{(-1)^n}{2^{n+1}}x^{n+3}
$$

Expanding the first few terms:

$$
\frac{x^3}{x+2}
=\frac{1}{2}x^3-\frac{1}{4}x^4+\frac{1}{8}x^5-\frac{1}{16}x^6+\cdots
$$

The interval of convergence remains unchanged:

$$
(-2,2)
$$

because multiplying by $x^3$ does not change the convergence condition of the geometric series itself.

---

# 6. Term-by-Term Differentiation of Power Series

## 6.1 Core idea

If a function can be written as a power series:

$$
f(x)=\sum_{n=0}^{\infty}c_n(x-a)^n
$$

then inside the interval of convergence, we can differentiate it term by term just like an ordinary polynomial:

$$
f'(x)=\sum_{n=1}^{\infty}n c_n(x-a)^{n-1}
$$

Notice that after differentiation, the sum starts from $n=1$, because the constant term corresponding to $n=0$ differentiates to $0$.

---

## 6.2 Why can we differentiate term by term?

Finite polynomials can certainly be differentiated term by term:

$$
\frac{d}{dx}(1+x+x^2)=0+1+2x
$$

A power series is like an infinite polynomial.

The theorem tells us that inside the radius of convergence, a power series can also be differentiated term by term.

---

## 6.3 Does the radius of convergence change?

> [!IMPORTANT] 
> After term-by-term differentiation of a power series, the radius of convergence $R$ remains unchanged, but the behavior at the endpoints may change.

In other words:

- the original radius is still $R$;
- but whether the endpoints converge needs to be checked again.

---

<span style="font-size:1.5em">Example: Represent $\frac{1}{(1-x)^2}$</span>

Start from the basic formula:

$$
\frac{1}{1-x}=1+x+x^2+x^3+\cdots
$$

That is:

$$
\frac{1}{1-x}=\sum_{n=0}^{\infty}x^n
$$

Differentiate both sides.

Left-hand side:

$$
\frac{d}{dx}\left(\frac{1}{1-x}\right)=\frac{1}{(1-x)^2}
$$

Right-hand side:

$$
\frac{d}{dx}(1+x+x^2+x^3+\cdots)=1+2x+3x^2+4x^3+\cdots
$$

Therefore:

$$
\frac{1}{(1-x)^2}=1+2x+3x^2+4x^3+\cdots
$$

This can be written as:

$$
\frac{1}{(1-x)^2}=\sum_{n=1}^{\infty}n x^{n-1}
$$

If we want to write it starting from $n=0$, we can re-index:

$$
\frac{1}{(1-x)^2}=\sum_{n=0}^{\infty}(n+1)x^n
$$

The radius of convergence is still:

$$
R=1
$$

---

# 7. Term-by-Term Integration of Power Series

## 7.1 Core formula

If:

$$
f(x)=\sum_{n=0}^{\infty}c_n(x-a)^n
$$

then:

$$
\int f(x)\,dx=C+\sum_{n=0}^{\infty}c_n\frac{(x-a)^{n+1}}{n+1}
$$

That is, each term can be integrated separately.

Just like differentiation:

> After term-by-term integration, the radius of convergence $R$ remains unchanged. However, the endpoints still need to be checked again.

---

<span style="font-size:1.5em">Example: Represent $\ln(1-x)$</span>

We know:

$$
\frac{1}{1-x}=1+x+x^2+x^3+\cdots
$$

and:

$$
\frac{d}{dx}\ln(1-x)=-\frac{1}{1-x}
$$

So:

$$
-\ln(1-x)=\int \frac{1}{1-x}\,dx
$$

Use the series to integrate the right-hand side:

$$
-\ln(1-x)=\int (1+x+x^2+x^3+\cdots)\,dx
$$

Integrating term by term:

$$
-\ln(1-x)=x+\frac{x^2}{2}+\frac{x^3}{3}+\frac{x^4}{4}+\cdots+C
$$

When $x=0$:

$$
-\ln(1-0)=0
$$

The right-hand side is:

$$
0+C
$$

So:

$$
C=0
$$

Therefore:

$$
-\ln(1-x)=x+\frac{x^2}{2}+\frac{x^3}{3}+\frac{x^4}{4}+\cdots
$$

Multiplying both sides by $-1$:

$$
\ln(1-x)=-x-\frac{x^2}{2}-\frac{x^3}{3}-\frac{x^4}{4}-\cdots
$$

In summation notation:

$$
\ln(1-x)=-\sum_{n=1}^{\infty}\frac{x^n}{n}
$$

Valid when:

$$
|x|<1
$$

Radius of convergence:

$$
R=1
$$

---

<span style="font-size:1.5em">Example: Represent $\tan^{-1}x$</span>

We know:

$$
\frac{d}{dx}\tan^{-1}x=\frac{1}{1+x^2}
$$

and we have already obtained:

$$
\frac{1}{1+x^2}=1-x^2+x^4-x^6+\cdots
$$

So we integrate:

$$
\tan^{-1}x=\int \frac{1}{1+x^2}\,dx
$$

Substitute in the series:

$$
\tan^{-1}x=\int (1-x^2+x^4-x^6+\cdots)\,dx
$$

Integrating term by term:

$$
\tan^{-1}x=x-\frac{x^3}{3}+\frac{x^5}{5}-\frac{x^7}{7}+\cdots
$$

In summation notation:

$$
\tan^{-1}x=\sum_{n=0}^{\infty}(-1)^n\frac{x^{2n+1}}{2n+1}
$$

Valid when:

$$
|x|<1
$$

Radius of convergence:

$$
R=1
$$

---

# 8. Using Power Series to Approximate Integrals

## 8.1 Why use power series to approximate integrals?

Some functions do not have simple elementary antiderivatives.

For example:

$$
\int \frac{1}{1+x^7}\,dx
$$

This integral is relatively difficult to compute directly.

However, we can write the integrand as a power series and then integrate term by term.

---

Example: Compute $\int \frac{1}{1+x^7}\,dx$

Rewrite:

$$
\frac{1}{1+x^7}
$$

as:

$$
\frac{1}{1-(-x^7)}
$$

Applying the geometric series:

$$
\frac{1}{1+x^7}=\sum_{n=0}^{\infty}(-x^7)^n
$$

That is:

$$
\frac{1}{1+x^7}=1-x^7+x^{14}-x^{21}+\cdots
$$

Integrate term by term:

$$
\int \frac{1}{1+x^7}\,dx=\int(1-x^7+x^{14}-x^{21}+\cdots)\,dx
$$

We get:

$$
\int \frac{1}{1+x^7}\,dx=C+x-\frac{x^8}{8}+\frac{x^{15}}{15}-\frac{x^{22}}{22}+\cdots
$$

In summation notation:

$$
\int \frac{1}{1+x^7}\,dx=C+\sum_{n=0}^{\infty}(-1)^n\frac{x^{7n+1}}{7n+1}
$$

The convergence condition is:

$$
|-x^7|<1
$$

That is:

$$
|x|<1
$$

---

If we want to compute:

$$
\int_0^{1/2}\frac{1}{1+x^7}\,dx
$$

using the antiderivative above and taking $C=0$:

$$
\int_0^{1/2}\frac{1}{1+x^7}\,dx=\left[
x-\frac{x^8}{8}+\frac{x^{15}}{15}-\frac{x^{22}}{22}+\cdots
\right]_0^{1/2}
$$

Substituting $x=\frac{1}{2}$:

$$
=\frac{1}{2}-\frac{1}{8\cdot 2^8}+\frac{1}{15\cdot 2^{15}}
-\frac{1}{22\cdot 2^{22}}+\cdots
$$

This is an alternating series.

If we want to approximate it within a certain error bound, we can use the Alternating Series Estimation Theorem:

> For an alternating series, if the absolute values of the terms decrease and tend to $0$, then the truncation error is less than the absolute value of the next term.
---

# 9. Taylor Series

<span style="color:#FF0000">The core question of Taylor Series</span>

Previously, we obtained power series representations of functions by transforming geometric series.

Now we want to ask a more general question:

> Can any function $f(x)$ be written as a power series?

That is, can it be written as:

$$
f(x)=c_0+c_1(x-a)+c_2(x-a)^2+c_3(x-a)^3+\cdots
$$

If it can, how should we find the coefficients $c_0,c_1,c_2,\ldots$?

Suppose:

$$
f(x)=\sum_{n=0}^{\infty}c_n(x-a)^n
$$

That is:

$$
f(x)=c_0+c_1(x-a)+c_2(x-a)^2+c_3(x-a)^3+\cdots
$$

**<span style="font-size:1.2em">Finding $c_0$</span>**

Let:

$$
x=a
$$

Then:

$$
f(a)=c_0+c_1(a-a)+c_2(a-a)^2+\cdots
$$

Since:

$$
a-a=0
$$

all terms except the first one become $0$.

Therefore:

$$
f(a)=c_0
$$

So:

$$
c_0=f(a)
$$

---

**<span style="font-size:1.2em">Finding $c_1$</span>**

Differentiate the original expression:

$$
f'(x)=c_1+2c_2(x-a)+3c_3(x-a)^2+4c_4(x-a)^3+\cdots
$$

Let:

$$
x=a
$$

Then:

$$
f'(a)=c_1
$$

So:

$$
c_1=f'(a)
$$

---

**<span style="font-size:1.2em">Finding $c_2$</span>**

Differentiate again:

$$
f''(x)=2c_2+3\cdot 2c_3(x-a)+4\cdot 3c_4(x-a)^2+\cdots
$$

Let $x=a$:

$$
f''(a)=2c_2
$$

So:

$$
c_2=\frac{f''(a)}{2}
$$

That is:

$$
c_2=\frac{f''(a)}{2!}
$$

---

**<span style="font-size:1.2em">Finding $c_3$</span>**

Differentiate once more:

$$
f'''(a)=3\cdot 2\cdot 1 c_3
$$

So:

$$
f'''(a)=3!c_3
$$

Therefore:

$$
c_3=\frac{f'''(a)}{3!}
$$

Continuing in this way, we obtain:

$$
f^{(n)}(a)=n!c_n
$$

So:

$$
c_n=\frac{f^{(n)}(a)}{n!}
$$

This is where the coefficients of the Taylor Series come from.

---

## Taylor Series Formula

Substitute $c_n$ back into the power series:

$$
f(x)=\sum_{n=0}^{\infty}
\frac{f^{(n)}(a)}{n!}(x-a)^n
$$

This is called the Taylor Series of $f$ at $a$.

Written out, it is:

$$
f(x)=f(a)+f'(a)(x-a)+\frac{f''(a)}{2!}(x-a)^2+\frac{f'''(a)}{3!}(x-a)^3+\cdots
$$

---

# 10. Maclaurin Series

## 10.1 What is a Maclaurin Series?

A Maclaurin Series is a special case of a Taylor Series.

When the center of expansion is:

$$
a=0
$$

the Taylor Series becomes the Maclaurin Series.

---

## 10.2 Maclaurin Series Formula

Taylor Series:

$$
f(x)=\sum_{n=0}^{\infty}\frac{f^{(n)}(a)}{n!}(x-a)^n
$$

Let $a=0$:

$$
f(x)=\sum_{n=0}^{\infty}\frac{f^{(n)}(0)}{n!}x^n
$$

Expanding:

$$
f(x)=f(0)+f'(0)x+\frac{f''(0)}{2!}x^2+\frac{f'''(0)}{3!}x^3+\cdots
$$

This is the Maclaurin Series.

---

# Difference Between Taylor Series and Maclaurin Series

| Name | Center of Expansion | Formula |
|---|---|---|
| Taylor Series | Any point $a$ | $\sum_{n=0}^{\infty}\frac{f^{(n)}(a)}{n!}(x-a)^n$ |
| Maclaurin Series | $0$ | $\sum_{n=0}^{\infty}\frac{f^{(n)}(0)}{n!}x^n$ |

> [!TIP]
> Taylor Series is an expansion around any point $a$.  
> Maclaurin Series is an expansion around $0$.