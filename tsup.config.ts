import type { Options } from 'tsup'

export default <Options>{
  entryPoints: ['src/extension.ts'],
  clean: true,
  sourcemap: true,
  format: ['cjs'],
  external: ['vscode'],
  noExternal: ['execa']
}
