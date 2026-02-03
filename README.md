# C++23 Syntax Diagrams

A React + TypeScript single-page app that renders **C++23 grammar railroad diagrams** (SVG) and shows each rule's **EBNF text** underneath. The grammar is implemented as "diagram factories" that produce railroad-diagram objects.

## Features

- **Railroad Diagrams**: Visual representation of C++23 grammar rules using SVG
- **EBNF Definitions**: Collapsible EBNF notation below each diagram
- **Section Navigation**: Grammar rules organized by category (Keywords, Lexical, Expressions, Declarations, etc.)
- **Search/Filter**: Filter rules by name
- **Dark Mode**: Automatic dark mode support
- **Lazy Rendering**: Sections are collapsed by default for performance with large grammar sets

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run typecheck

# Check grammar coverage (diagram ↔ EBNF sync)
npm run check-grammar
```

## Project Structure

```
├── src/
│   ├── main.tsx                    # Entry point
│   ├── app/
│   │   ├── App.tsx                 # Main application component
│   │   └── styles.css              # Global styles
│   ├── components/
│   │   ├── RuleDiagram.tsx         # Individual rule diagram renderer
│   │   └── RuleList.tsx            # List of rule diagrams
│   ├── features/
│   │   └── grammar/
│   │       ├── cppGrammar.ts       # Diagram factories & section definitions
│   │       └── ebnfDefinitions.ts  # EBNF text definitions
│   ├── shared/
│   │   └── railroad/
│   │       └── diagramToSvg.ts     # SVG conversion utility
│   └── types/
│       └── railroad-diagrams.d.ts  # Type declarations
├── scripts/
│   └── check-grammar-coverage.mjs  # Grammar/EBNF drift detection
├── .github/
│   ├── workflows/
│   │   ├── pages.yml               # GitHub Pages deployment
│   │   ├── ci.yml                  # CI pipeline with typecheck
│   │   ├── codeql.yml              # Security scanning
│   │   └── dependency-review.yml   # Dependency vulnerability review
│   └── dependabot.yml              # Automated dependency updates
└── webpack.config.cjs              # Webpack configuration
```

## Grammar Sections

The C++23 grammar is organized into sections following Annex A of the C++ Standard:

- **A.2 Keywords** - typedef-name, namespace-name, class-name, etc.
- **A.3 Lexical Conventions** - tokens, identifiers, operators
- **A.3 Literals** - integer, floating, character, string literals
- **A.4 Basics** - translation units, names, types
- **A.5 Expressions** - primary, postfix, unary, binary expressions
- **A.6 Statements** - compound, selection, iteration, jump statements
- **A.7 Declarations** - specifiers, declarators, initializers
- **A.8 Modules** - module declarations, imports, exports
- **A.9 Classes** - class definitions, members, access
- **A.10 Overloading** - operator functions, literal operators
- **A.11 Templates** - template declarations, parameters, concepts
- **A.12 Exception Handling** - try-blocks, handlers, noexcept
- **A.13 Preprocessing Directives** - #if, #include, #define, etc.

## CI/CD

The project uses GitHub Actions for:

1. **Type Safety**: `npm run typecheck` runs before every build
2. **Grammar Coverage**: `npm run check-grammar` ensures diagram factories and EBNF definitions stay in sync
3. **Security Scanning**: CodeQL analysis on push/PR and weekly schedule
4. **Dependency Review**: Checks PRs for vulnerable dependencies
5. **Automated Deployment**: GitHub Pages deployment on push to main

## Development Notes

### Adding New Grammar Rules

1. Add the diagram factory in `src/features/grammar/cppGrammar.ts`:
   ```typescript
   rules.set("my-new-rule", () =>
     Diagram(
       Sequence(T("keyword"), NT("identifier"))
     )
   );
   ```

2. Add the EBNF definition in `src/features/grammar/ebnfDefinitions.ts`:
   ```typescript
   "my-new-rule": `my-new-rule:
       keyword identifier`,
   ```

3. Add the rule to the appropriate section in `SECTION_RULES`

4. Run `npm run check-grammar` to verify coverage

### SVG Trust Boundary

The `RuleDiagram` component uses `dangerouslySetInnerHTML` to render SVG. This is safe because:
- SVG is generated locally from deterministic factories
- No untrusted user input is processed
- If external grammar loading is added in the future, implement defensive sanitization

## References

- [C++ Standard Grammar (eel.is)](https://eel.is/c++draft/gram)
- [ISO/IEC 14882:2024 (C++23)](https://www.iso.org/standard/83626.html)

## License

MIT
