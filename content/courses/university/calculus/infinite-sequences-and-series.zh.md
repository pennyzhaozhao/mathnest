---
title: "Infinite Sequences and Series"
description: "Power series represent functions as infinite polynomials, with convergence determining where the representation is valid."
date: 2026-05-06
course: university
section: calculus
tags: [calculus, taylor series, maclaurin series]
lang: zh
---

# Infinite Sequences and Series

Objective

1. Radius and Interval of Convergence  
2. Representations
3. Differentiation and Integration of Power Series  
4. Taylor Series and Maclaurin Series

---

# 1. 幂级数 Power Series

幂级数的基本形式是：

$$
\sum_{n=0}^{\infty} c_n(x-a)^n
$$

其中：

- $c_n$ 是系数；
- $x$ 是变量；
- $a$ 是展开中心；
- $(x-a)^n$ 表示围绕 $a$ 展开的幂次项。

如果 $a=0$，幂级数变成：

$$
\sum_{n=0}^{\infty} c_nx^n
$$

这叫做以 $0$ 为中心的幂级数。

普通多项式是有限项，例如：

$$
1+x+x^2+x^3
$$

而幂级数是无限项：

$$
1+x+x^2+x^3+\cdots
$$

---

很多复杂函数都可以被写成幂级数形式。

例如：

$$
\frac{1}{1-x}=1+x+x^2+x^3+\cdots
$$

也就是：

$$
\frac{1}{1-x}=\sum_{n=0}^{\infty}x^n
$$

---

# 2. 收敛半径 Radius of Convergence

## 2.1 什么是收敛？

一个无穷级数是否有意义，关键看它是否收敛。

例如：

$$
1+\frac{1}{2}+\frac{1}{4}+\frac{1}{8}+\cdots
$$

这个级数和越来越接近 $2$，所以它收敛。

但是像以下的级数：

$$
1+1+1+1+\cdots
$$

它会无限变大，所以发散。

---

## 2.2 幂级数为什么需要讨论收敛？

幂级数里面有变量 $x$， 那么对于不同的 $x$，同一个幂级数可能有时候收敛，有时候发散。

例如：

$$
\sum_{n=0}^{\infty}x^n
$$

如果 $x=\frac{1}{2}$：

$$
1+\frac{1}{2}+\frac{1}{4}+\frac{1}{8}+\cdots
$$

收敛。

如果 $x=2$：

$$
1+2+4+8+\cdots
$$

发散。

所以我们要研究： <span style="color: red">对哪些 $x$，这个幂级数是收敛的？</span>

---

## 2.3 收敛半径 $R$

对于幂级数：

$$
\sum_{n=0}^{\infty}c_n(x-a)^n
$$

通常存在一个数 $R$，使得：

- 当 $|x-a|<R$ 时，级数收敛；
- 当 $|x-a|>R$ 时，级数发散。
- a指的是收敛中心

