import { Token } from './Token'
import { TokenType, keywords } from './TokenType'

export class Scanner {
	tokens: Array<Token> = []

	private start = 0 // start of token
	private current = 0 // current char
	private line = 1 // line number

	constructor(
		private source: string,
		private reportError: (line: number, char: number, message: string) => void
	) {}

	scanTokens(): Array<Token> {
		while (!this.isAtEnd) {
			this.scanToken()

			this.start = this.current
		}

		this.tokens.push(new Token(TokenType.EOF, '', null, this.line))

		return this.tokens
	}

	private get isAtEnd() {
		// console.log(this.current)
		// console.log(this.source.length)
		// console.log(this.current >= this.source.length)
		return this.current >= this.source.length
	}

	private scanToken() {
		const c = this.advance()

		switch (c) {
			case '(':
				this.addSingleCharToken(TokenType.LEFT_PAREN)
				break
			case ')':
				this.addSingleCharToken(TokenType.RIGHT_PAREN)
				break
			case '{':
				this.addSingleCharToken(TokenType.LEFT_BRACE)
				break
			case '}':
				this.addSingleCharToken(TokenType.RIGHT_BRACE)
				break
			case ',':
				this.addSingleCharToken(TokenType.COMMA)
				break
			case '.':
				this.addSingleCharToken(TokenType.DOT)
				break
			case '-':
				this.addSingleCharToken(TokenType.MINUS)
				break
			case '+':
				this.addSingleCharToken(TokenType.PLUS)
				break
			case ';':
				this.addSingleCharToken(TokenType.SEMICOLON)
				break
			case '*':
				this.addSingleCharToken(TokenType.STAR)
				break

			case '!':
				this.addSingleCharToken(
					this.matchNextToken('=') ? TokenType.BANG_EQUAL : TokenType.BANG
				)
				break

			case '=':
				this.addSingleCharToken(
					this.matchNextToken('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL
				)
				break
			case '<':
				this.addSingleCharToken(
					this.matchNextToken('=') ? TokenType.LESS_EQUAL : TokenType.LESS
				)
				break
			case '>':
				this.addSingleCharToken(
					this.matchNextToken('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER
				)
				break

			case '/':
				if (this.matchNextToken('/')) {
					while (this.nextChar !== '\n' && !this.isAtEnd) this.advance()
				} else {
					this.addSingleCharToken(TokenType.SLASH)
				}
				break

			case ' ':
			case '\t':
			case '\r':
				break

			case '\n':
				this.line++
				break

			case '"':
				this.string()
				break

			default:
				console.log(c)
				if (this.isDigit(c)) {
					this.number()
				} else if (this.isAlpha(c)) {
					this.ident()
				} else {
					this.reportError(this.line, this.current, 'Unexpected character.')
				}

				break
		}
	}

	private advance() {
		this.current++
		return this.source.charAt(this.current - 1)
	}

	private addSingleCharToken(type: TokenType) {
		this.addToken(type, null)
	}

	private addToken(type: TokenType, literal: any) {
		const text = this.source.substring(this.start, this.current).trim()
		this.tokens.push(new Token(type, text, literal, this.line))
	}

	private matchNextToken(expected: string): boolean {
		if (this.isAtEnd) return false
		if (this.source.charAt(this.current) !== expected) return false
		this.current++
		return true
	}

	private get nextChar(): string {
		if (this.isAtEnd) return '\0'

		return this.source.charAt(this.current)
	}

	private get nextSkipChar(): string {
		if (this.current + 1 >= this.source.length) return '\0'

		return this.source.charAt(this.current + 1)
	}

	private isAlpha(c: string) {
		return (
			// c.toUpperCase() !== c.toLowerCase() || c === '_'
			/[a-zA-Z]/.test(c)
			// RegExp(/^\p{L}/, 'u').test(c)
		)
	}

	private isAlphaNumeric(c: string) {
		return this.isAlpha(c) || this.isDigit(c)
	}

	private string() {
		while (this.nextChar !== '"' && !this.isAtEnd) {
			if (this.nextChar === '\n') this.line++
			this.advance()
		}

		if (this.isAtEnd) {
			this.reportError(this.line, this.current, 'unterminated string')
			return
		}

		this.advance()

		const literal = this.source.substring(this.start + 1, this.current - 1)

		this.addToken(TokenType.STRING, literal)
	}

	private isDigit(c: string): boolean {
		return !isNaN(+c)
	}

	private number() {
		while (this.isDigit(this.nextChar)) this.advance()
		// console.log(this.isDigit(this.nextChar))

		if (this.nextChar == '.' && this.isDigit(this.nextSkipChar)) {
			this.advance()

			while (this.isDigit(this.nextChar)) this.advance()
		}

		this.addToken(
			TokenType.NUMBER,
			parseFloat(this.source.substring(this.start, this.current))
		)
	}

	private ident() {
		while (this.isAlphaNumeric(this.nextChar)) this.advance()

		const text = this.source.substring(this.start, this.current).trim()

		console.log(keywords)

		const type = keywords[text] || TokenType.IDENTIFIER

		this.addSingleCharToken(type)
	}
}
