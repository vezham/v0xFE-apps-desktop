module.exports = {
  singleAttributePerLine: false,
  tabWidth: 2,
  printWidth: 80,
  singleQuote: true,
  semi: false,
  trailingComma: 'none',
  bracketSameLine: true,
  arrowParens: 'avoid',
  plugins: [
    require.resolve('@trivago/prettier-plugin-sort-imports'),
    import('prettier-plugin-organize-imports'),
    import('prettier-plugin-tailwindcss')
  ],
  importOrder: ['<THIRD_PARTY_MODULES>', '^@vezham/(.*)$', '^@/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  tailwindAttributes: ['className'],
  tailwindFunctions: ['tv', 'cva', 'cn', 'clsx']
}
