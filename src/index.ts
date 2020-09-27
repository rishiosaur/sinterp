import { Token } from './Token'
import { Scanner } from './Scanner'
import { bgBlue, bgRed, bgRedBright } from 'chalk'
import { readFile, readFileSync } from 'fs'
// class TypeLox {
// 	hadError: boolean = false
// 	public static runFile(path: string) {}

// 	private static async run(source: string) {
// 		const scanner = new Scanner(source, this.erro)

// 		const tokens: Array<Token> = scanner.scanTokens()

// 		for (const token of tokens) {
// 		}
// 	}

// 	private error = (line: number, message: string) => {
// 		this.report(line, '', message)
// 	}

// 	private report(line: number, where: string, message: string) {
// 		console.error('[line ' + line + '] Error' + where + ': ' + message)
// 		this.hadError = true
// 	}
// }

var hadError = false
const error = (line: number, col: number, message: string) => {
	report(line, col, '', message)
}

const report = (line: number, col: number, where: string, message: string) => {
	console.error(
		`${bgRed(`[pos: (${line}, ${col})]`)} Error${where}: ${bgBlue(message)}`
	)
	hadError = true
}

// ;(async () =>
const scanner = new Scanner(
	`if 2 >= 3 {
		console.log "awef" 

}`,
	error
)

console.log(scanner.scanTokens())

export const scanFile = async (file: string) => {
	const fileToParse = readFileSync(file)

	console.log(fileToParse)
}
// })()
