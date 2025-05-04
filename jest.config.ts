import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleFileExtensions: [ 'ts', 'tsx', 'js', 'jsx', 'json', 'node' ],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
	testMatch: [ '**/*.spec.ts' ],
	collectCoverageFrom: [ 'src/**/*.{ts,tsx}', '!src/main.ts', '!src/**/*.module.ts' ],
	coverageDirectory: 'coverage',
	clearMocks: true
};
