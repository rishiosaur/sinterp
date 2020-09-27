import { scanFile } from '../index'
import { join } from 'path'
import { readFileSync } from 'fs'

console.log(readFileSync(join('./t.lox')))
