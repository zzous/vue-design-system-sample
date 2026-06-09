import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const TGZ_DIR = path.join(ROOT, 'nexus-tgz')
const MANIFEST = path.join(TGZ_DIR, 'manifest.json')
const BACKUP_DIR = path.join(ROOT, '.nexus-install-backup')
const PKG_PATH = path.join(ROOT, 'package.json')
const NPMRC_PATH = path.join(ROOT, '.npmrc')
const LOCK_PATH = path.join(ROOT, 'pnpm-lock.yaml')
const NODE_MODULES = path.join(ROOT, 'node_modules')

const isRestore = process.argv.includes('--restore')

function toPosixPath(filePath) {
  return filePath.split(path.sep).join('/')
}

function buildOverrides(packages) {
  const overrides = {}

  for (const pkg of packages) {
    if (pkg.error || !pkg.filename) continue

    const tgzPath = toPosixPath(path.join('./nexus-tgz', pkg.filename))
    overrides[`${pkg.name}@${pkg.version}`] = `file:${tgzPath}`
  }

  return overrides
}

function backupFile(source, name) {
  if (!fs.existsSync(source)) return
  fs.copyFileSync(source, path.join(BACKUP_DIR, name))
}

function restore() {
  if (!fs.existsSync(BACKUP_DIR)) {
    console.error('백업이 없습니다. test:nexus-install 을 먼저 실행했는지 확인하세요.')
    process.exit(1)
  }

  for (const name of ['package.json', '.npmrc', 'pnpm-lock.yaml']) {
    const backup = path.join(BACKUP_DIR, name)
    const target = path.join(ROOT, name)
    if (fs.existsSync(backup)) {
      fs.copyFileSync(backup, target)
    } else if (name === '.npmrc' && fs.existsSync(target)) {
      fs.unlinkSync(target)
    }
  }

  console.log('package.json / .npmrc / pnpm-lock.yaml 복구 완료')
  console.log('node_modules 는 pnpm install 로 다시 설치하세요.')
}

function installFromNexusTgz() {
  if (!fs.existsSync(MANIFEST)) {
    console.error('nexus-tgz/manifest.json 이 없습니다. 먼저 pnpm run export:nexus-tgz 를 실행하세요.')
    process.exit(1)
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
  const rootPkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'))
  const overrides = buildOverrides(manifest.packages)

  fs.rmSync(BACKUP_DIR, { recursive: true, force: true })
  fs.mkdirSync(BACKUP_DIR, { recursive: true })

  backupFile(PKG_PATH, 'package.json')
  backupFile(NPMRC_PATH, '.npmrc')
  backupFile(LOCK_PATH, 'pnpm-lock.yaml')

  rootPkg.pnpm = {
    ...(rootPkg.pnpm ?? {}),
    overrides,
  }
  fs.writeFileSync(PKG_PATH, `${JSON.stringify(rootPkg, null, 2)}\n`)

  fs.writeFileSync(
    NPMRC_PATH,
    [
      'registry=https://invalid.local/',
      'prefer-offline=true',
      'fetch-retries=0',
      '',
    ].join('\n'),
  )

  if (fs.existsSync(NODE_MODULES)) {
    console.log('node_modules 삭제 중...')
    fs.rmSync(NODE_MODULES, { recursive: true, force: true })
  }

  if (fs.existsSync(LOCK_PATH)) {
    console.log('pnpm-lock.yaml 삭제 중... (tgz 기준 재해석)')
    fs.unlinkSync(LOCK_PATH)
  }

  console.log(`루트 install 준비 완료 (${Object.keys(overrides).length}개 tgz 연결)`)
  console.log('pnpm install 실행 중...')

  execSync('pnpm install', {
    cwd: ROOT,
    stdio: 'inherit',
    env: {
      ...process.env,
      npm_config_registry: 'https://invalid.local/',
    },
  })

  console.log('')
  console.log('nexus-tgz 기반 루트 install 테스트 성공')
  console.log('복구: pnpm run test:nexus-install:restore 후 pnpm install')
}

if (isRestore) {
  restore()
} else {
  installFromNexusTgz()
}
