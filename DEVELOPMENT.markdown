Development notes:

To improve code quality and readability, eslint is used. The rules for eslint
are defined in .eslintrc.

Usually, advanced IDEs use the linter automatically, by marking warnings and
errors as they occur. Additionally, eslint can be run manually:

`eslint app/`

This shows a listing of errors and warnings in the subdirectory of the code. It
is not recommended running eslint on sencha or build folders.

For ensuring quality upon committing, a local pre-commit hook might be added to
git. This is a small shell script that is automatically executed before
committing, passing the commit only if there is no linting error present.
This example will only allow for commits without linting errors:
`.git/hooks/pre-commit`

    #!/bin/sh
    # A simple hook to use the linter on the app directory before committing
    echo "Running linter"
    if eslint app 2>&1
    then
    echo "linter successfully passed."
    else
    cat <<\EOF
    Eslint reported errors. Please check and fix the errors and try again.
    For details, see console output.
    EOF
    exit 1
    fi

Singular eslint rules can be disabled on a per-line basis by adding a comment
to the line, e.g.

`// eslint-disable-next-line no-loop-func`

This disables the rule 'no-loop-func' (Don't use variables of the upper scope
in a loop) for the following line.

The exceptions can also be defined on a block basis. Between the comments
`/* eslint-disable no-loop-func */` and `/* eslint-enable no-loop-func */`, the
linter ignores the given rule.

Those exceptions should be used after ensuring that either the linter
misbehaves or that the use is intentional.