![image](https://raw.githubusercontent.com/pennyzhaozhao/mathnest/main/content/images/1778100698105-t3qs8g02jue.png)

这个 $R$ 就叫做 **收敛半径**。

---

**对于R的三种情况**

情况 1：只在中心点收敛

如果 $R=0$，说明级数只在：

$$
x=a
$$

处收敛。

---

情况 2：对所有实数都收敛

如果 $R=\infty$，说明级数对所有 $x$ 都收敛。

也就是收敛区间为：

$$
(-\infty,\infty)
$$

---

情况 3：在中心附近收敛

如果 $0<R<\infty$，则级数在：

$$
|x-a|<R
$$

时收敛。

这个不等式可以改写为：

$$
a-R<x<a+R
$$

所以基本收敛区间是：

$$
(a-R,a+R)
$$

---

# 3. 收敛区间 Interval of Convergence

## 3.1 什么是收敛区间？


收敛区间就是所有让幂级数收敛的 $x$ 组成的区间。

如果收敛半径是 $R$，中心是 $a$，那么内部一定是：

$$
(a-R,a+R)
$$

但是端点：$x=a-R$ 和 $x=a+R$ 需要单独检查。

---

<span style="color: red">为什么端点要单独检查？</span>

因为收敛半径只告诉我们：

- 区间内部一定收敛；
- 区间外部一定发散。

但是端点处，即：$|x-a|=R$ 的地方，可能收敛，也可能发散，所以端点必须代入原级数中单独判断。

那么这样来说四种可能的收敛区间，如果中心是 $a$，半径是 $R$，那么收敛区间可能是：
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

也就是说：

- 左端点可能包含，也可能不包含；
- 右端点可能包含，也可能不包含。

---

# 4. 几何级数 Geometric Series

这最重要的起点是：

$$
\frac{1}{1-x}=1+x+x^2+x^3+\cdots
$$

也可以写成：

$$
\frac{1}{1-x}=\sum_{n=0}^{\infty}x^n
$$

成立条件是：

$$
|x|<1
$$

<span style="color:#CC0000"><span style="font-size:1.1em">为什么它成立？</span></span>

有限部分和为：

$$
s_n=1+x+x^2+\cdots+x^n
$$

这是一个有限等比数列求和：

$$
s_n=\frac{1-x^{n+1}}{1-x}
$$

当 $|x|<1$ 时：

$$
x^{n+1}\to 0
$$

所以：

$$
s_n\to \frac{1}{1-x}
$$

因此：

$$
1+x+x^2+\cdots=\frac{1}{1-x}
$$

---

# 5. 用几何级数表示函数

这一部分的核心思想是：

> 把目标函数变形成 $\frac{1}{1-r}$ 的形式，然后套用几何级数公式。

---

<span style="font-size:1.5em">1. 例子：表示 $\frac{1}{1+x^2}$</span>

我们知道：

$$
\frac{1}{1-x}=\sum_{n=0}^{\infty}x^n
$$

现在要表示：

$$
\frac{1}{1+x^2}
$$

注意：

$$
1+x^2=1-(-x^2)
$$

所以：

$$
\frac{1}{1+x^2}=\frac{1}{1-(-x^2)}
$$

令：

$$
r=-x^2
$$

则：

$$
\frac{1}{1+x^2}=\sum_{n=0}^{\infty}(-x^2)^n
$$

展开：

$$
\frac{1}{1+x^2}=1-x^2+x^4-x^6+x^8-\cdots
$$

也可以写成：

$$
\frac{1}{1+x^2}=\sum_{n=0}^{\infty}(-1)^nx^{2n}
$$

收敛条件是：

$$
|-x^2|<1
$$

也就是：

$$
x^2<1
$$

所以：

$$
|x|<1
$$

收敛区间是：

$$
(-1,1)
$$

---

<span style="font-size:1.5em">2. 例子：表示 $\frac{1}{x+2}$</span>

我们想把它变成 $\frac{1}{1-r}$ 的形式

先把分母中的 $2$ 提出来：

$$
x+2=2\left(1+\frac{x}{2}\right)
$$

所以：

$$
\frac{1}{x+2}=\frac{1}{2\left(1+\frac{x}{2}\right)}
$$

即：

$$
\frac{1}{x+2}=\frac{1}{2}\cdot\frac{1}{1+\frac{x}{2}}
$$

把加号写成减号：

$$
1+\frac{x}{2}=1-\left(-\frac{x}{2}\right)
$$

所以：

$$
\frac{1}{x+2}=\frac{1}{2}\cdot \frac{1}{1-\left(-\frac{x}{2}\right)}
$$

套用几何级数：

$$
\frac{1}{1-r}=\sum_{n=0}^{\infty}r^n
$$

令：

$$
r=-\frac{x}{2}
$$

得到：

$$
\frac{1}{x+2}=\frac{1}{2}\sum_{n=0}^{\infty}\left(-\frac{x}{2}\right)^n
$$

整理：

$$
\frac{1}{x+2}=\sum_{n=0}^{\infty}\frac{(-1)^n}{2^{n+1}}x^n
$$

收敛条件：

$$
\left|-\frac{x}{2}\right|<1
$$

所以：

$$
\frac{|x|}{2}<1
$$

即：

$$
|x|<2
$$

收敛区间是：

$$
(-2,2)
$$

---

<span style="font-size:1.5em">3. 例子：表示 $\frac{x^3}{x+2}$</span>

因为我们刚刚已经知道：

$$
\frac{1}{x+2}=\sum_{n=0}^{\infty}\frac{(-1)^n}{2^{n+1}}x^n
$$

所以：

$$
\frac{x^3}{x+2}=x^3\cdot \frac{1}{x+2}
$$

于是：

$$
\frac{x^3}{x+2}=x^3\sum_{n=0}^{\infty}\frac{(-1)^n}{2^{n+1}}x^n
$$

把 $x^3$ 乘进去：

$$
\frac{x^3}{x+2}=\sum_{n=0}^{\infty}\frac{(-1)^n}{2^{n+1}}x^{n+3}
$$

展开前几项：

$$
\frac{x^3}{x+2}
=\frac{1}{2}x^3-\frac{1}{4}x^4+\frac{1}{8}x^5-\frac{1}{16}x^6+\cdots
$$

收敛区间不变，仍然是：

$$
(-2,2)
$$

因为乘上 $x^3$ 不会改变几何级数本身的收敛条件。

---

# 6. 幂级数的逐项求导 Term-by-Term Differentiation

## 6.1 核心思想

如果一个函数可以写成幂级数：

$$
f(x)=\sum_{n=0}^{\infty}c_n(x-a)^n
$$

那么在收敛区间内部，我们可以像对普通多项式一样逐项求导：

$$
f'(x)=\sum_{n=1}^{\infty}n c_n(x-a)^{n-1}
$$

注意求导后从 $n=1$ 开始，因为 $n=0$ 的常数项求导为 $0$。

---

## 6.2 为什么可以逐项求导？

有限多项式当然可以逐项求导：

$$
\frac{d}{dx}(1+x+x^2)=0+1+2x
$$

幂级数是无限多项式。
定理告诉我们：在收敛半径内部，幂级数也可以逐项求导。

---

## 6.3 收敛半径是否改变？

> [!IMPORTANT] 
> 幂级数逐项求导后，收敛半径 $R$ 不变，但是端点可能发生变化。

也就是说：
- 原来的半径仍然是 $R$；
- 但是端点是否收敛，需要重新检查。
---

<span style="font-size:1.5em">例子：表示 $\frac{1}{(1-x)^2}$</span>

从基础公式开始：

$$
\frac{1}{1-x}=1+x+x^2+x^3+\cdots
$$

即：

$$
\frac{1}{1-x}=\sum_{n=0}^{\infty}x^n
$$

两边同时求导。

左边：

$$
\frac{d}{dx}\left(\frac{1}{1-x}\right)=\frac{1}{(1-x)^2}
$$

右边：

$$
\frac{d}{dx}(1+x+x^2+x^3+\cdots)=1+2x+3x^2+4x^3+\cdots
$$

因此：

$$
\frac{1}{(1-x)^2}=1+2x+3x^2+4x^3+\cdots
$$

可以写成：

$$
\frac{1}{(1-x)^2}=\sum_{n=1}^{\infty}n x^{n-1}
$$

如果想从 $n=0$ 开始写，可以令指标变化：

$$
\frac{1}{(1-x)^2}=\sum_{n=0}^{\infty}(n+1)x^n
$$

收敛半径仍然是：

$$
R=1
$$

---

# 7. 幂级数的逐项积分 Term-by-Term Integration

## 7.1 核心公式

如果：

$$
f(x)=\sum_{n=0}^{\infty}c_n(x-a)^n
$$

那么：

$$
\int f(x)\,dx=C+\sum_{n=0}^{\infty}c_n\frac{(x-a)^{n+1}}{n+1}
$$

也就是可以把每一项单独积分。

和求导一样：

> 逐项积分后，收敛半径 $R$ 不变。但端点依然需要重新判断。

---

<span style="font-size:1.5em">例子：表示 ln(1−x)</span>

我们知道：

$$
\frac{1}{1-x}=1+x+x^2+x^3+\cdots
$$

而：

$$
\frac{d}{dx}\ln(1-x)=-\frac{1}{1-x}
$$

所以：

$$
-\ln(1-x)=\int \frac{1}{1-x}\,dx
$$

将右边用级数积分：

$$
-\ln(1-x)=\int (1+x+x^2+x^3+\cdots)\,dx
$$

逐项积分：

$$
-\ln(1-x)=x+\frac{x^2}{2}+\frac{x^3}{3}+\frac{x^4}{4}+\cdots+C
$$

当 $x=0$ 时：

$$
-\ln(1-0)=0
$$

右边：

$$
0+C
$$

所以：

$$
C=0
$$

因此：

$$
-\ln(1-x)=x+\frac{x^2}{2}+\frac{x^3}{3}+\frac{x^4}{4}+\cdots
$$

两边乘以 $-1$：

$$
\ln(1-x)=-x-\frac{x^2}{2}-\frac{x^3}{3}-\frac{x^4}{4}-\cdots
$$

写成求和形式：

$$
\ln(1-x)=-\sum_{n=1}^{\infty}\frac{x^n}{n}
$$

成立条件：

$$
|x|<1
$$

收敛半径：

$$
R=1
$$

---

<span style="font-size:1.5em">例子：表示 $\tan^{-1}x$</span>

我们知道：

$$
\frac{d}{dx}\tan^{-1}x=\frac{1}{1+x^2}
$$

而之前已经得到：

$$
\frac{1}{1+x^2}=1-x^2+x^4-x^6+\cdots
$$

所以积分：

$$
\tan^{-1}x=\int \frac{1}{1+x^2}\,dx
$$

代入级数：

$$
\tan^{-1}x=\int (1-x^2+x^4-x^6+\cdots)\,dx
$$

逐项积分：
$$
\tan^{-1}x=x-\frac{x^3}{3}+\frac{x^5}{5}-\frac{x^7}{7}+\cdots
$$

写成求和形式：
$$
\tan^{-1}x=\sum_{n=0}^{\infty}(-1)^n\frac{x^{2n+1}}{2n+1}
$$

成立条件：

$$
|x|<1
$$

收敛半径：

$$
R=1
$$

---

# 8. 用幂级数近似积分

## 8.1 为什么要用幂级数近似积分？

有些函数没有简单的初等原函数。

例如：

$$
\int \frac{1}{1+x^7}\,dx
$$

这个积分直接算比较麻烦。

但是可以把 integrand 写成幂级数，然后逐项积分。

---

例子：计算 $\int \frac{1}{1+x^7}\,dx$

我们把：

$$
\frac{1}{1+x^7}
$$

写成：

$$
\frac{1}{1-(-x^7)}
$$

套用几何级数：

$$
\frac{1}{1+x^7}=\sum_{n=0}^{\infty}(-x^7)^n
$$

也就是：

$$
\frac{1}{1+x^7}=1-x^7+x^{14}-x^{21}+\cdots
$$

逐项积分：

$$
\int \frac{1}{1+x^7}\,dx=\int(1-x^7+x^{14}-x^{21}+\cdots)\,dx
$$

得到：

$$
\int \frac{1}{1+x^7}\,dx=C+x-\frac{x^8}{8}+\frac{x^{15}}{15}-\frac{x^{22}}{22}+\cdots
$$

写成求和：

$$
\int \frac{1}{1+x^7}\,dx=C+\sum_{n=0}^{\infty}(-1)^n\frac{x^{7n+1}}{7n+1}
$$

收敛条件：

$$
|-x^7|<1
$$

即：

$$
|x|<1
$$

---

如果要计算：

$$
\int_0^{1/2}\frac{1}{1+x^7}\,dx
$$

使用上面的原函数，并取 $C=0$：

$$
\int_0^{1/2}\frac{1}{1+x^7}\,dx=\left[
x-\frac{x^8}{8}+\frac{x^{15}}{15}-\frac{x^{22}}{22}+\cdots
\right]_0^{1/2}
$$

代入 $x=\frac{1}{2}$：

$$
=
\frac{1}{2}
-
\frac{1}{8\cdot 2^8}
+
\frac{1}{15\cdot 2^{15}}
-
\frac{1}{22\cdot 2^{22}}
+\cdots
$$

这是一个交错级数。

如果想近似到某个误差范围，可以用交错级数估计定理：

> 对交错级数，如果每一项绝对值递减并趋于 $0$，那么截断误差小于下一项的绝对值。

---

# 9. Taylor Series

<span style="color:#FF0000">Taylor Series 的核心问题</span>

前面我们是通过几何级数变形得到函数的幂级数。

但是现在我们想问一个更一般的问题：

> 任意函数 $f(x)$ 能不能写成幂级数？

也就是能不能写成：

$$
f(x)=c_0+c_1(x-a)+c_2(x-a)^2+c_3(x-a)^3+\cdots
$$

如果可以，那么系数 $c_0,c_1,c_2,\ldots$ 应该怎么求？

假设：

$$
f(x)=\sum_{n=0}^{\infty}c_n(x-a)^n
$$

也就是：

$$
f(x)=c_0+c_1(x-a)+c_2(x-a)^2+c_3(x-a)^3+\cdots
$$

**<span style="font-size:1.2em">求 $c_0$</span>**

令：

$$
x=a
$$

则：

$$
f(a)=c_0+c_1(a-a)+c_2(a-a)^2+\cdots
$$

因为：

$$
a-a=0
$$

所以除了第一项以外，后面都变成 $0$。

因此：

$$
f(a)=c_0
$$

所以：

$$
c_0=f(a)
$$

---

**<span style="font-size:1.2em">求 $c_1$</span>**

对原式求导：

$$
f'(x)=c_1+2c_2(x-a)+3c_3(x-a)^2+4c_4(x-a)^3+\cdots
$$

令：

$$
x=a
$$

得到：

$$
f'(a)=c_1
$$

所以：

$$
c_1=f'(a)
$$

---

**<span style="font-size:1.2em">求 $c_2$</span>**

再求一次导：

$$
f''(x)=2c_2+3\cdot 2c_3(x-a)+4\cdot 3c_4(x-a)^2+\cdots
$$

令 $x=a$：

$$
f''(a)=2c_2
$$

所以：

$$
c_2=\frac{f''(a)}{2}
$$

也就是：

$$
c_2=\frac{f''(a)}{2!}
$$

---

**<span style="font-size:1.2em">求 $c_3$</span>**

再求一次导：

$$
f'''(a)=3\cdot 2\cdot 1 c_3
$$

所以：

$$
f'''(a)=3!c_3
$$

因此：

$$
c_3=\frac{f'''(a)}{3!}
$$

继续下去，会得到：

$$
f^{(n)}(a)=n!c_n
$$

所以：

$$
c_n=\frac{f^{(n)}(a)}{n!}
$$

这就是 Taylor Series 系数的来源。

---
## Taylor Series 公式

把 $c_n$ 代回幂级数：

$$
f(x)=\sum_{n=0}^{\infty}
\frac{f^{(n)}(a)}{n!}(x-a)^n
$$

这叫做函数 $f$ 在 $a$ 处的 Taylor Series。

展开写就是：

$$
f(x)=f(a)+f'(a)(x-a)+\frac{f''(a)}{2!}(x-a)^2+\frac{f'''(a)}{3!}(x-a)^3+\cdots
$$
---

# 10. Maclaurin Series

## 10.1 什么是 Maclaurin Series？

Maclaurin Series 是 Taylor Series 的特殊情况。

当展开中心：

$$
a=0
$$

时，Taylor Series 变成 Maclaurin Series。

---

## 10.2 Maclaurin Series 公式

Taylor Series：

$$
f(x)=\sum_{n=0}^{\infty}\frac{f^{(n)}(a)}{n!}(x-a)^n
$$

令 $a=0$：

$$
f(x)=\sum_{n=0}^{\infty}\frac{f^{(n)}(0)}{n!}x^n
$$

展开为：

$$
f(x)=f(0)+f'(0)x+\frac{f''(0)}{2!}x^2+\frac{f'''(0)}{3!}x^3+\cdots
$$

这就是 Maclaurin Series。

---
# Taylor Series 和 Maclaurin Series 的区别

| 名称 | 展开中心 | 公式 |
|---|---|---|
| Taylor Series | 任意点 $a$ | $\sum_{n=0}^{\infty}\frac{f^{(n)}(a)}{n!}(x-a)^n$ |
| Maclaurin Series | $0$ | $\sum_{n=0}^{\infty}\frac{f^{(n)}(0)}{n!}x^n$ |

> [!TIP]
> Taylor Series 是围绕任意点 $a$ 展开。  
> Maclaurin Series 是围绕 $0$ 展开。
