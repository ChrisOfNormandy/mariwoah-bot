# Language Documentation - CoNScript

# Operations

Set a variable to a value
> variable = value

Add a value to a variable
> variable += value

Subtract a value from a variable
> variable -= value

Multiply a variable by a value
> variable *= value

Divide a variable by a value
> variable /= value

Perform a modulo operation on a variable by a value
> variable %= value

Raise a variable to the power of a value
> variable ^= value

Negate a value
> !value

# Conditionals

Equates
> == | !=

Greater
> > | >=

Less
> < | <=

And
> &&

Or
> ||

NAnd
> !&

NOr
> !|

XAnd / XNOr
> x& | x!|

XOr / XNAnd
> x| / x!&

Divisible - x Mod y = 0
> /%

Not Divisible - x Mod y > 0
> !/%

# Types

Null
> null

Number
> 0-9 | Decimals | -Infinity, Infinity

String
> Any text

Function
> Any function (see "Functions")

Map
> A collection of values defined by key-value pairs.
> Arrays are just maps whose keys are defined as indexes.

Boolean
> True or False

Tuple / Collection
> (key: value, key: value, ...)
> Collections of key-value pairs.

Object
> {key: value}
> Works similarly to collections.

# Functions

Defining
> ([args] => {[commands,functions]})

Then
> .then([vars] => [function([args]]))

Passes the value from the previous function to the variables listed. Supplying more than one will separate arrays of values to specific variables.

Catch
> .catch(error => [function[args]])
> Only provides the error value, required.

Catches an error from the previous function.



# Prebuilt Functions

Prefixed with :

MATH

:math[function]([args])
> Performs the operation under 'Math' using the function with the provided arguments.

:math[round](number, *places)
> number: a number value
> places: default 0 (value -> integer)
> A negative value for a place will round a number past the decimal. Example: 134 rounded -1 = 130. 1565 rounded -2 = 1600.
> A positive value for a place will round a number to that many decimals. Example: 140.345 rounded 2 = 140.35.

:math[floor](number, *places)
> number: a number value
> places: default 0 (value -> integer)
> A negative value for a place will floor a number past the decimal. Example: 134 floored -1 = 130. 1565 floored -2 = 1500.
> A positive value for a place will round a number to that many decimals. Example: 140.345 floored 2 = 140.34.

:math[random](*min, *max)
> min: default 0
> max: default 1
> Returns a random number between the minimum value and maximum value.

:math[eval](equation)
> equation: a mathematical equation
Explained:
(1 + 1) -> (2) -> 2
(1 + 1) + 1 -> (2) + 1 -> 2 + 1 -> 3

((1 + 1) + (2 + 2)) + (3 / 1)
(A) + (B)
A: (1 + 1) + (2 + 2)
B: (3 / 1)

A -> (C) + (D)
C: (1 + 1) -> (2) -> 2
D: (2 + 2) -> (4) -> 4

A: (2 + 4) -> (6) -> 6

B: (3 / 1) -> (3) -> 3

(A) + (B) -> A + B -> 6 + 3 -> 9

Operations:
> + - * / % ^ !
> Addition, subtraction, multiplication, division, modulo, powers, factorial
Order:
> Parentheses, factorial, modulo, powers, multiplication, division, addition, subtraction
5 % 2 ^ 2 -> (5 % 2) ^ 2 -> 2 ^ 2 -> 4
5! % 2 ^ 2 -> ((5!) % 2) ^ 2 -> (120 % 2) ^ 2 -> 0 ^ 2 -> 0

CONDITIONALS

:if([statement]) {...}
:elif([statement]) {...}
:else {...}



LOOPS

:for([value] in [map]|[value]) {...}

:while([statement]) {...}



SYSTEM

:print([value])
> Can print multiple values - :print(a, b, c) -> "{a}\n{b}\n{c}" where a, b and c are on their own lines in one print.

:hash([value])
> Hashes a provided value.

# Special Operations

!{[value]}
> Converts a JSON string to a usable object.

${[value]}
> Converts an object to a stringified JSON.