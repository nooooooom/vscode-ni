import type { Options } from 'tsup'

export default <Options>{
  entryPoints: ['src/extension.ts'],
  clean: true,
  format: ['cjs'],
  external: ['vscode']
}
