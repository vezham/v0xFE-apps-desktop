#!/bin/bash

# "format": "pnpm format:pkg && pnpm format:prettier && pnpm format:lint",
# "format:lint": "pnpm format:lint:eslint && pnpm format:lint:stylelint",

echo -e "\033[32m v0xFE \033[m\033[31;1mwjdlz/WS:\033[0m Calling format:pkg"
pnpm format:pkg

echo -e "\033[32m v0xFE \033[m\033[31;1mwjdlz/WS:\033[0m Calling format:prettier"
pnpm format:prettier

echo -e "\033[32m v0xFE \033[m\033[31;1mwjdlz/WS:\033[0m Calling lint:eslint"
pnpm format:lint:eslint

echo -e "\033[32m v0xFE \033[m\033[31;1mwjdlz/WS:\033[0m Calling lint:stylelint"
pnpm format:lint:stylelint
