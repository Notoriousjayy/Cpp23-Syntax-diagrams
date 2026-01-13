# C++ Syntax Diagrams

Interactive railroad diagrams (syntax diagrams) for C++, based on the C++ Standard Grammar Summary (Annex A).

## Overview

This project provides a visual representation of C++'s grammar using railroad diagrams. These diagrams make it easier to understand the syntax structure of C++ by providing a graphical alternative to BNF notation.

The grammar rules are organized into 13 sections following the C++ Standard:

- **A.2 Keywords** - typedef-name, namespace-name, class-name, enum-name, template-name
- **A.3 Lexical Conventions** - Tokens, identifiers, preprocessing tokens
- **A.3 Literals** - Integer, floating-point, character, string, boolean, pointer literals
- **A.4 Basics** - Translation unit structure
- **A.5 Expressions** - All expression types, operators, lambdas, requires-expressions
- **A.6 Statements** - Labeled, compound, selection, iteration, jump statements
- **A.7 Declarations** - Specifiers, declarators, initializers, functions, enums, namespaces, attributes
- **A.8 Modules** - Module declarations, exports, imports, partitions
- **A.9 Classes** - Class specifiers, members, bases, constructors
- **A.10 Overloading** - Operator functions, literal operators
- **A.11 Templates** - Template declarations, parameters, concepts, constraints
- **A.12 Exception Handling** - try-blocks, handlers, noexcept
- **A.13 Preprocessing** - Directives, macros, conditionals

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5177`.

### Production Build

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Type Checking

```bash
npm run typecheck
```

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Webpack 5** - Bundling
- **@prantlf/railroad-diagrams** - Railroad diagram generation

## Project Structure

```
cpp-syntax-diagrams/
├── src/
│   ├── main.tsx                          # Entry point
│   ├── app/
│   │   ├── App.tsx                       # Main application component
│   │   └── styles.css                    # Global styles
│   ├── components/
│   │   ├── RuleDiagram.tsx               # Individual rule diagram
│   │   └── RuleList.tsx                  # List of rule diagrams
│   ├── features/
│   │   └── grammar/
│   │       └── cppGrammar.ts             # C++ grammar definitions
│   ├── shared/
│   │   └── railroad/
│   │       └── diagramToSvg.ts           # SVG rendering utility
│   └── types/
│       └── railroad-diagrams.d.ts        # Type declarations
├── .github/
│   ├── dependabot.yml
│   └── workflows/
│       ├── codeql.yml
│       ├── dependency-review.yml
│       └── pages.yml
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.webpack.json
└── webpack.config.cjs
```

## Grammar Coverage

This project covers the complete C++ grammar including:

- **Lexical Elements**: Tokens, identifiers, keywords, operators, punctuators
- **Literals**: All literal types including user-defined literals
- **Expressions**: Full expression hierarchy with operator precedence
- **Statements**: All statement types including coroutines (co_await, co_yield, co_return)
- **Declarations**: Complete declaration syntax including structured bindings
- **Modules**: C++20 module system
- **Classes**: Class definitions, inheritance, member access, constructors
- **Templates**: Template declarations, concepts, constraints, deduction guides
- **Exceptions**: try-catch, noexcept specifications
- **Preprocessing**: All preprocessor directives

## References

- [C++ Standard Draft (eel.is)](https://eel.is/c++draft/)
- [C++ Grammar Summary](https://eel.is/c++draft/gram)
- [cppreference.com](https://en.cppreference.com/)
- [Railroad Diagram (Wikipedia)](https://en.wikipedia.org/wiki/Syntax_diagram)

## License

MIT
