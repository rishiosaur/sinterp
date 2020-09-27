import { join } from 'path'

let outputDir = ''

const generate = (args: string[]) => {
	if (args.length !== 1) {
		console.error('Only 1 argument is allowed.')
		return 0
	}

	outputDir = args[0]
}

const defineAst = async (
	outputDir: string,
	baseName: string,
	types: Array<string>
) => {
	const x = join(outputDir, '/', baseName + '.ts')
}
